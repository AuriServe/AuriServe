import { Request, Response, NextFunction } from 'auriserve/router';

import { Route, BaseRoute } from './Route';

export interface Req {
	/** Arbitrary values passed by e.g. error routes. */
	[key: string]: any;

	/** The sanitized URL path. */
	path: string;

	/** Parsed URL Query parameters. */
	query: Record<string, string>;

	/** Body content, if any. */
	body: string;
}

/**
 * The Routes API.
 * Allows objects deriving the Route interface to be bound to specific paths,
 * which will be called by the server when a request is made.
 */

export default class Routes {
	/** An abstract route class that can be extended with a custom `render` function. */
	BaseRoute: typeof BaseRoute = BaseRoute;

	/** The root Route object. */
	private root: Route | null = null;

	/** The error Route object. */
	private error: Route | null = null;

	/** Creates a Routes Req object from an Express Request. */
	static createReq(req: Request): Req {
		return {
			path: req.path.split('/').filter(Boolean).join('/'),
			query: req.query,
			body: req.body,
		};
	}

	/** Returns the route at the specified path, or null. */
	async get(path: string): Promise<Route | null> {
		if (!this.root) return null;
		return await this.root.get(path.split('/').filter(Boolean).join('/'));
	}

	/** Returns the root route. */
	async getRoot(): Promise<Route | null> {
		return await this.get('/');
	}

	/** Sets the root route. */
	setRoot(root: Route | null) {
		this.root = root;
	}

	/** Sets the error route. */
	setErrorRoute(route: Route | null) {
		this.error = route;
	}

	/** Handles a GET request and sends the render result of a Route if there is one at the specified path. */
	handleGet = async (req: Request, res: Response, next: NextFunction) => {
		if (!this.root) {
			next();
			return;
		}

		const routeRes = await this.root.req(Routes.createReq(req));
		if (routeRes === null) {
			next();
			return;
		}

		res.send(routeRes);
	};

	/** Returns a GET handler for a specific error code. */
	getErrorHandler(errorCode: number, errorMessage?: string) {
		return (req: Request, res: Response, next: NextFunction) => {
			if (!this.error) {
				next();
				return;
			}

			const routeRes = this.error.req({
				...Routes.createReq(req),
				errorCode,
				errorMessage,
			});

			if (routeRes === null) res.sendStatus(404);
			else res.send(routeRes);
		};
	}
}
