import { setRoot } from 'routes';
import { promises as fs } from 'fs';
import path, { resolve } from 'path';
import { log, dataPath, plugins, router } from 'auriserve';

import PageRoute from './PageRoute';
import { addInjector } from './Injectors';
import { cache, clearCache } from './Database';

export { default as PageRoute } from './PageRoute';
export { registeredLayouts, registerLayout, unregisterLayout } from './Layouts';
export { registeredInjectors, addInjector, removeInjector } from './Injectors';
export { buildPage, populateLayout } from './PageBuilder';
export { isComponentNode, isIncludeNode, isPopulatedIncludeNode } from './Interface';

export type { Page, Include, Metadata, Node, ElementNode, IncludeNode, PopulatedIncludeNode } from './Interface';

async function importPages(pagesPath: string) {
	clearCache();

	async function getPages(dirPath: string): Promise<string[]> {
		const items = await fs.readdir(dirPath, { withFileTypes: true });
		const files = await Promise.all(items.map(async (item) => {
			const res = resolve(dirPath, item.name);
			return item.isDirectory() ? await getPages(res) : res;
		}));
		return Array.prototype.concat(...files);
	}

	const pages = await getPages(pagesPath);

	pages.forEach(page => cache(page));

	const root = new PageRoute('/', path.join(pagesPath, 'index.json'));

	pages.forEach(page => {
		const pageName = page.split('/').pop()!.replace('.json', '');
		if (pageName === 'index') return;
		root.add(pageName, new PageRoute(`/${pageName}`, page));
	})

	setRoot(root);
}

const pagesDir = path.join(dataPath, 'pages');
importPages(pagesDir);

const buildPath = path.join(dataPath, 'plugins/client.js');

// TODO: An event should exist for all plugins loaded.
setTimeout(async () => {
	const paths = [ ...plugins.values()].filter(plugin => plugin.entry.client)
		.map(plugin => `${plugin.identifier}/${plugin.entry.client}`);

	log.info(`Client Plugins: ${paths.map(path => `'${path.split('/')[0]}'`).join(', ')}`);

	await fs.writeFile(buildPath,
		(await Promise.all(paths.map(pluginPath => fs.readFile(path.join(__dirname, '../../', pluginPath), 'utf8'))))
			.join('\n'));
}, 500);

router.get('/client.js', async (_, res) => {
	res.send(await fs.readFile(buildPath, 'utf8'));
});

addInjector('head', () => `<script defer src='/client.js'></script>`);

export { getPage } from './Database';
