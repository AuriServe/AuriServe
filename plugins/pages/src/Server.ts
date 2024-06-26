import { root } from 'routes';
import { promises as fs } from 'fs';
import path, { resolve } from 'path';
import { log, dataPath, plugins, router, Watcher, config } from 'auriserve';

import PageRoute from './PageRoute';
import { addInjector } from './Injectors';
import { cache, clearCache } from './Database';
import { reloadClients, startDebugSocket } from './Debug';

export { default as PageRoute } from './PageRoute';
export { registeredLayouts, registerLayout, unregisterLayout } from './Layouts';
export { registeredInjectors, addInjector, removeInjector } from './Injectors';
export { buildPage, populateLayout } from './PageBuilder';
export { isElementNode, isIncludeNode } from './Interface';

export type { Document, PageDocument, IncludeDocument, PageMetadata, IncludeMetadata,
	Node, ElementNode, IncludeNode } from './Interface';

const watchers: any[] = [];

async function loadPage(pagesPath: string, page: string) {
	const pagePath = path.join(pagesPath, page);

	async function loadPage() {
		cache(page, await fs.readFile(pagePath, 'utf8'));
	}

	loadPage();

	if (config.debug) {
		const watcher = new Watcher([ pagePath ]);
		watcher.bind(() => {
			log.debug('Reloading page \'%s\'.', page);
			loadPage();
			reloadClients();
		});
		watchers.push(watcher);
	}
}

async function loadAndWatchPages(pagesPath: string) {
	for (const watcher of watchers) watcher.stop();
	watchers.length = 0;
	clearCache();

	async function getPages(dirPath: string): Promise<string[]> {
		const items = await fs.readdir(dirPath, { withFileTypes: true });
		const files = await Promise.all(items.map(async (item) => {
			const res = resolve(dirPath, item.name);
			return item.isDirectory() ? await getPages(res) : res;
		}));
		return Array.prototype.concat(...files);
	}


	const pages = (await getPages(pagesPath)).map((page) => path.relative(pagesPath, page));
	await Promise.all(pages.map((page) => loadPage(pagesPath, page)));

	for (const page of pages.filter(page => !page.startsWith('includes'))) {
		const routeStr = JSON.parse(await fs.readFile(path.join(pagesPath, page), 'utf8')).metadata?.route;
		if (routeStr) {
			log.debug('Adding page route \'%s\'.', routeStr);
			root.add(routeStr, new PageRoute(routeStr, page));
		}
	}
}

const pagesDir = path.join(dataPath, 'pages');
loadAndWatchPages(pagesDir);

const asyncClientBuildPath = path.join(dataPath, 'plugins/client.js');
const syncClientBuildPath = path.join(dataPath, 'plugins/client_sync.js');

const PLUGIN_TIMEOUT = 200;

// TODO: An event should exist for all plugins loaded.
setTimeout(async () => {
	const asyncPaths = [ ...plugins.values()].filter(plugin => plugin.entry.client)
		.map(plugin => `${plugin.identifier}/${plugin.entry.client}`);

	log.info(`Client Plugins: ${asyncPaths.map(path => `'${path.split('/')[0]}'`).join(', ')}`);

	await fs.writeFile(asyncClientBuildPath,
		(await Promise.all(asyncPaths.map(pluginPath => fs.readFile(path.join(__dirname, '../../', pluginPath), 'utf8'))))
			.join('\n'));

	const syncPaths = [ ...plugins.values()].filter(plugin => plugin.entry.client_sync)
	.map(plugin => `${plugin.identifier}/${plugin.entry.client_sync}`);

	log.info(`Client Plugins (sync): ${syncPaths.map(path => `'${path.split('/')[0]}'`).join(', ')}`);

	await fs.writeFile(syncClientBuildPath,
		(await Promise.all(syncPaths.map(pluginPath => fs.readFile(path.join(__dirname, '../../', pluginPath), 'utf8'))))
			.join('\n'));
}, PLUGIN_TIMEOUT);

router.get('/client.js', async (_: any, res: any) => {
	res.send(await fs.readFile(asyncClientBuildPath, 'utf8'));
});

addInjector('head', () => `<script defer src='/client.js'></script>`);
addInjector('body_end', async () => `<script>${await fs.readFile(syncClientBuildPath, 'utf8')}</script>`);

if (config.debug) startDebugSocket();

export { getDocument } from './Database';
export { reloadClients } from './Debug';
export { usePageContext } from './Hooks';
export type { PageContext } from './Hooks';
