import * as path from 'path';
// import debounce from 'debounce';
import { promises as fs } from 'fs';
// const watch = require('recursive-watch') as any;

import Logger from '../../Logger';
import Config from './ThemeConfig';
import { OUT_FILE } from '../Themes';
import SassBuilder from './SassBuilder';


/**
 * Represents a single theme.
 */

export default class Theme {
	hasCover: boolean = false;

	private enabled: boolean = false;
	private layouts: Map<string, string> = new Map();

	// private parsing = false;
	private watcher: (() => void) | undefined = undefined;
	// private debounceRefresh = debounce(() => {
	// 	Logger.debug('Reloading theme %s.', this.config.identifier);
	// 	this.disable(false);
	// 	this.enable();
	// }, 200);

	constructor(readonly config: Config, private dataPath: string) {
		fs.stat(path.join(this.dataPath, 'themes', this.config.identifier, 'cover.jpg'))
			.then(() => this.hasCover = true).catch(() => {});
	}


	/**
	 * Checks if this theme is enabled or not.
	 *
	 * @returns a boolean indicating if the theme is enabled.
	 */

	isEnabled(): boolean {
		return this.enabled;
	}


	/**
	 * Enables this theme.
	 */

	enable() {
		if (this.enabled) return;
		this.enabled = true;
		// this.parse().then(() => this.watch());
	}


	/**
	 * Disables this theme.
	 *
	 * @param {boolean} stopWatch - Whether or not the watcher should be unbound. Default true.
	 */

	disable(stopWatch: boolean = true) {
		if (!this.enabled) return;
		this.enabled = false;

		fs.unlink(path.join(this.dataPath, 'themes', OUT_FILE, this.config.identifier + '.css'))
			.catch(() => { /** The file didn't exist, so don't worry about it. */ });

		if (stopWatch) {
			this.watcher?.();
			this.watcher = undefined;
		}
	}


	/**
	 * Gets all of the layout for this theme.
	 *
	 * @returns a map of identifier / layout pairs.
	 */

	getLayouts() {
		return this.layouts;
	}


	/**
	 * Parses and builds theme theme.
	 */

	async parse(): Promise<string> {
		try {
			const css = new SassBuilder()
				.fromFile(path.join(this.dataPath, 'themes', this.config.identifier, 'style', 'Main.sass'))
				.build().then(r => r.css);

			this.layouts.clear();
			try {
				await Promise.all((await fs.readdir(path.join(this.dataPath, 'themes', this.config.identifier, 'layout'))).map(async f => {
					if (!(await fs.lstat(path.join(this.dataPath, 'themes', this.config.identifier, 'layout', f))).isFile()) return;

					let file = (await fs.readFile(path.join(this.dataPath, 'themes', this.config.identifier, 'layout', f))).toString();
					this.layouts.set(path.basename(f, '.html'), file);
				}));
			}
			catch {}

			return await css;
		}
		catch (e) {
			Logger.error('Failed to parse theme %s.\n%s', this.config.identifier, e);
			return '';
		}
	}


	/**
	 * Watches the theme's directory for changes, reloading if it finds any.
	 */

	// private watch() {
	// 	if (this.watcher) return;

	// 	this.watcher = watch(path.join(this.dataPath, 'themes', this.config.identifier, 'style', 'Main.sass'), this.debounceRefresh);
	// 	Logger.debug('Watching theme %s for changes.', this.config.identifier);
	// }
}
