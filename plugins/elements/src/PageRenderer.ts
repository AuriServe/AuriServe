import path from 'path';
import type { VNode } from 'preact';
import escapeHtml from 'escape-html';
import { promises as fs } from 'fs';

import as from 'auriserve';
import { Page } from 'common';

// import path from 'path';
// import Preact from 'preact';
import Element from './Element';
import UndefinedElement from './UndefinedElement';

const {
	preact: { h },
	renderToString,
} = as.preact;

const Logger = as.core.logger;

// import { Query } from 'common/graph';
// import * as Int from 'common/graph/type';

// import Logger from './Logger';
// import Themes from './data/Themes';
// import Plugins from './data/Plugins';
// import Properties from './data/model/Properties';
// import UndefinedElement from './UndefinedElement';

type ExposedMap = Record<string, ExposedTree>;
type ExposedTree = Record<string, Page.ComponentNode>;
// type GQLQueryFunction = (query: string, variables?: any) => Promise<any>;

/** The page template, containing $MARKERS$ for page content. */
const PAGE_TEMPLATE_PATH = path.join(__dirname, '..', 'res', 'page', 'page.html');

/** The error page template, containing $MARKERS$ for page content. */
const ERROR_TEMPLATE_PATH = path.join(__dirname, '..', 'res', 'page', 'error.html');

/** Uses lookaheads / lookbehinds to find space to insert a tree into on a template. */
const FIND_INCLUDE = (label: string) =>
	new RegExp(
		`(?<start><(?<tag>[A-z1-9]+)(?: +[A-z1-9-]+(?:=(?:(?<d1>['"]).*?(?<!\\\\)\\k<d1>))*)*? +(?:data-include)(?:=(?<value>(?<q>['"])${label}(?<!\\\\)\\k<q>))*(?: +[A-z1-9-]+(?:=(?:(?<d2>['"]).*?(?<!\\\\)\\k<d2>))*)*?\\/?>)(\\s*)(?<end><\\/\\k<tag>>)`,
		'gi'
	);

// interface PageBuilderContextData {
// 	path: string;
// 	cookies: Record<string, string>;
// }

// export const PageBuilderContext = Preact.createContext<PageBuilderContextData>(undefined as any);

export class RenderError extends Error {
	readonly code: number;
	constructor(...params: any[]) {
		super(...params);
		if (Error.captureStackTrace) Error.captureStackTrace(this, RenderError);
		this.name = 'RenderError';
		this.code = (params[1] as number) ?? 0;
	}
}

export default class PageBuilder {
	// root: string;
	// gql?: GQLQueryFunction;

	/**
	 * Handles generating and expanding pages.
	 * Can create an HTML representation of a page,
	 * or return an expanded JSON representation with includes included.
	 */

	constructor(private registeredElements: Map<string, Element>) {}

	/**
	 * Initializes the PagesManager,
	 * creates the pages directory if it doesn't exist already.
	 */

	// async init(gql: GQLQueryFunction) {
	// 	try {	await fs.access(this.root, fsc.R_OK); }
	// 	catch (e) { fs.mkdir(this.root); }
	// 	this.gql = gql;
	// }

	/**
	 * Attempts to render a page given a URL.
	 *
	 * @param url - The URL of the page to render, without the domain.
	 * @returns a promise resolving to the rendered HTML, or rejecting to an error.
	 */

