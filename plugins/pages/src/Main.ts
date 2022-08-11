import path from 'path';
import as from 'auriserve';
import { assert } from 'common';
import { promises as fs } from 'fs';
import escapeHtml from 'escape-html';

// import { Page } from './Interface';
import PageRoute from './PageRoute';
import { Node, isIncludeNode, ElementNode, Include } from './Interface';

const { log, database: db } = as.core;

db.exec('DROP TABLE IF EXISTS pages');
db.exec('DROP TABLE IF EXISTS includes');

db.prepare(
	'CREATE TABLE IF NOT EXISTS pages (content TEXT, includes TEXT)'
).run();

db.prepare(
	'CREATE TABLE IF NOT EXISTS includes (content TEXT, includes TEXT)'
).run();

const getSectionRegex = (section: string) => {
	return new RegExp(
		`(?<start><(?<tag>[A-z1-9]+)(?: +[A-z1-9-]+(?:=(?:(?<d1>['']).*?(?<!\\\\)\\k<d1>))*)*? +(?:data-include)(?:=(?<value>(?<q>[''])${section}(?<!\\\\)\\k<q>))*(?: +[A-z1-9-]+(?:=(?:(?<d2>['']).*?(?<!\\\\)\\k<d2>))*)*?\\/?>)(\\s*)(?<end><\\/\\k<tag>>)`,
		'gi'
	);
};

as.pages = {
	PageRoute,

	registeredLayouts: new Map(),

	registerLayout(identifier: string, layout: string): void {
		as.pages.registeredLayouts.set(identifier, layout);
	},

	unregisterLayout(identifier: string): boolean {
		return as.pages.registeredLayouts.delete(identifier);
	},

	registeredInjectors: {
		head: new Set(),
		body_start: new Set(),
		body_end: new Set(),
	},

	addInjector(section, injector) {
		as.pages.registeredInjectors[section].add(injector);
		return injector;
	},

	removeInjector(section, injector) {
		if (!as.pages.registeredInjectors[section].has(injector)) return false;
		as.pages.registeredInjectors[section].delete(injector);
		return true;
	},

	async buildPage(page, includes = new Map()): Promise<string> {
		const perfName = `Building page '${page.metadata.title ?? 'Untitled'}'`;

		function resolveIncludes(node: Node): void {
			while (isIncludeNode(node)) {
				const include: Include | undefined = includes.get(node.include);
				assert(include, 'Include not found');
				delete (node as any).include;
				for (const [ k, v ] of Object.entries(include.content)) (node as any)[k] = v;
			}

			for (const child of (node as ElementNode).children ?? []) resolveIncludes(child);
		}

		for (const section of Object.values(page.content.sections)) resolveIncludes(section);

		log.perfStart(perfName);

		const [injectHead, injectBodyStart, injectBodyEnd, populatedLayout] =
			await Promise.all([
				Promise.all(
					[...as.pages.registeredInjectors.head].map((injector) => injector())
				).then((res) => res.join('\n')),
				Promise.all(
					[...as.pages.registeredInjectors.body_start].map((injector) => injector())
				).then((res) => res.join('\n')),
				Promise.all(
					[...as.pages.registeredInjectors.body_end].map((injector) => injector())
				).then((res) => res.join('\n')),
				as.pages.populateLayout(page.content.layout ?? 'default', page.content.sections),
			]);

		const html = `
		<!DOCTYPE html>
		<html lang='en'>
			<head>
				<meta charset='utf-8'/>
				<meta name='description' content='${escapeHtml(page.metadata.description)}'>
				<meta name='viewport' content='width=device-width, initial-scale=1'>
				${page.metadata.index === false ? `<meta name='robots' content='noindex'>` : ''}
				<title>${escapeHtml(page.metadata.title)}</title>
				${injectHead}
			</head>
			<body id='page'>
				${injectBodyStart}
				${populatedLayout}
				${injectBodyEnd}
			</body>
		</html>`;

		log.perfEnd(perfName);
		return html;
	},

	async populateLayout(identifier, sections): Promise<string> {
		let layout = as.pages.registeredLayouts.get(identifier);
		assert(layout, `Layout '${identifier}' not found.`);

		const sectionContents: Record<string, string> = {};

		await Promise.all(
			Object.entries(sections).map(async ([key, section]) => {
				const contents = await as.elements.renderTree(section as any);
				sectionContents[key] = contents;
			})
		);

		for (const section of Object.keys(sections)) {
			layout = layout.replace(
				getSectionRegex(section),
				`$<start>${sectionContents[section]}$<end>`
			);
		}

		return layout;
	},
};

as.pages.registerLayout(
	'default',
`
<input type='checkbox' id='navigation_toggle' style='display: none;'/>
<header id='header' data-include='header'></header>
<main id='main' data-include='main'></main>
<footer id='footer' data-include='footer'></footer>
`
);

(async () => {
	const home = await fs.readFile(path.join(__dirname, '..', 'home.json'), 'utf8');
	const unsubscribe = await fs.readFile(path.join(__dirname, '..', 'unsubscribe.json'), 'utf8');

	db.prepare('DELETE FROM pages').run();
	db.prepare('DELETE FROM includes').run();

	const { lastInsertRowid: homeID } = db.prepare<string>(
		'INSERT INTO pages (content, includes) VALUES (?, \'[]\')'
	).run(home);

	const { lastInsertRowid: unsubscribeID } = db.prepare<string>(
		'INSERT INTO pages (content, includes) VALUES (?, \'[]\')'
	).run(unsubscribe);

	const root = new PageRoute('/', homeID as number);
	root.add('unsubscribe', new PageRoute('/unsubscribe', unsubscribeID as number));
	as.routes.setRoot(root);
})();

const buildPath = path.join(__dirname, '../../../server/site-data/plugins/client.js');

// TODO: An event should exist for all plugins loaded.
setTimeout(async () => {
	const paths = [ ...as.core.plugins.values()].filter(plugin => plugin.entry.client)
		.map(plugin => `${plugin.identifier}/${plugin.entry.client}`);

	log.info(`Found client plugins: ${paths.map(path => `'${path}'`).join(', ')}`);

	await fs.writeFile(buildPath,
		(await Promise.all(paths.map(pluginPath => fs.readFile(path.join(__dirname, '../../', pluginPath), 'utf8'))))
			.join('\n'));
}, 500);

as.core.router.get('/client.js', async (_, res) => {
	res.send(await fs.readFile(buildPath, 'utf8'));
});

as.pages.addInjector('head', () => `<script defer src='/client.js'></script>`);

as.core.once('cleanup', () => as.unexport('pages'));

export * from './API';
export * from './Interface';
export { default as PageRoute } from './PageRoute';
