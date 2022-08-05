import as from 'auriserve';
import { Request, Response, NextFunction } from 'auriserve/router';

import { BaseRoute } from './Route';

import './API';

as.routes = {
	BaseRoute,

	root: null,
	error: null,

	createReq(req) {
		return {
			path: req.path.split('/').filter(Boolean).join('/'),
			query: req.query,
			body: req.body,
		};
	},

	async get(path) {
		if (!this.root) return null;
		return await this.root.get(path.split('/').filter(Boolean).join('/'));
	},

	async getRoot() {
		return await this.get('/');
	},

	setRoot(root) {
		this.root = root;
	},

	/** Sets the error route. */
	setErrorRoute(route) {
		this.error = route;
	},

	handleGet: async (req, res, next) => {
		if (!as.routes.root) {
			next();
			return;
		}

		const routeRes = await as.routes.root.req(as.routes.createReq(req));
		if (routeRes == null) {
			next();
			return;
		}

		res.send(routeRes);
	},

	getErrorHandler(errorCode, errorMessage) {
		return (req: Request, res: Response, next: NextFunction) => {
			if (!this.error) {
				next();
				return;
			}

			const routeRes = this.error.req({
				...this.createReq(req),
				errorCode,
				errorMessage,
			});

			if (routeRes == null) res.sendStatus(404);
			else res.send(routeRes);
		};
	},
};

as.core.router.get('*', as.routes.handleGet);
const handle404 = as.routes.getErrorHandler(404);
setTimeout(() => as.core.router.get('*', handle404), 1);

as.core.once('cleanup', () => {
	as.core.router.remove(handle404);
	as.core.router.remove(as.routes.handleGet);
	as.unexport('routes');
});
