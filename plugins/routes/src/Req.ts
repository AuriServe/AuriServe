export default interface Req {
	/** Arbitrary values passed by e.g. error routes. */
	[key: string]: any;

	/** The sanitized URL path. */
	path: string;

	/** Parsed URL Query parameters. */
	query: Record<string, string>;

	/** Body content, if any. */
	body: string;
}
