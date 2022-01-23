import path from 'path';
import CleanCSS from 'clean-css';
import { promises as fs } from 'fs';

import Theme from './Theme';
import ThemeLoader from './ThemeLoader';

export default class ThemeManager {
	readonly loader: ThemeLoader;

	readonly themes: Map<string, Theme> = new Map();

	readonly buildDir: string;

	constructor(readonly themeDir: string) {
		this.buildDir = path.join(themeDir, 'build');
		this.loader = new ThemeLoader(this, themeDir);
	}

	async init() {
		// db
		// 	.prepare(
		// 		`CREATE TABLE IF NOT EXISTS themes (
		// 			identifier TEXT PRIMARY KEY,
		// 			enabled INTEGER NOT NULL DEFAULT FALSE
		// 			options TEXT DEFAULT ''
		// 			css: TEXT
		// 			head: TEXT
		// 		) STRICT`
		// 	)
		// 	.run();

		// // TODO: Stupid dumb fake query
		// db.prepare('DELETE FROM themes').run();

		await this.loader.init();

		await this.buildThemes();

		// TODO: Stupid dumb fake query
		// db
		// 	.prepare(
		// 		`INSERT OR REPLACE INTO themes(identifier, enabled) VALUES('test_theme', 1)`
		// 	)
		// 	.run();

		// const enabled = db
		// 	.prepare(`SELECT identifier FROM plugins WHERE enabled = 1`)
		// 	.pluck()
		// 	.all();
		// for (const [, theme] of this.themes) {
		// Log.debug(await theme.getCSS());
		// }
	}

	addTheme(theme: Theme) {
		this.themes.set(theme.manifest.identifier, theme);
	}

	async buildThemes() {
		let style = (
			await Promise.all([...this.themes.values()].map((theme) => theme.buildCSS()))
		).join('\n');
		const head = (
			await Promise.all([...this.themes.values()].map((theme) => theme.buildHead()))
		).join('\n');

		style = new CleanCSS({ level: 2 }).minify(style).styles;

		await Promise.all([
			fs.writeFile(path.join(this.buildDir, 'style.css'), style),
			fs.writeFile(path.join(this.buildDir, 'head.html'), head),
		]);
	}

	listEnabled() {
		return [...this.themes.values()].filter(Boolean);
	}
}
