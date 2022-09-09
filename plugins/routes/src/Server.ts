import auriserve from 'auriserve';
import type { Request, Response, NextFunction } from 'auriserve/router';

import { Req, Route } from './Route';
import { HTMLRoute } from './HTMLRoute';
import { DirectoryRoute } from './DirectoryRoute';

/** The route interface. */
export type { Route, Req } from './Route';

export { BaseRoute } from './BaseRoute';
export { HTMLRoute } from './HTMLRoute';
export { DirectoryRoute } from './DirectoryRoute';

/** The root Route. */
export const root: Route  = new DirectoryRoute('/');

/** The error Route. */ // eslint-disable-next-line prefer-const
export let error: Route | null = new HTMLRoute('/', 'Error 404!');

/** Creates a Routes Req object from an Express Request. */
export function createReq(req: Request): Req {
	return {
		path: `/${req.path.split('/').filter(Boolean).join('/')}`,
		query: req.query,
		body: req.body,
	};
}

/** Handles a GET request and sends the render result of a Route if there is one at the specified path. */
export async function handleGet(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (!root) return next();
	const routeRes = await root.req(createReq(req));
	if (routeRes == null) return next();
	res.send(routeRes);
};

/** Returns a GET handler for a specific error code. */
export function getErrorHandler(
	errorCode: number,
	errorMessage?: string
): (req: Request, res: Response, next: NextFunction) => void {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!error) {
			next();
			return;
		}

		const routeRes = error.req({
			...createReq(req),
			errorCode,
			errorMessage,
		});

		if (routeRes == null) res.sendStatus(404);
		else res.send(routeRes);
	};
};

auriserve.router.get('*', handleGet);
const handle404 = getErrorHandler(404);
// setTimeout(() => auriserve.router.get('*', handle404), 1);

auriserve.once('cleanup', () => {
	auriserve.router.remove(handle404);
	auriserve.router.remove(handleGet);
});
