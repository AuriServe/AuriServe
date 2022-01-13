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
    BaseRoute: typeof BaseRoute;
    /** The root Route object. */
    private root;
    /** The error Route object. */
    private error;
    /** Creates a Routes Req object from an Express Request. */
    static createReq(req: Request): Req;
    /** Returns the route at the specified path, or null. */
    get(path: string): Route | null;
    /** Returns the root route. */
    getRoot(): Route | null;
    /** Sets the root route. */
    setRoot(root: Route | null): void;
    /** Sets the error route. */
    setErrorRoute(route: Route | null): void;
    /** Handles a GET request and sends the render result of a Route if there is one at the specified path. */
    handleGet: (req: Request, res: Response, next: NextFunction) => void;
    /** Returns a GET handler for a specific error code. */
    getErrorHandler(errorCode: number, errorMessage?: string): (req: Request, res: Response, next: NextFunction) => void;
}
