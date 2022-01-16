import path from 'path';
import as from 'auriserve';
import { promises as fs, constants as fsc } from 'fs';

import Theme from './Theme';
import ThemeManager from './ThemeManager';

const { YAML, logger: Log } = as.core;

export default class ThemeLoader {
	constructor(private manager: ThemeManager, private themeDir: string) {}

	async init() {
		const themeDirs = (
			await Promise.all(
				(
					await fs.readdir(this.themeDir)
				).map(async (dir) => {
					try {
						await fs.access(path.join(this.themeDir, dir, 'manifest.yaml'), fsc.R_OK);
						return dir;
					} catch (e) {
						return false;
					}
				})
			)
		).filter(Boolean) as string[];

		Log.info(`Found plugins: ${themeDirs.map((dir) => `'${dir}'`).join(', ')}.`);

		await Promise.all(themeDirs.map((dir) => this.parseTheme(dir)));
	}

	private async parseTheme(dir: string) {
		console.log(`parsing ${dir}.`);
		const manifest = YAML.parse(
			await fs.readFile(path.join(this.themeDir, dir, 'manifest.yaml'), 'utf8')
		);
		const theme = new Theme(this.manager, manifest);
		this.manager.addTheme(theme);
	}
}
