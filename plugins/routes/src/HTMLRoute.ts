import { Req, Route } from './Route';

export class HTMLRoute implements Route {
	protected path: string;
	protected html: string;

	constructor(path: string, source: string) {
		this.path = path.replace(/^\/?(.*)\/?$/, '$1');
		this.html = source;
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
		return this.html;
	}
}
