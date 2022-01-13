import { assert } from 'common/assert';

import type { Req } from './Routes';

export interface Route {
	getPath(): string;

	canAdd(): boolean;

	add(pathSegment: string, route: Route): Route;

	get(path: string): Route | null;

	req(req: Req): string | null;
}

export abstract class BaseRoute implements Route {
	protected path: string;
	protected children: Map<string, Route> = new Map();

	constructor(path: string) {
		this.path = path.replace(/^\/?(.*)\/?$/, '$1');
	}

	getPath() {
		return this.path;
	}

	canAdd() {
		return true;
	}

	add(pathSegment: string, route: Route) {
		assert(pathSegment.indexOf('/') === -1, `Path segment '${pathSegment}' cannot contain slashes.`);
		this.children.set(pathSegment, route);
		return route;
	}

	get(path: string): Route | null {
		if (path === this.path) return this;
		const childSegment = path.substring(this.path.length).split('/')[0];
		return this.children.get(childSegment)?.get(path) ?? null;
	}

	req(req: Req) {
		console.log(this.children);
		if (this.path === req.path) return this.render(req);
		const childSegment = req.path.substring(this.path.length).split('/')[0];
		return this.children.get(childSegment)?.req(req) ?? null;
	}

	abstract render(req: Req): string;
}
