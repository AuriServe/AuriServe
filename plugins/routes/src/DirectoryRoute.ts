import { Req } from './Route';
import { BaseRoute } from './BaseRoute';

export class DirectoryRoute extends BaseRoute {
	async render(req: Req): Promise<string | null> {
		if (this.children.has('index')) return this.children.get('index')!.req(req);
		return null;
	};
}