	async render(
		page: Page.PageDocument,
		_cookies: Record<string, string>
	): Promise<string> {
		// rawUrl = rawUrl.replace(/(?<=\/.+)\/$/g, '');
		// Logger.perfStart(`Rendering Page ${rawUrl}`);

		// Search for an index file if the target doesn't exist.
		// let url = rawUrl;

		// await fs.access(path.join(this.pagesPath, `${url}.json`)).catch(async () => {
		// 	await fs
		// 		.access(path.join(this.pagesPath, url, 'index.json'))
		// 		.catch(() => assert(false, 'Page not found.', RenderError, 404));
		// 	url = path.join(url, 'index');
		// });

		// const { media } = await this.gql!(`{ media ${Query.Media} }`).then(res => res.data as Int.Root);
		// Prepare and render the Preact component trees.
		Logger.perfStart('Preparing Trees');

		const json = await this.preparePage(page);

		Logger.perfEnd('Preparing Trees');

		// const contextData: PageBuilderContextData = {
		// 	path: rawUrl,
		// 	cookies: cookies
		// };

		Logger.perfStart('Rendering Trees');
		const rendered: Map<string, string> = new Map();
		await Promise.all(
			Object.keys(json.elements).map(async (key) =>
				rendered.set(key, await this.renderTree('.', key, json.elements[key]))
			)
		);
		Logger.perfEnd('Rendering Trees');

		// Populate the page template with contents.
		// const { name: siteName, description: siteDescription, favicon } = (await Properties.findOne({}))!.info;

		// const faviconItem = (media ?? []).filter(media => media.id === favicon as any)[0];

		const siteName = 'Temporary Name';
		const siteDescription = 'Temporary Description for this site.';
		const faviconItem = { url: '' };

		Logger.perfStart('Forming HTML');
		let html = (await fs.readFile(PAGE_TEMPLATE_PATH, 'utf-8'))
			.replace(
				'$TITLE$',
				(json.name ? `${escapeHtml(json.name)}&nbsp; • &nbsp;` : '') +
					escapeHtml(siteName)
			)
			.replace('$DESCRIPTION$', escapeHtml(json.description || siteDescription))
			.replace('$FAVICON$', faviconItem?.url ?? '');

		// const scripts = this.plugins.listEnabled().filter(p => p.sources.scripts?.client)
		// 	.map(p => p.identifier + '/' + p.sources.scripts.client);
		// const styles = this.plugins.listEnabled().filter(p => p.sources.styles?.client)
		// 	.map(p => p.identifier + '/' + p.sources.styles.client);

		// TODO: This is bad.
		const scripts: string[] = [];
		// const styles: string[] = [];

		html = html.replace(
			'$PREACT$',
			scripts.length
				? `
				<script type='module'>
					import * as preact from 'https://cdn.skypack.dev/preact';
					import * as hooks from 'https://cdn.skypack.dev/preact/hooks';
					window.preact = preact;
					window.preact_hooks = hooks;
				</script>`
				: ''
		);
		// .replace('$PLUGINS$', (scripts.length || styles.length) ?
		// 	scripts.map(script => `<script src='/plugin/${script}' defer></script>`).join('') +
		// 		styles.map(style => `<link rel='stylesheet' href='/plugin/${style}'/>`).join('') : '')
		// .replace('$THEME_HEAD$', (await Promise.all(this.themes.listEnabled().filter(t => t.sources.head)
		// 	.map(t => fs.readFile(path.join(this.dataPath, 'themes',
		// 		t.identifier, t.sourceRoot ?? '.', t.sources.head!))))).join(''));

		html = html.replace(
			'$DEBUG$',
			"<script src='http://localhost:35729/livereload.js' async></script>"
		);

		// const layouts = this.themes.listLayouts();
		// let body = await new Promise<string>((resolve) =>
		// 	fss.readFile(layouts.get(json.layout ?? '-') ?? layouts.get('default')!,
		// 	(_, res) => resolve(res.toString())));

		let body = `
			<div id='page'>
				<input type='checkbox' id='Navigation-Open' style='display: none' />
				<header id='header' data-include='header'></header>
				<main id='main' data-include='main'></main>
				<footer id='footer' data-include='footer'></footer>
			</div>
		`;

		[...rendered.entries()].forEach(([section, rendered]) => {
			// console.log(body);
			// console.log([...body!.matchAll(FIND_INCLUDE(section))]);
			body = body!.replace(FIND_INCLUDE(section), `$<start>${rendered}$<end>`);
		});

		html = html.replace('$CONTENT$', body);

		Logger.perfEnd('Forming HTML');
		// Logger.perfEnd(`Rendering Page ${rawUrl}`);

		return html;
	}

	/**
	 * Returns a page that has been prepared for use.
	 * Throws if there is no page at the requested path.
	 *
	 * @param page - The page to expand.
	 */

	async preparePage(page: Page.PageDocument): Promise<Page.PageDocument> {
		await Promise.all(
			Object.keys(page.elements).map(
				async (key) => await this.includeTree(page.elements[key], 'TEMP')
			)
		);

		const exposed = this.exposePage(page);

		await Promise.all(
			Object.keys(page.elements).map(
				async (key) => await this.parseTree(key, page.elements[key], exposed)
			)
		);

		return page;
	}

	/**
	 * Renders an error page, returning an error code and an HTML document.
	 *
	 * @param url - The error to display.
	 * @returns the error status code and the error HTML page.
	 */

