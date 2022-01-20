import path from 'path';
import { Page } from 'common';
import { promises as fs, constants as fsc } from 'fs';

import Logger from '../Log';
import { Page as PageMeta } from 'common/graph/type';

/**
 * Handles finding pages, page metadata, saving and loading pages.
 */

export default class Pages {
	constructor(private dataPath: string) {
		fs.access(path.join(this.dataPath, 'pages'), fsc.R_OK).catch((_) =>
			fs.mkdir(path.join(this.dataPath, 'pages'))
		);
	}

	/**
	 * Gets a page from its relative path.
	 * The path should start within the pages folder.
	 * Throws if there's no page at the path, or the page is ill-formed.
	 *
	 * @param {string} pagePath - The page's path.
	 * @returns the page.
	 */

	async getPage(pagePath: string): Promise<Page.PageDocument> {
		const page = JSON.parse(
			(
				await fs.readFile(
					path.join(this.dataPath, 'pages', `${pagePath.replace(/\/$/, '')}.json`)
				)
			).toString()
		);
		if (!page.elements) throw 'Page has no elements property.';
		return page;
	}

	/**
	 * Updates a page's content to the JSON provided.
	 * The path should start within the pages folder.
	 * Throws if there is no page at the path, or if the path is ill-formed.
	 *
	 * @param pagePath - The page's path.
	 * @param elements - The page's elements.
	 */

	async setPageContents(pagePath: string, elements: Record<string, Page.Node>) {
		const page = await this.getPage(pagePath);
		page.elements = elements;
		await fs.writeFile(
			path.join(this.dataPath, 'pages', `${pagePath.replace(/\/$/, '')}.json`),
			JSON.stringify(page)
		);
	}

	/**
	 * Gets an include from its relative path.
	 * The path should start within the pages folder.
	 * Throws if there's no include at the path, or the include is ill-formatted.
	 *
	 * @param {string} includePath - The include's path.
	 * @returns the include.
	 */

	async getInclude(includePath: string): Promise<Page.IncludeDocument> {
		const root = path.join(this.dataPath, 'pages');
		const include = JSON.parse(
			(await fs.readFile(path.join(root, `${includePath}.json`))).toString()
		);
		if (include.include !== true) throw 'File is not an include.';
		return include;
	}

	/**
	 * Lists all pages.
	 *
	 * @returns an array of pages.
	 */

	async listPages(): Promise<PageMeta[]> {
		const root = path.join(this.dataPath, 'pages');

		async function getFiles(dirPath: string): Promise<string[]> {
			const dirs = await fs.readdir(dirPath, { withFileTypes: true });
			const files: any = await Promise.all(
				dirs.map((dir) => {
					const res = path.join(dirPath, dir.name);
					return dir.isDirectory()
						? getFiles(res)
						: new Promise((resolve) => resolve(res));
				})
			);
			return Array.prototype.concat(...files);
		}

		const pagePaths = await getFiles(root);

		const pages: PageMeta[] = (
			await Promise.all(
				pagePaths.map(async (pagePath) => {
					try {
						if (!pagePath.endsWith('.json')) throw 'Page is not a JSON file.';
						const page: any = JSON.parse((await fs.readFile(pagePath)).toString());
						if (!page.elements) return undefined;
						delete page.elements;
						page.path = pagePath.substr(root.length);
						page.path = page.path.substr(0, page.path.length - '.json'.length);
						return page;
					} catch (e) {
						Logger.warn('Error while parsing page %s:\n  %s', pagePath, e);
						return undefined;
					}
				})
			)
		).filter((p) => p);

		return pages;
	}
}
