import { Route } from './Route';
import type { Req } from './Route';

export enum SegmentType {
	Exact = 2,
	Query = 1,
	Glob = 0
}

export type Segment = {
	type: SegmentType.Exact,
	match: string
} | {
	type: SegmentType.Glob,
	match?: RegExp
} | {
	type: SegmentType.Query,
	name?: string,
	match?: RegExp
};

export interface Pattern {
	stringVal: string;
	segments: Segment[];
	route: Route;
}

function splitPath(path: string) {
	const segments: Segment[] = [];

	if (path[0] === '/' && path.length > 1) path = path.slice(1);
	while (path.length > 0) {
		if (path.startsWith('*/')) {
			segments.push({
				type: SegmentType.Query,
			});
			path = path.slice(2);
		}
		else if (path === '**') {
			segments.push({
				type: SegmentType.Glob,
			});
			path = '';
		}
		else if (path[0] !== ':') {
			let end = path.indexOf('/');
			const exactName = end === -1 ? path : path.substring(0, end);
			segments.push({
				type: SegmentType.Exact,
				match: exactName
			});
			path = end === -1 ? '' : path.slice(end + 1);
		}
		else if (path[0] === ':') {
			path = path.slice(1);
			let name = '';
			let regexp = '';
			let numParens = 0;
			while (true) { // eslint-disable-line no-constant-condition
				if (path.length === 0) break;
				const char = path[0];
				path = path.slice(1);
				if (numParens === 0 && char === '/') break;
				else if (char === '(') {
					if (numParens++ !== 0) regexp += '(';
				}
				else if (char === ')') {
					if (--numParens !== 0) regexp += ')';
					else break;
				}
				else if (numParens > 0) regexp += char;
				else name += char;
			}

			segments.push({
				type: SegmentType.Query,
				name: name ? name : undefined,
				match: regexp ? new RegExp(regexp) : undefined
			});

			if (path.length && path[0] === '/') path = path.slice(1);
		}
		else {
			throw new Error('[PatternRoute] Parser error.');
		}
	}

	return segments;
}

/**
 * Represents a route that matches requests against patterns and maps them to routes.
 * These routes are resolved in a consistent-order, so that the most specific route is always matched first.
 *
 * Patterns can consist of exact matches, single-level wildcard matches, glob wildcard matches (trailing only),
 * and query matches. For the purposes of this documentation, query matches are single-level wildcard matches.
 *
 * When resolving a match of many options, priority is given to exact > single-level wildcard > multi-level-wildcard.
 * The process is as follows:
 *
 * First, remove any patterns that do not match the request.
 * Of the remaining patterns, traverse the segments of their match path until one of the segment priorities differ.
 * Choose the one that has the highest priority at that position. If a path ends in a multi-level wildcard,
 * it is considered to have that wildcard at every position after the last segment.
 * If two patterns have the same priority, the first one is matched.
 *
 * Specifying a parameter string is done as follows:
 * /a/b/c -- specifies an exact match
 * /a/:name/c -- specifies a query parameter named 'name'
 * /a/:name([a-z]*) -- specifies a query parameter named 'name' that matches the regex [a-z]*
 * /a/* /c -- specifies a single-level wildcard
 * /a/** -- specifies a multi-level wildcard (glob)
 * /a/:([a-z]) -- specifies an anonymous query parameter (single level wildcard) that matches the regex [a-z]
 */

export class PatternRoute implements Route {
	protected path: string;
	protected patterns: Pattern[] = [];

	constructor(path: string) {
		this.path = path.replace(/^\/?(.*)\/?$/, '$1');
	}

	getPath() {
		return this.path;
	}

	canAdd() {
		return true;
	}

	add(pathStr: string, route: Route) {
		const path = splitPath(pathStr);
		this.patterns.push({
			stringVal: pathStr,
			segments: path,
			route
		});
		return route;
	}

	private resolve(path: string): ([ Route, Record<string, string> ] | null) {
		const childSegment = path.substring(this.path.length).replace(/^\//, '').replace(/\/$/, '').split('/');
		const matchedPatterns: { pattern: Pattern, queries: Record<string, string> }[] = [];

		for (const pattern of this.patterns) {
			const queries: Record<string, string> = {};
			let matches = true;

			if (childSegment.length < pattern.segments.length - (pattern.segments.at(-1)?.type === SegmentType.Glob ? 1 : 0)) continue;
			if (pattern.segments.length && pattern.segments.length < childSegment.length &&
				pattern.segments.at(-1)?.type !== SegmentType.Glob) continue;

			for (let i = 0; i < pattern.segments.length; i++) {
				const segment = pattern.segments[i];
				if (segment.type === SegmentType.Exact) {
					if (segment.match !== childSegment[i]) {
						matches = false;
						break;
					}
				}
				else if (segment.type === SegmentType.Query) {
					if (segment.match && !segment.match.test(childSegment[i])) {
						matches = false;
						break;
					}
					if (segment.name) queries[segment.name] = childSegment[i];
				}
				else if (segment.type === SegmentType.Glob) {
					break;
				}
			}

			if (!matches) continue;
			matchedPatterns.push({ pattern, queries });
		}

		const maxSpecificity: number[] = [];

		for (const pattern of matchedPatterns) {
			for (let i = 0; i < pattern.pattern.segments.length; i++) {
				maxSpecificity[i] = Math.max(maxSpecificity[i] ?? 0, pattern.pattern.segments[i].type ?? 0);
			}
		}

		// console.log(childSegment, matchedPatterns, maxSpecificity);

		for (const pattern of matchedPatterns) {
			let matches = true;
			for (let i = 0; i < maxSpecificity.length; i++) {
				if ((pattern.pattern.segments[i]?.type ?? 0) !== maxSpecificity[i]) {
					matches = false;
					break;
				}
			}
			if (!matches) continue;
			return [ pattern.pattern.route, pattern.queries ];
		}

		return null;
	}

	async get(path: string): Promise<Route | null> {
		const res = this.resolve(path);
		if (res) return res[0];
		return null;
	}

	async req(req: Req): Promise<string | null> {
		const res = this.resolve(req.path);
		if (!res) return null;
		return res[0].req({ ...req, params: { ...req.params, ...res[1] } });
	}
}