	async renderError(error: RenderError): Promise<string> {
		const description =
			error.code === 404
				? 'The page you have requested could not be found.'
				: 'Internal server error.';

		return (await fs.readFile(ERROR_TEMPLATE_PATH, 'utf-8'))
			.replace('$ERROR_CODE$', error.code.toString())
			.replace('$ERROR_DESCRIPTION$', description)
			.replace('$ERROR_STACK$', `<code><pre>${error.stack}</pre></code>`);
	}

	/**
	 * Renders an element tree into HTML.
	 *
	 * @param page - The path of the page to render.
	 * @param root - The root element to render.
	 * @returns the rendered HTML as a string.
	 */

	private async renderTree(
		page: string,
		identifier: string,
		root: Page.Node
	): Promise<string> {
		Logger.perfStart(`Building tree ${identifier}`);
		const tree = await this.createTree(root, path.dirname(page));
		Logger.perfEnd(`Building tree ${identifier}`);
		Logger.perfStart(`Rendering tree ${identifier}`);
		// const res = renderToString(h(PageBuilderContext.Provider, { value: contextData, children: tree }));
		Logger.perfEnd(`Rendering tree ${identifier}`);
		return renderToString(tree);
	}

	/**
	 * Creates Preact elements recursively, starting at the provided element.
	 * Throws if the page or page includes do not exist.
	 *
	 * @param child - The root element to render, must be expanded.
	 * @param pathRoot - The path that includes are relative to.
	 * @returns a Preact VNode representing the root of the tree.
	 */

	private async createTree(child: Page.Node, pathRoot: string): Promise<VNode> {
		const elem: Page.ComponentNode = Page.isIncludeNode(child) ? child.elem! : child;
		if (Page.isIncludeNode(elem))
			pathRoot = path.dirname(path.resolve(pathRoot, elem.include));

		const render = this.registeredElements.get(elem.elem);
		if (!render) return h(UndefinedElement, { elem: elem.elem });

		const children: any[] = [];
		for (const child of elem.children ?? [])
			children.push(await this.createTree(child, pathRoot));

		return h(render.component, { ...elem.props, children });
	}

	/**
	 * Recursively expands includes in a tree.
	 * Directly manipulates the passed-in object, does not return anything.
	 * Throws if the required includes do not exist.
	 *
	 * @param elem - The root element to expand.
	 * @param pathRoot - The path that includes are relative to.
	 */

	private async includeTree(elem: Page.Node, pathRoot: string): Promise<void> {
		if (Page.isIncludeNode(elem)) {
			const includePath = elem.include;
			elem.elem = await this.expandInclude(elem as Page.IncludeNode, pathRoot);
			pathRoot = path.resolve(pathRoot, path.dirname(includePath));
		}

		const element: Page.ComponentNode = Page.isIncludeNode(elem) ? elem.elem! : elem;
		for (const child of element.children || []) await this.includeTree(child, pathRoot);
	}

	/**
	 * Recursively exposes a page, storing named references to all elements containing
	 * an 'exposeAs' key. Returns a key-value map of the elements organized by tree.
	 *
	 * @param page - The page to expose.
	 */

	private exposePage(page: Page.PageDocument) {
		const exposedMap: ExposedMap = {};
		Object.keys(page.elements).map((key) => {
			exposedMap[key] = this.exposeTree(page.elements[key]);
		});
		return exposedMap;
	}

	/**
	 * Recursively exposes a tree, storing named references to all elements containing
	 * an 'exposeAs' key. Returns a key-value map of the elements.
	 *
	 * @param elem - The root element to expand.
	 */

	private exposeTree(elem: Page.Node): ExposedTree {
		let exposedTree: ExposedTree = {};

		const expose: Page.ComponentNode = Page.isIncludeNode(elem) ? elem.elem! : elem;
		if (expose.exposeAs) exposedTree[expose.exposeAs] = expose;

		for (const child of expose.children || [])
			exposedTree = { ...exposedTree, ...this.exposeTree(child) };

		return exposedTree;
	}

	/**
	 * Recursively parses the properties of an element tree.
	 * Directly manipulates the passed-in object, does not return anything.
	 *
	 * @param tree - The identifier of the tree that is being expanded.
	 * @param elem - The root element to expand.
	 * @param media - The current SiteData media array.
	 * @param exposed - The tree's exposed map.
	 */

	private async parseTree(
		tree: string,
		elem: Page.Node,
		exposed: ExposedMap
	): Promise<void> {
		const parse: Page.ComponentNode = Page.isIncludeNode(elem) ? elem.elem! : elem;
		if (parse.props) parse.props = await this.parseProps(parse.props, tree, exposed);
		for (const child of parse.children || []) await this.parseTree(tree, child, exposed);
	}

