import Express from 'express';

const METHODS = ['get', 'post', 'put', 'delete', 'patch', 'all'] as const;
type Method = typeof METHODS[number];
type PathSpecifier = string | string[];

export default class RouterApi {
	private router = Express.Router();
	private handlers: Map<Express.RequestHandler, { path: PathSpecifier; method: Method }> =
		new Map();

	constructor(app: Express.Application) {
		app.use((req, res, next) => this.router(req, res, next));
	}

	get(path: PathSpecifier, handler: Express.RequestHandler) {
		this.registerHandler('get', path, handler);
		return handler;
	}

	post(path: PathSpecifier, handler: Express.RequestHandler) {
		this.registerHandler('post', path, handler);
		return handler;
	}

	put(path: PathSpecifier, handler: Express.RequestHandler) {
		this.registerHandler('put', path, handler);
		return handler;
	}

	delete(path: PathSpecifier, handler: Express.RequestHandler) {
		this.registerHandler('delete', path, handler);
		return handler;
	}

	patch(path: PathSpecifier, handler: Express.RequestHandler) {
		this.registerHandler('patch', path, handler);
		return handler;
	}

	all(path: PathSpecifier, handler: Express.RequestHandler) {
		this.registerHandler('all', path, handler);
		return handler;
	}

	remove(handler: Express.RequestHandler) {
		this.unregisterHandler(handler);
	}

	private registerHandler(
		method: Method,
		path: PathSpecifier,
		handler: Express.RequestHandler
	) {
		if (this.handlers.has(handler)) return;
		this.handlers.set(handler, { path, method });
		this.refreshRouter();
	}

	private unregisterHandler(handler: Express.RequestHandler) {
		if (!this.handlers.has(handler)) return;
		this.handlers.delete(handler);
		this.refreshRouter();
	}

	private refreshRouter() {
		this.router = Express.Router();
		for (const [handler, { path, method }] of this.handlers) {
			this.router[method](path, handler);
		}
	}
}
