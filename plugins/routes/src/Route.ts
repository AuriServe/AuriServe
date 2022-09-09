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

export interface Route {
	getPath(): string;

	canAdd(): boolean;

	add(pathSegment: string, route: Route): Route;

	get(path: string): Promise<Route | null>;

	req(req: Req): Promise<string | null>;
}
