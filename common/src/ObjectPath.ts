function descend(seg: string, object: any) {
	if (seg.startsWith('[')) {
		if (!seg.endsWith(']')) throw "Improperly formatted path segment: " + seg;
		let inner = seg.substr(1, seg.length - 2);
		if (Number.isNaN(parseInt(inner))) throw "Improperly formatted path segment: " + seg;

		let num = parseInt(inner);
		if (!Array.isArray(object)) throw "Array specifier on non-array object: " + JSON.stringify(object);
		if (object.length <= num) throw "Array value " + num + " is too large for object: " + JSON.stringify(object);
		return object[num];
	}

	if (!object[seg]) throw `'${seg}' doesn't exist in '${JSON.stringify(object)}'`;
	return object[seg];
}

export function traversePath(path: string, object: any) {
	let splitPath = path.replace(/\[/g, '.[').split('.').filter(seg => seg);
	splitPath.forEach(seg => object = descend(seg, object));

	return object;
}

export function combinePath(...segs: (string | number)[]): string {
	return segs.filter(seg => seg !== "")
		.reduce<string>((p, c, i) =>
			p += (Number.isInteger(c)
				? '[' + c.toString() + ']'
				: (i !== 0 ? '.' : '') + (c as string)), '');
}
