import path from 'path';
import { toIdentifier, assert, isType } from 'common';
import fss, { promises as fs, constants as fsc } from 'fs';

import Logger from '../Log';
import Watcher from '../Watcher';
import Properties from './model/Properties';

/** The name that the generated theme CSS file will use. */
export const OUT_FILE = '.build.css';

/** The path to the CSS Reset document. */
const CSS_RESET_PATH = path.join(__dirname, '..', 'views', 'reset.css');

/** The default layout, included with the server. */
const DEFAULT_LAYOUT_PATH = path.join(__dirname, '..', 'views', 'layout.html');

/** Represents a theme. */
export interface Theme {
	name: string;
	author: string;
	identifier: string;
	description: string;

	sourceRoot?: string;
	sources: {
		head?: string;
		style?: string;
		layout?: string;
	};

	enabled: boolean;
	hasCover: boolean;
}

/** Manages finding, toggling, and loading themes.*/
export default class Themes {
	/** A map of themes indexed by their identifiers. */
	private themes: Map<string, Theme> = new Map();

	/** A map of theme layout paths indexed by their identifiers. */
	private layouts: Map<string, string> = new Map();

	/** A map of theme source watchers indexed by their identifiers. */
	private watchers: Map<string, Watcher> = new Map();

	/** A map of callback identifiers to callbacks. */
	private callbacks: Map<string, ((event?: any) => void)[]> = new Map();

	constructor(private dataPath: string, private watch: boolean) {
		// Create themes directory if it doesn't exist.
		fs.access(path.join(this.dataPath, 'themes'), fsc.R_OK).catch((_) =>
			fs.mkdir(path.join(this.dataPath, 'themes'))
		);
	}

	/**
	 * If watching is enabled, enabled themes' source files will be watched,
	 * and themes will be reloaded when they change.
	 *
	 * @param watch - Whether watching should be enabled.
	 */

	setWatch(watch: boolean) {
		if (this.watch === watch) return;
		this.watch = watch;

		if (this.watch) {
			this.themes.forEach((p) => {
				if (p.enabled) this.startWatch(p.identifier);
			});
		} else {
			for (const p of this.watchers.keys()) this.stopWatch(p);
		}
	}

	/** Enables only the themes specified. */
	async setEnabled(identifiers: string[]) {
		this.themes.forEach((t) => {
			const enabled = identifiers.includes(t.identifier);
			if (t.enabled === enabled) return;

			t.enabled = enabled;
			if (enabled && this.watch) this.startWatch(t.identifier);
			else this.stopWatch(t.identifier);
		});
		await this.buildThemes();
	}

	/** Enables the theme specified. */
	async enable(identifier: string) {
		const theme = this.themes.get(identifier);
		if (!theme || theme.enabled) return;

		theme.enabled = true;
		await this.buildThemes();
		if (this.watch) this.startWatch(identifier);
	}

	/** Disables the theme specified. */
	async disable(identifier: string) {
		const theme = this.themes.get(identifier);
		if (!theme?.enabled) return;

		theme.enabled = false;
		this.stopWatch(identifier);
		await this.buildThemes();
	}

	/** Gets the specified theme. */
	get(identifier: string) {
		return this.themes.get(identifier);
	}

	/** Gets a list of enabled themes. */
	listEnabled() {
		return [...this.themes.values()].filter((t) => t.enabled);
	}

	/** Gets a list of all themes. */
	listAll() {
		return [...this.themes.values()];
	}

	/** Gets all enabled layouts. */
	listLayouts(): Map<string, string> {
		return this.layouts;
	}

	/** Discover all themes in the directory and updates the themes list. */
	async refresh() {
		this.themes.forEach((t) => (t.enabled = false));
		this.themes.clear();

		const enabled = (await Properties.findOne())?.enabled.themes ?? [];
		const themeDirs = await fs.readdir(path.join(this.dataPath, 'themes'));
		await Promise.all(
			themeDirs.map(async (dirName) => {
				if (dirName === OUT_FILE) return;

				try {
					const theme = await this.parseTheme(dirName);
					theme.enabled = enabled.includes(theme.identifier);
					this.themes.set(theme.identifier, theme);
					if (this.watch && theme.enabled) this.startWatch(theme.identifier);
				} catch (e) {
					Logger.error('Encountered an error parsing theme %s:\n %s', dirName, e);
				}
			})
		);

		this.buildThemes();
	}

	/** Synchronizes with the database and then cleans up all themes. */
	async cleanup() {
		await this.syncToDb();
		this.themes.clear();
	}

	bind(event: string, cb: (event?: any) => void) {
		if (!this.callbacks.has(event)) this.callbacks.set(event, []);
		this.callbacks.get(event)!.push(cb);
	}

