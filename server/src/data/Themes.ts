import path from 'path';
import { Format } from 'common';
import { promises as fs, constants as fsc } from 'fs';

import Logger from '../Logger';
import Properties from './model/Properties';

/** The name that the generated theme CSS file will use. */
export const OUT_FILE = '.build.css';

/** The path to the CSS Reset document. */
const CSS_RESET_PATH = path.resolve(path.join('src', 'views', 'reset.css'));

/** The default layout, included with the server. */
const DEFAULT_LAYOUT_PATH = path.resolve(path.join('src', 'views', 'layout.html'));

/** Represents one theme. */
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

/** Manages finding, toggling, and building themes.*/
export default class Themes {

	/** A map of theme identifiers to themes. */
	private themes: Map<string, Theme> = new Map();

	/** A map of layout identifiers to paths. */
	private layouts: Map<string, string> = new Map();

	constructor(private dataPath: string) {
		// Create themes directory if it doesn't exist.
		fs.access(path.join(this.dataPath, 'themes'), fsc.R_OK).catch(
			_ => fs.mkdir(path.join(this.dataPath, 'themes')));
	};

	/** Enables only the themes specified. */
	async setEnabled(identifiers: string[]) {
		this.themes.forEach(t => t.enabled = identifiers.includes(t.identifier));
		await this.buildThemes();
	}

	/** Enables the theme specified. */
	async enable(identifier: string) {
		const theme = this.themes.get(identifier);
		if (theme) theme.enabled = true;
		await this.buildThemes();
	}

	/** Disables the theme specified. */
	async disable(identifier: string) {
		const theme = this.themes.get(identifier);
		if (theme) theme.enabled = false;
		await this.buildThemes();
	}

	/** Gets the specified theme. */
	get(identifier: string) {
		return this.themes.get(identifier);
	}

	/** Gets a list of enabled themes. */
	listEnabled() {
		return [ ...this.themes.values() ].filter(t => t.enabled);
	}

	/** Gets a list of all themes. */
	listAll() {
		return [ ...this.themes.values() ];
	}

	/** Gets all enabled layouts. */
	listLayouts(): Map<string, string> {
		return this.layouts;
	}

	/** Discover all themes in the directory and updates the themes list. */
	async refresh() {
		this.themes.forEach(t => t.enabled = false);
		this.themes.clear();

		const enabled = ((await Properties.findOne())?.enabled.themes ?? []);
		const themeDirs = await fs.readdir(path.join(this.dataPath, 'themes'));
		await Promise.all(themeDirs.map(async dirName => {
			if (dirName === OUT_FILE) return;

			try {
				const theme = await this.parseTheme(dirName);
				theme.enabled = enabled.includes(theme.identifier);
				this.themes.set(theme.identifier, theme);
			}
			catch (e) {
				Logger.error('Encountered an error parsing theme %s:\n %s', dirName, e);
			}
		}));

		this.buildThemes();
	}

	/** Synchronizes with the database and then cleans up all themes. */
	async cleanup() {
		await this.syncToDb();
		this.themes.clear();
	}

	/** Saves the current list of enabled themes to the database. */
	private async syncToDb() {
		await Properties.updateOne({}, { $set: { 'enabled.themes':
			[ ...this.themes.values() ].filter(t => t.enabled).map(t => t.identifier) } });
	}

	/** Reads a theme directory and returns a Theme. Throws if the theme is invalid. */
	private async parseTheme(identifier: string): Promise<Theme> {
		const confPath = path.join(this.dataPath, 'themes', identifier, 'theme.json');
		const theme: Theme = JSON.parse((await fs.readFile(confPath)).toString());

		// Ensure that the theme has the basic metadata.
		if (typeof theme.identifier !== 'string' || typeof theme.name !== 'string' ||
		typeof theme.author !== 'string' || typeof theme.author !== 'string')
			throw 'Theme is missing metadata. (identifier, name, author, description)';

		// Ensure that the folder name matches the theme identifier.
		if (identifier !== theme.identifier) throw 'Theme directory name must match theme identifier.';

		// Ensure that the identifier is formatted properly.
		if (Format.sanitize(theme.identifier) !== theme.identifier && theme.identifier.length >= 3)
			throw 'Theme identifier must be lowercase alphanumeric, and >= 3 characters.';

		// Assert that the theme has a sources object.
		if (!theme.sources || typeof theme.sources !== 'object')
			throw 'Theme must contain a sources object.';

		// Assert that all theme sources exist.
		const themeRoot = path.join(path.dirname(confPath), theme.sourceRoot ?? '.');
		await Promise.all(Object.entries(theme.sources).map(async ([ source, sourcePath ]) => {
			try { await fs.access(path.join(themeRoot, sourcePath!)); }
			catch (e) { throw `Source file \'${sourcePath}\' not found for source \'${source}\'.`; };
		}));

		return theme;
	}

	/** Combines all theme styles into a single CSS document and writes it to OUT_FILE, loads layouts. */
	private async buildThemes() {
		const resetPromise = fs.readFile(CSS_RESET_PATH);

		const themesPromise = Promise.all([ ...this.themes.values() ]
			.filter(t => t.enabled && t.sources.style)
			.map(theme => fs.readFile(path.join(this.dataPath, 'themes', theme.identifier,
				theme.sourceRoot ?? '.', theme.sources.style!))));

		await fs.writeFile(path.join(this.dataPath, 'themes', OUT_FILE),
			[ (await resetPromise).toString(), ...await themesPromise ].join('\n'), { flag: 'w' });

		this.layouts.clear();
		this.layouts.set('default', DEFAULT_LAYOUT_PATH);
		await Promise.all([ ...this.themes.values() ].map(async theme => {
			if (!theme.enabled || !theme.sources.layout) return;

			const layoutRoot = path.join(this.dataPath, 'themes', theme.identifier,
				theme.sourceRoot ?? '.', theme.sources.layout);
			(await fs.readdir(layoutRoot)).map(layoutName => {
				if (layoutName.endsWith('.html')) this.layouts.set(
					layoutName.replace(/\.html$/, ''), path.join(layoutRoot, layoutName));
			});
		}));
	}
}
