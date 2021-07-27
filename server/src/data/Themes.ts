import path from 'path';
import { Format } from 'common';
import fss, { promises as fs, constants as fsc } from 'fs';

import Logger from '../Logger';
import Theme from './theme/Theme';
import ThemeConfig from './theme/ThemeConfig';

import Properties from './model/Properties';

export const OUT_FILE = '.build.css';

// The css reset styles.
const CSS_RESET = fss.readFileSync(path.join(path.dirname(__dirname), 'views', 'reset.css')).toString();

/**
 * Manages themes and theme states.
 */

export default class Themes {
	private themes: Map<string, Theme> = new Map();

	constructor(private dataPath: string) {
		// Create themes directory if it doesn't exist.
		fs.access(path.join(this.dataPath, 'themes'), fsc.R_OK).catch(
			_ => fs.mkdir(path.join(this.dataPath, 'themes')));
		// // Create themes out directory if it doesn't exist.
		// fs.access(path.join(this.dataPath, 'themes', OUT_DIR), fsc.R_OK).catch(
		// 	_ => fs.mkdir(path.join(this.dataPath, 'themes', OUT_DIR)));
	};


	/**
	 * Loads themes from the filesystem and
	 * enables those which were previously enabled.
	 */

	async init() {
		await this.refresh();
		((await Properties.findOne())?.enabled.themes ?? []).forEach((t: string) => this.enable(t));
		this.syncToDb();
	}


	/**
	 * Enables the themes specified, and disables all other ones.
	 *
	 * @param {string[]} identifiers - The themes to enable.
	 */

	setEnabled(identifiers: string[]) {
		this.themes.forEach(t => {
			if (identifiers.includes(t.config.identifier)) t.enable();
			else t.disable();
		});
		this.buildThemeCSS();
	}


	/**
	 * Enables a theme with the identifier provided.
	 *
	 * @param {string} identifier - The theme identifier.
	 */

	enable(identifier: string) {
		this.themes.get(identifier)?.enable();
		this.buildThemeCSS();
	}


	/**
	 * Disables a theme with the identifier provided.
	 *
	 * @param {string} identifier - The theme identifier.
	 */

	disable(identifier: string) {
		this.themes.get(identifier)?.disable();
		this.buildThemeCSS();
	}


	/**
	 * Gets a theme from the identifier provided.
	 *
	 * @param {string} identifier - The identifier of the theme to get.
	 * @returns the theme, if it exists.
	 */

	get = (identifier: string) => this.themes.get(identifier);


	/**
	 * Returns a list of enabled themes.
	 */

	listEnabled = () => [ ...this.themes.values() ].filter(t => t.isEnabled());


	/**
	 * Returns a list of all themes.
	 */

	listAll = () => [ ...this.themes.values() ];


	/**
	 * Lists all enabled layouts.
	 */

	listLayouts() {
		const layouts = new Map<string, string>();
		[ ...this.themes.values() ].filter(t => t.isEnabled()).forEach(t => t.getLayouts().forEach((v, k) => layouts.set(k, v)));
		return layouts;
	}


	/**
	 * Disables all themes, and refreshes the theme listings from the themes directory.
	 */

	async refresh() {
		this.themes.forEach(t => t.disable());
		this.themes.clear();

		const themeDirs = await fs.readdir(path.join(this.dataPath, 'themes'));
		await Promise.all(themeDirs.map(async dirName => {
			if (dirName === OUT_FILE) return;
			try {
				const config = await this.validate(dirName);
				this.themes.set(config.identifier, new Theme(config, this.dataPath));
			}
			catch (e) {
				Logger.error('Encountered an error parsing theme %s:\n %s', dirName, e);
			}
		}));
	}


	/**
	 * Saves the current list of enabled plugins to
	 * the database, and shuts down all plugins.
	 */

	async cleanup() {
		await this.syncToDb();
		this.themes.forEach(t => t.disable());
	}


	/**
	 * Saves the current list of enabled themes to the database.
	 */

	private async syncToDb() {
		await Properties.updateOne({}, { $set: { 'enabled.themes': [ ...this.themes.values() ]
			.filter(t => t.isEnabled()).map(t => t.config.identifier) } });
	}


	/**
	 * Validates a theme directory, and returns the theme's config.
	 * Throws if the theme is ill-formed.
	 *
	 * @param {string} identifier - The identifier (file name) of the theme.
	 * @returns a configuration object for the theme.
	 */

	private async validate(identifier: string): Promise<ThemeConfig> {

		// Ensure that the theme is structured properly.
		if (Format.sanitize(identifier) !== identifier)
			throw 'Theme identifier must be lowercase alphanumeric.';
		const dir = path.join(this.dataPath, 'themes', identifier);

		if (!(await fs.stat(dir)).isDirectory()) throw 'Theme is not a directory.';

		try { await fs.access(path.join(dir, 'conf.json')); }
		catch (e) { throw 'conf.json not found in theme root directory.'; }

		// Create the configuration file.
		let config: ThemeConfig;
		try { config = JSON.parse((await fs.readFile(path.join(dir, 'conf.json'))).toString()); }
		catch (e) { throw 'Failed to parse configuration file:\n ' + e; }
		config.identifier = identifier;

		config.head ??= '';

		if (config.preprocessor !== 'sass' && config.preprocessor !== '')
			throw 'Preprocessor is not valid.';

		return config;
	}


	/**
	 * Updates the CSS build file to contain the styles from all the themes.
	 */

	private async buildThemeCSS() {
		const segments = [
			CSS_RESET,
			...await Promise.all([ ...this.themes.values() ]
				.filter(t => t.isEnabled()).map(theme => theme.parse()))
		];

		await fs.writeFile(path.join(this.dataPath, 'themes', OUT_FILE),
			segments.join('\n'), { flag: 'w' });
	}
}
