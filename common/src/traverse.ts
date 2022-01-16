import { assert } from './assert';

function descend(seg: string, object: any) {
	if (seg.startsWith('[')) {
		assert(seg.endsWith(']'), `Invalid path array segment '${seg}'.`);
		const num = Number.parseInt(seg.substring(1, seg.length - 2 - 1), 10);
		assert(!Number.isNaN(num), `Invalid path array segment '${seg}'.`);
		assert(
			Array.isArray(object),
			`Invalid Array index into Value '${JSON.stringify(object)}'.`
		);
		assert(
			object.length > num,
			`Array '${JSON.stringify(object)}' is missing index '${num}'.`
		);
		return object[num];
	}

	assert(
		object !== undefined && typeof object === 'object',
		`Value '${object}' is not an Object.`
	);
	assert(
		seg in object,
		`Object '${JSON.stringify(object)}' is missing property '${seg}'.`
	);
	return object[seg];
}

export function traverse(object: any, path: string) {
	path
		.replace(/\[/g, '.[')
		.split('.')
		.filter(Boolean)
		.forEach((seg) => (object = descend(seg, object)));
	return object;
}

export function buildObjectPath(...segs: (string | number)[]): string {
	return segs
		.filter((seg) => seg !== '')
		.reduce<string>(
			(p, c, i) =>
				(p += Number.isInteger(c)
					? `[${c.toString()}]`
					: (i !== 0 ? '.' : '') + (c as string)),
			''
		);
}
