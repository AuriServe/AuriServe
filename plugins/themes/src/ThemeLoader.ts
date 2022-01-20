import path from 'path';
import as from 'auriserve';
import { promises as fs, constants as fsc } from 'fs';

import Theme from './Theme';
import ThemeManager from './ThemeManager';

const { YAML, log } = as.core;

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

		log.info(`Found plugins: ${themeDirs.map((dir) => `'${dir}'`).join(', ')}.`);

		await Promise.all(themeDirs.map((dir) => this.parseTheme(dir)));
	}

	private async parseTheme(dir: string) {
		// console.log(`parsing ${dir}.`);
		const manifest = YAML.parse(
			await fs.readFile(path.join(this.themeDir, dir, 'manifest.yaml'), 'utf8')
		);

		const entry = {
			style: typeof manifest.entry === 'string' ? manifest.entry : manifest.entry.style,
			script: typeof manifest.entry === 'string' ? undefined : manifest.entry.script,
			head: typeof manifest.entry === 'string' ? undefined : manifest.entry.head,
		};

		const theme = new Theme(this.manager, { ...manifest, entry });
		this.manager.addTheme(theme);
	}
}
