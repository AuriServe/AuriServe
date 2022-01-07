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

export default class Routes {
	BaseRoute: typeof BaseRoute = BaseRoute;

	private root: Route | null = null;
	private error: Route | null = null;

	static createReq(req: Request): Req {
		return {
			path: req.path.split('/').filter(Boolean).join('/'),
			query: req.query,
			body: req.body
		};
	}

	get(path: string): Route | null {
		if (!this.root) return null;
		return this.root.get(path.split('/').filter(Boolean).join('/'));
	}

	getRoot(): Route | null {
		return this.get('/');
	}

	setRoot(root: Route | null) {
		this.root = root;
	}

	setErrorRoute(route: Route | null) {
		this.error = route;
	}

	handleGet = (req: Request, res: Response, next: NextFunction) => {
		if (!this.root) return next();

		const routeRes = this.root.req(Routes.createReq(req));
		if (routeRes === null) return next();

		res.send(routeRes);
	};

	getErrorHandler(errorCode: number, errorMessage?: string) {
		return (req: Request, res: Response, next: NextFunction) => {
			if (!this.error) return next();

			const routeRes = this.error.req({ ...Routes.createReq(req), errorCode, errorMessage });
			if (routeRes === null) return res.sendStatus(404);

			res.send(routeRes);
		};
	}
}
