import as from 'auriserve';

import Theme from './Theme';
import ThemeLoader from './ThemeLoader';

const { logger: Log } = as.core;

export default class ThemeManager {
	readonly loader: ThemeLoader;

	readonly themes: Map<string, Theme> = new Map();

	constructor(readonly themeDir: string) {
		this.loader = new ThemeLoader(this, themeDir);
	}

	async init() {
		await this.loader.init();
		for (const [, theme] of this.themes) {
			Log.debug(await theme.getCSS());
		}
	}

	addTheme(theme: Theme) {
		this.themes.set(theme.manifest.identifier, theme);
	}
}
