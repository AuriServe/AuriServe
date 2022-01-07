import { Request, Response, NextFunction } from 'auriserve/router';

import { Route, BaseRoute } from './Route';

export interface Req {
	path: string;
	query: Record<string, string>;
	body: string;
}

export default class Routes {
	BaseRoute: typeof BaseRoute = BaseRoute;

	private root: Route | null = null;

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

	handleGet = (req: Request, res: Response, next: NextFunction) => {
		if (!this.root) return next();

		const routeReq: Req = {
			path: req.path.split('/').filter(Boolean).join('/'),
			query: req.query,
			body: req.body
		};

		const routeRes = this.root.req(routeReq);
		if (routeRes === null) return next();

		res.send(routeRes);
	};
}
