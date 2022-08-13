import auriserve from 'auriserve';
import { BaseRoute } from 'routes';

import { buildPage } from './PageBuilder';
import { Include, Page } from './Interface';

const { database: db } = auriserve;

export default class PageRoute extends BaseRoute {
	constructor(path: string, readonly pageId: number) {
		super(path);
	}

	async render() {
		const { content, includes: includeIds } = db
			.prepare('SELECT content, includes FROM pages WHERE rowid = ?')
			.get(this.pageId);
		const rawIncludes: { rowid: number; content: string }[] = db
			.prepare(
				`SELECT rowid, content FROM includes WHERE rowid IN (${JSON.parse(
					includeIds
				).join(', ')})`
			)
			.all();

		const includes = new Map<number, Include>();
		rawIncludes.forEach(({ rowid, content }) => includes.set(rowid, JSON.parse(content)));

		return await buildPage(JSON.parse(content) as Page, includes);
	}
}
