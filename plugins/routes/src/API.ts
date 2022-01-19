import type { Request, Response, NextFunction } from 'auriserve/router';

import type Req from './Req';
import type { Route, BaseRoute } from './Route';

/**
 * The Routes API.
 * Allows objects deriving the Route interface to be bound to specific paths,
 * which will be called by the server when a request is made.
 */

export default interface API {
	/** An abstract route class that can be extended with a custom `render` function. */
	BaseRoute: typeof BaseRoute;

	/** The root Route object. */
	root: Route | null;

	/** The error Route object. */
	error: Route | null;

	/** Creates a Routes Req object from an Express Request. */
	createReq(req: Request): Req;

	/** Returns the route at the specified path, or null. */
	get(path: string): Promise<Route | null>;

	/** Returns the root route. */
	getRoot(): Promise<Route | null>;

	/** Sets the root route. */
	setRoot(root: Route | null): void;

	/** Sets the error route. */
	setErrorRoute(route: Route | null): void;

	/** Handles a GET request and sends the render result of a Route if there is one at the specified path. */
	handleGet(req: Request, res: Response, next: NextFunction): Promise<void>;

	/** Returns a GET handler for a specific error code. */
	getErrorHandler(
		errorCode: number,
		errorMessage?: string
	): (req: Request, res: Response, next: NextFunction) => void;
}

declare global {
	export interface AuriServeAPI {
		routes: API;
	}
}
