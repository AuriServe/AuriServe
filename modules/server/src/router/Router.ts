import Express from 'express';

export default class Router {
	router: Express.Router = Express.Router();

	static safeRoute(fn: (req: Express.Request, res: Express.Response, next: Express.NextFunction) => any, code?: number) {
		return async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
			try {
				await fn(req, res, next);
			}
			catch (e) {
				this.routeError(res, e, code);
			}
		};
	}

	static routeError(res: Express.Response, e: any, code?: number) {
		if (typeof e == 'string') {
			res.status(code ?? 403).send(e);
		}
		else {
			res.sendStatus(code ?? 403);
			console.log(e);
		}
	}
}
