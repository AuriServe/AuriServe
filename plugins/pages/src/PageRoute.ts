import as from 'auriserve';

import { Page } from './Interface';

const { BaseRoute } = (as as any).routes;

export default class PageRoute extends (BaseRoute as any) {
	constructor(path: string, readonly page: Page) {
		// eslint-disable-next-line
		super(path);
	}

	async render() {
		return await as.pages.buildPage(this.page);
	}
}
