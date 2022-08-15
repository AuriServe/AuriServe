import { BaseRoute } from 'routes';

import { getPage } from './Database';
import { buildPage } from './PageBuilder';

export default class PageRoute extends BaseRoute {
	constructor(path: string, readonly filePath: string) {
		super(path);
	}

	async render() {
		const page = getPage(this.filePath);
		if (page) {
			return await buildPage(page!);
		}
		return '404';
	}
}
