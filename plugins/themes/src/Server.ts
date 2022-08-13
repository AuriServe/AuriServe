import path from 'path';
import auriserve from 'auriserve';
import { promises as fs } from 'fs';
import { addInjector, removeInjector} from 'pages';

import ThemeManager from './ThemeManager';

const themePath = path.join(__dirname, '../../../server/site-data/themes');
export const themes = new ThemeManager(themePath);
themes.init();

const headInjector = addInjector('head', async () =>
	`<style>${await fs.readFile(path.join(themes.buildDir, 'style.css'), 'utf8')}</style>`
);

const styleInjector = addInjector('head', () =>
	fs.readFile(path.join(themes.buildDir, 'head.html'), 'utf8')
);

auriserve.once('cleanup', () => {
	removeInjector('head', headInjector);
	removeInjector('head', styleInjector);
});
