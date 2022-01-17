import path from 'path';
import as from 'auriserve';
import { assert } from 'common';
import { promises as fs } from 'fs';
import escapeHtml from 'escape-html';

import API from './API';
import { Page } from './Interface';
import PageRoute from './PageRoute';

const { logger: Log } = as.core;

declare global {
	export interface AuriServeAPI {
		pages: API;
	}
}

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
	},

	removeInjector(section, injector) {
		if (!as.pages.registeredInjectors[section].has(injector)) return false;
		as.pages.registeredInjectors[section].delete(injector);
		return true;
	},

	async buildPage(page) {
		const perfName = `Building page '${page.metadata.title ?? 'Untitled'}'`;
		Log.perfStart(perfName);

		const [injectHead, injectBodyStart, injectBodyEnd, populatedLayout, themeCSS] =
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
				as.themes.getThemeCSS(),
			]);

		const html = `
		<!DOCTYPE html>
		<html lang='en'>
			<head>
				<meta charset='utf-8'/>
				<meta name='description' content='${escapeHtml(page.metadata.description)}'>
				<meta name='viewport' content='width=device-width, initial-scale=1'>
				<title>${escapeHtml(page.metadata.title)}</title>
				<style>${themeCSS}</style>
				${injectHead}
			</head>
			<body id='page'>
				${injectBodyStart}
				${populatedLayout}
				${injectBodyEnd}
			</body>
		</html>`;

		Log.perfEnd(perfName);
		return html;
	},

	async populateLayout(identifier, sections): Promise<string> {
		let layout = as.pages.registeredLayouts.get(identifier);
		assert(layout, `Layout '${identifier}' not found.`);

		const sectionContents = Object.fromEntries(
			await Promise.all(
				Object.entries(sections).map(
					([key, section]) =>
						new Promise<[string, string]>((resolve) =>
							as.elements
								.renderTree(section as any)
								.then((contents) => resolve([key, contents]))
						)
				)
			)
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
<header id='header' data-include='header'></header>
<main id='main' data-include='main'></main>
<footer id='footer' data-include='footer'></footer>
`
);

(async () => {
	const pagePath = path.resolve(path.join(__dirname, '..', 'contact.json'));
	const rawPage = JSON.parse(await fs.readFile(pagePath, 'utf8')) as Page;

	as.routes.setRoot(
		new (class extends (as.routes.BaseRoute as any) {
			async render() {
				return await as.pages.buildPage(rawPage);
			}
			// eslint-disable-next-line
			// @ts-ignore
		})('/') as any
	);
})();

as.core.once('cleanup', () => as.unexport('pages'));

export * from './Interface';
export { default as PageRoute } from './PageRoute';
