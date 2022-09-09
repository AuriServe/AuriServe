import { Req, Route } from 'routes';

import { getDocument } from './Database';
import { buildPage } from './PageBuilder';
import { isPageDocument } from './Interface';

export default class PageRoute implements Route {
	protected path: string;
	protected page: string;

	constructor(path: string, page: string) {
		this.path = path.replace(/^\/?(.*)\/?$/, '$1');
		this.page = page;
	}

	getPath() {
		return this.path;
	}

	canAdd() {
		return false;
	}

	add(_pathSegment: string, _route: Route): Route {
		throw new Error('Cannot accept children.');
	}

	async get(_path: string): Promise<Route | null> {
		return null;
	}

	async req(_req: Req): Promise<string | null> {
		const page = getDocument(this.page);
		if (page && isPageDocument(page)) return await buildPage(page);
		return null;
	}
}
