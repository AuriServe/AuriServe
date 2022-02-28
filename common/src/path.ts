import { assert } from './assert';

function descend(seg: number | string, object: any) {
	if (typeof seg === 'number') {
		assert(
			Array.isArray(object),
			`Invalid Array index into Value '${JSON.stringify(object)}'.`
		);
		assert(
			object.length > seg,
			`Index '${seg}' is missing in Array '${JSON.stringify(object)}'.`
		);
		return object[seg];
	}

	assert(
		object !== undefined && typeof object === 'object',
		`Value is not an object: '${object}'.`
	);
	assert(
		seg in object,
		`Object is missing property '${seg}': '${JSON.stringify(object)}'.`
	);
	return object[seg];
}

export function traversePath(object: any, path: string) {
	splitPath(path).forEach((seg) => (object = descend(seg, object)));
	return object;
}

export function buildPath(...segs: (string | number)[]): string {
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

export function splitPath(path: string): (string | number)[] {
	return path
		.replace(/\[/g, '.[')
		.split('.')
		.filter(Boolean)
		.map((seg) => {
			if (seg.startsWith('[')) {
				assert(seg.endsWith(']'), `Invalid path array segment '${seg}'. [1]`);
				const num = Number.parseInt(seg.substring(1, seg.length - 1), 10);
				assert(!Number.isNaN(num), `Invalid path array segment '${seg}'. [2]`);
				return num;
			}
			return seg;
		});
}
