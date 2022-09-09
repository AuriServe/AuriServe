import { DirectoryRoute, root } from 'routes';
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
export { isElementNode, isIncludeNode } from './Interface';

export type { Document, PageDocument, IncludeDocument, PageMetadata, IncludeMetadata,
	Node, ElementNode, IncludeNode } from './Interface';

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

	const pages = (await getPages(pagesPath)).map((page) => path.relative(pagesPath, page));
	await Promise.all(pages.map(async (page) => cache(page, await fs.readFile(path.join(pagesPath, page), 'utf8'))));

	for (const page of pages.filter(page => !page.startsWith('includes'))) {
		const pathSegments = page.replace(/.json$/, '').split('/');
		const lastSegment = pathSegments.pop()!;

		let parent = root;
		for (let i = 0; i < pathSegments.length; i++) {
			let child = await parent.get(pathSegments[i]);
			if (!child) {
				child = new DirectoryRoute(`${parent.getPath()}/${pathSegments[i]}`);
				parent.add(pathSegments[i], child);
			}
			parent = child;
		}

		parent.add(lastSegment, new PageRoute(`${parent.getPath()}/${lastSegment}`, page));
	}
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

export { getDocument } from './Database';
