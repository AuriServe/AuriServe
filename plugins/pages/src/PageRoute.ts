import as from 'auriserve';

import { Page } from './Interface';

const { BaseRoute } = as.routes;

export default class PageRoute extends BaseRoute {
	constructor(path: string, readonly page: Page) {
		super(path);
	}

	async render() {
		return await as.pages.buildPage(this.page);
	}
}
