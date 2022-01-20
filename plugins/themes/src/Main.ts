import path from 'path';
import as from 'auriserve';
import { promises as fs } from 'fs';

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

// as.themes = {
// 	// async getThemeCSS(): Promise<string> {
// 	// 	return (await Promise.all(themes.listEnabled().map((theme) => theme.getCSS()))).join(
// 	// 		'\n'
// 	// 	);
// 	// },
// };

const headInjector = as.pages.addInjector(
	'head',
	async () =>
		`<style>${await fs.readFile(path.join(themes.buildDir, 'style.css'), 'utf8')}</style>`
);
const styleInjector = as.pages.addInjector('head', () =>
	fs.readFile(path.join(themes.buildDir, 'head.html'), 'utf8')
);

as.core.once('cleanup', () => {
	as.pages.removeInjector('head', headInjector);
	as.pages.removeInjector('head', styleInjector);
	as.unexport('themes');
});
