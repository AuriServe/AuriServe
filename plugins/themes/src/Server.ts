import path from 'path';
import auriserve, { dataPath, router } from 'auriserve';
import { promises as fs } from 'fs';
import { addInjector, removeInjector} from 'pages';

import ThemeManager from './ThemeManager';

const themePath = path.join(dataPath, 'themes');
export const themes = new ThemeManager(themePath);
themes.init();

const headInjector = addInjector('head', () =>
	fs.readFile(path.join(themes.buildDir, 'head.html'), 'utf8')
);

const styleInjector = addInjector('head', async () =>
	`<style>${await fs.readFile(path.join(themes.buildDir, 'style.css'), 'utf8')}</style>`
);

const styleRoute = auriserve.router.get('/dashboard/res/page_theme.css', async (_, res) => {
	res.sendFile(path.join(themes.buildDir, 'style.css'));
});

const headRoute = auriserve.router.get('/dashboard/res/page_head.html', async (_, res) => {
	res.sendFile(path.join(themes.buildDir, 'head.html'));
});

auriserve.once('cleanup', () => {
	removeInjector('head', headInjector);
	removeInjector('head', styleInjector);
	router.remove(styleRoute);
	router.remove(headRoute);
});
