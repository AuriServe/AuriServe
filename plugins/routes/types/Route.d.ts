export interface Req {
    /** Arbitrary values passed by e.g. error routes. */
    [key: string]: any;
    /** The sanitized URL path. */
    path: string;
    /** Parsed URL Query parameters. */
    query: Record<string, string>;
    /** Parameters passed by the route. */
    params: Record<string, string>;
    /** Body content, if any. */
    body: string;
}
export interface Route {
    getPath(): string;
    canAdd(): boolean;
    add(pathSegment: string, route: Route): Route;
    /**
     * Gets the route that will be used to resolve the given path. May return `this`.
     */
    get(path: string): Promise<Route | null>;
    /**
     * Resolves a request. Each route class implements its own functionality for resolving.
     */
    req(req: Req): Promise<string | null>;
}
