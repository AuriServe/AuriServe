import path from 'path';
import as from 'auriserve';

import API from './API';
import ThemeManager from './ThemeManager';

declare global {
	interface AuriServeAPI {
		themes: API;
	}
}

const themePath = path.join(__dirname, '../../../site-data/edsraku/themes');
const themes = new ThemeManager(themePath);
themes.init();

as.themes = {
	async getThemeCSS(): Promise<string> {
		return (await Promise.all(themes.listEnabled().map((theme) => theme.getCSS()))).join(
			'\n'
		);
	},
};

as.core.once('cleanup', () => as.unexport('themes'));
