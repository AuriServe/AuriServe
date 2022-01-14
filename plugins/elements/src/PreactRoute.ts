import as from 'auriserve';

import Page from './Page';

const { BaseRoute } = as.routes;

export default class PreactRoute extends (BaseRoute as any) {
	constructor(path: string, readonly page: Page) {
		// eslint-disable-next-line
		super(path);
	}

	async render() {
		return await as.elements.renderPage(this.page);
	}
}