	/**
	 * Expands an include into a tree, overriding exposed properties with include props.
	 * Throws the requested include doesn't exist.
	 *
	 * @param include - The include to be expanded.
	 * @param pathRoot - The path that includes are relative to.
	 * @returns a page element representing the expanded include root.
	 */

	private async expandInclude(
		_include: Page.IncludeNode,
		_pathRoot: string
	): Promise<Page.ComponentNode> {
		// const includePath = path.join(pathRoot, include.include + '.json');
		// let element = (JSON.parse((await fs.readFile(includePath)).toString()) as Page.IncludeDocument).element;
		// await this.overrideTree(element, include.override);
		return { elem: 'ExpandedInclude' };
		// return element;
	}

	/**
	 * Recursively overrides template children exposed props with include override props.
	 * Manipulates the passed in elemDef, does not return anything.
	 *
	 * @param elemDef - The element to override with properties.
	 * @param includeOverrides - The include override props to use.
	 */

	private async overrideTree(
		elemDef: Page.ComponentNode,
		includeOverrides?: Record<string, Record<string, any>>
	): Promise<void> {
		if (includeOverrides && elemDef.exposeAs && includeOverrides[elemDef.exposeAs])
			Object.assign(elemDef.props, includeOverrides[elemDef.exposeAs]);

		for (const child of (elemDef as Page.ComponentNode).children ?? [])
			if (Page.isComponentNode(child)) await this.overrideTree(child, includeOverrides);
	}

	/**
	 * Reads a Prop Ref and returns a list of keys.
	 *
	 * @param ref - The prop ref to parse.
	 */

	private parsePropRef(ref: string): { page?: string; tree?: string; exposed: string } {
		let page: string | undefined;
		let tree: string | undefined;
		let exposed: string = ref;

		const space = ref.indexOf(' ');
		let period = ref.indexOf('.');

		if (space > -1) {
			page = ref.substring(0, space);
			ref = ref.substring(space + 1);
			period -= space + 1;
			exposed = ref;
		}

		if (period > -1) {
			tree = ref.substring(0, period);
			ref = ref.substring(period + 1);
			exposed = ref;
		}

		return { page, tree, exposed };
	}

	/**
	 * Applies transformations to a non-trivial property,
	 * e.g. filling out a media prop with the rest of the fields.
	 *
	 * @param props - The property to parse.
	 * @param media - The current SiteData media array.
	 * @param myTree - The tree the prop is contained in.
	 * @param exposedMap - A map of exposed props.
	 *
	 * @returns the modified property.
	 */

	private async parseProp(
		prop: any,
		_myTree: string,
		_exposedMap: ExposedMap
	): Promise<any> {
		let wasValue = false;

		if (typeof prop === 'object') {
			// if ('_id' in prop) {
			// 	const mediaItem = (media || []).filter(m => m.id === prop._id)[0];
			// 	if (mediaItem) prop = mediaItem;
			// 	delete prop.path;
			// 	delete prop._id;
			// 	wasValue = true;
			// }
			// else if ('_AS_PROP_REF' in prop) {
			// 	const { page, tree, exposed } = this.parsePropRef(prop._AS_PROP_REF);
			// 	if (page) {
			// 		const pageObj = await this.getPage(page);
			// 		exposedMap = this.exposePage(pageObj);
			// 	}
			// 	prop = { _AS_PROP_REF: prop._AS_PROP_REF, ...exposedMap[tree ?? myTree][exposed].props };
			// }
		} else wasValue = true;

		return [prop, wasValue];
	}

	/**
	 * Applies transformations to non-trivial properties, modifying the table directly.
	 * e.g. filling out a media prop with the rest of the fields.
	 *
	 * @param prop - The props table to parse through.
	 * @param media - The current SiteData media array.
	 * @param tree - The tree the props are contained in.
	 * @param exposedMap - A map of exposed props.
	 */

	private async parseProps(prop: any, tree: string, exposedMap: ExposedMap) {
		const [newProp, wasValue] = await this.parseProp(prop, tree, exposedMap);
		prop = newProp;

		if (!wasValue && typeof prop === 'object') {
			if (Array.isArray(prop))
				for (let i = 0; i < prop.length; i++)
					prop[i] = await this.parseProps(prop[i], tree, exposedMap);
			else if (typeof prop === 'object')
				for (const iden of Object.keys(prop)) {
					prop[iden] = await this.parseProps(prop[iden], tree, exposedMap);
				}
		}

		return prop;
	}
}
