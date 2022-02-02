import path from 'path';
import as from 'auriserve';
import { assert } from 'common';
import { promises as fs, constants as fsc } from 'fs';

import Theme from './Theme';
import { Manifest } from './Manifest';
import ThemeManager from './ThemeManager';

const { YAML, Watcher, log: Log } = as.core;

export default class ThemeLoader {
	/** A map of theme source watchers indexed by their identifiers. */
	private watchers: Map<string, any> = new Map();

	constructor(private manager: ThemeManager) {}

	async init() {
		const themeDirs = (
			await Promise.all(
				(
					await fs.readdir(this.manager.themesPath)
				).map(async (dir) => {
					try {
						await fs.access(
							path.join(this.manager.themesPath, dir, 'manifest.yaml'),
							fsc.R_OK
						);
						return dir;
					} catch (e) {
						return false;
					}
				})
			)
		).filter(Boolean) as string[];

		Log.debug(`Themes: Found ${themeDirs.map((dir) => `'${dir}'`).join(', ')}.`);

		await Promise.all(themeDirs.map((dir) => this.parseTheme(dir)));
	}

	private async parseTheme(dir: string) {
		// console.log(`parsing ${dir}.`);
		const manifest = YAML.parse<Manifest>(
			await fs.readFile(path.join(this.manager.themesPath, dir, 'manifest.yaml'), 'utf8')
		);

		const entry = {
			style: typeof manifest.entry === 'string' ? manifest.entry : manifest.entry.style,
			head: typeof manifest.entry === 'string' ? undefined : manifest.entry.head,
		};

		const watch = [
			...new Set(
				[entry.style, entry.head, ...(manifest.watch || [])].filter(Boolean) as string[]
			),
		];

		const theme = new Theme(this.manager, { ...manifest, entry, watch });
		this.manager.addTheme(theme);
	}

	themeEnabled(identifier: string) {
		this.startWatch(identifier);
	}

	themeDisabled(identifier: string) {
		this.stopWatch(identifier);
	}

	/** Begins watching a theme's source files for changes. */
	private startWatch(identifier: string) {
		this.stopWatch(identifier);
		const theme = this.manager.get(identifier);
		assert(
			theme !== undefined,
			`Theme '${identifier}' cannot be watched, as it does not exist.`
		);
		assert(
			theme.manifest.watch && theme.manifest.watch.length > 0,
			`Theme '${identifier}' has no sources to watch.`
		);

		const watcher = new Watcher(
			theme.manifest.watch.map((file) =>
				path.join(this.manager.themesPath, identifier, file)
			)
		);

		watcher.bind(async () => {
			Log.debug(`Theme '${identifier}' source files changed, reloading.`);
			this.manager.reloadTheme(identifier);
		});

		this.watchers.set(identifier, watcher);
	}

	/** Stops watching a theme's source files for changes. */
	private stopWatch(identifier: string) {
		const watcher = this.watchers.get(identifier);
		if (!watcher) return;

		watcher.stop();
		this.watchers.delete(identifier);
	}
}
