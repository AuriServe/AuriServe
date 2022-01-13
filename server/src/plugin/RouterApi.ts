import Express from 'express';

const METHODS = ['get', 'post', 'put', 'delete', 'patch', 'all'] as const;
type Method = typeof METHODS[number];

export default class RouterApi {
	private router = Express.Router();
	private handlers: Map<Express.RequestHandler, { path: string; method: Method }> =
		new Map();

	constructor(app: Express.Application) {
		app.use((req, res, next) => this.router(req, res, next));
	}

	get(path: string, handler: Express.RequestHandler) {
		this.registerHandler('get', path, handler);
		return handler;
	}

	post(path: string, handler: Express.RequestHandler) {
		this.registerHandler('post', path, handler);
		return handler;
	}

	put(path: string, handler: Express.RequestHandler) {
		this.registerHandler('put', path, handler);
		return handler;
	}

	delete(path: string, handler: Express.RequestHandler) {
		this.registerHandler('delete', path, handler);
		return handler;
	}

	patch(path: string, handler: Express.RequestHandler) {
		this.registerHandler('patch', path, handler);
		return handler;
	}

	all(path: string, handler: Express.RequestHandler) {
		this.registerHandler('all', path, handler);
		return handler;
	}

	remove(handler: Express.RequestHandler) {
		this.unregisterHandler(handler);
	}

	private registerHandler(method: Method, path: string, handler: Express.RequestHandler) {
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