	unbind(event: string, cb: (event?: any) => void) {
		if (!this.callbacks.has(event)) return;
		this.callbacks.get(event)!.filter((c) => c !== cb);
	}

	/** Saves the current list of enabled themes to the database. */
	private async syncToDb() {
		await Properties.updateOne(
			{},
			{
				$set: {
					'enabled.themes': [...this.themes.values()]
						.filter((t) => t.enabled)
						.map((t) => t.identifier),
				},
			}
		);
	}

	/** Reads a theme directory and returns a Theme. Throws if the theme is invalid. */
	private async parseTheme(identifier: string): Promise<Theme> {
		const confPath = path.join(this.dataPath, 'themes', identifier, 'theme.json');
		const theme: Theme = JSON.parse((await fs.readFile(confPath)).toString());

		assert(
			[theme.identifier, theme.name, theme.author, theme.description]
				.map((v) => isType(v, 'string'))
				.filter((t: any) => t === false).length === 0,
			'Theme is missing metadata (identifier, name, author, description).'
		);

		assert(
			identifier === theme.identifier,
			'Theme identifier does not match directory name.'
		);

		assert(
			identifier === toIdentifier(theme.identifier, 3, 32, false),
			'Theme identifier must be lowercase alphanumeric and at least 3 characters.'
		);

		assert(isType(theme.sources, 'object'), 'Theme must contain a sources object.');

		// Assert that all theme sources exist.
		const themeRoot = path.join(path.dirname(confPath), theme.sourceRoot ?? '.');
		await Promise.all(
			Object.entries(theme.sources).map(
				async ([source, sourcePath]) =>
					await fs
						.access(path.join(themeRoot, sourcePath!))
						.catch((_) =>
							assert(
								false,
								`Source file '${sourcePath}' not found for source '${source}'.`
							)
						)
			)
		);

		return theme;
	}

	/** Combines all theme styles into a single CSS document and writes it to OUT_FILE, loads layouts. */
	private async buildThemes() {
		const resetPromise = new Promise<string>((resolve) =>
			fss.readFile(CSS_RESET_PATH, (_, res) => resolve(res.toString()))
		);

		const themesPromise = Promise.all(
			[...this.themes.values()]
				.filter((t) => t.enabled && t.sources.style)
				.map((theme) =>
					fs.readFile(
						path.join(
							this.dataPath,
							'themes',
							theme.identifier,
							theme.sourceRoot ?? '.',
							theme.sources.style!
						)
					)
				)
		);

		await fs.writeFile(
			path.join(this.dataPath, 'themes', OUT_FILE),
			[(await resetPromise).toString(), ...(await themesPromise)].join('\n'),
			{ flag: 'w' }
		);

		this.layouts.clear();
		this.layouts.set('default', DEFAULT_LAYOUT_PATH);
		await Promise.all(
			[...this.themes.values()].map(async (theme) => {
				if (!theme.enabled || !theme.sources.layout) return;

				const layoutRoot = path.join(
					this.dataPath,
					'themes',
					theme.identifier,
					theme.sourceRoot ?? '.',
					theme.sources.layout
				);
				(await fs.readdir(layoutRoot)).map((layoutName) => {
					if (layoutName.endsWith('.html'))
						this.layouts.set(
							layoutName.replace(/\.html$/, ''),
							path.join(layoutRoot, layoutName)
						);
				});
			})
		);
	}

	/** Begins watching a theme's source files for changes. */
	private startWatch(identifier: string) {
		this.stopWatch(identifier);
		const theme = this.themes.get(identifier);
		assert(
			theme !== undefined,
			`Theme '${identifier}' cannot be watched, as it does not exist.`
		);

		const paths = Object.values(theme.sources).reduce<string[]>((paths, sourcePath) => {
			paths.push(
				path.join(
					this.dataPath,
					'themes',
					identifier,
					theme.sourceRoot ?? '.',
					sourcePath as string
				)
			);
			return paths;
		}, []);

		assert(paths.length > 0, `Theme '${identifier}' has no sources to watch.`);

		const watcher = new Watcher(paths);
		watcher.bind(() => this.watchCallback(identifier));
		this.watchers.set(identifier, watcher);
	}

	/** Stops watching a theme's source files for changes. */
	private stopWatch(identifier: string) {
		const watcher = this.watchers.get(identifier);
		if (!watcher) return;

		watcher.stop();
		this.watchers.delete(identifier);
	}

	/** Triggers a CSS rebuild when a theme changes. */
	private async watchCallback(identifier: string) {
		Logger.debug(`Theme '${identifier}' source files changed, reloading.`);
		this.buildThemes().then(() => this.callbacks.get('refresh')?.forEach((cb) => cb()));
	}
}
