import auriserve from 'auriserve';
import type { Request, Response, NextFunction } from 'auriserve/router';

import type Req from './Req';
import { Route } from './Route';

/** The route interface. */
export type { Route } from './Route';

/** An abstract route class that can be extended with a custom `render` function. */
export { BaseRoute } from './Route';

/** The root Route. */
let root: Route | null = null;;

/** The error Route. */
let error: Route | null;

/** Creates a Routes Req object from an Express Request. */
export function createReq(req: Request): Req {
	return {
		path: req.path.split('/').filter(Boolean).join('/'),
		query: req.query,
		body: req.body,
	};
}

/** Returns the route at the specified path, or null. */
export async function get(path: string): Promise<Route | null> {
	if (!root) return null;
	return await root.get(path.split('/').filter(Boolean).join('/'));
}

/** Returns the root route. */
export async function getRoot(): Promise<Route | null> {
	return await get('/');
};

/** Sets the root route. */
export function setRoot(newRoot: Route | null): void {
	root = newRoot;
}

/** Sets the error route. */
export function setErrorRoute(route: Route | null): void {
	error = route;
};

/** Handles a GET request and sends the render result of a Route if there is one at the specified path. */
export async function handleGet(req: Request, res: Response, next: NextFunction): Promise<void> {
	if (!root) {
		next();
		return;
	}

	const routeRes = await root.req(createReq(req));
	if (routeRes == null) {
		next();
		return;
	}

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
setTimeout(() => auriserve.router.get('*', handle404), 1);

auriserve.once('cleanup', () => {
	auriserve.router.remove(handle404);
	auriserve.router.remove(handleGet);
});
