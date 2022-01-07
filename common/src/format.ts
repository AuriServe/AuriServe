import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

/** Byte size tiers. */
const tiers: string[] = [ 'B', 'KB', 'MB', 'GB' ];

/**
 * Converts a byte value into a human readable value, such as '242 KB', '3.4 MB', etc.
 *
 * @param bytes - The byte value to convert.
 * @returns the formatted value.
 */

export function bytes(bytes: number): string {
	bytes = Math.round(bytes);

	let tier = 0;
	while (bytes > 800 && tier < tiers.length - 1) {
		tier++;
		bytes /= 1024;
	}

	return Math.ceil(bytes) + ' ' + tiers[tier];
}

/**
 * Converts an vector matching the format { x, y } or { width, height }
 * into a string such as '50 × 62'.
 *
 * @param vec - The vector to convert.
 * @returns the formatted value.
 */

export function vector(vec: { x?: number, y?: number, width?: number, height?: number }): string {
	return `${vec.x ?? vec.width} × ${vec.y ?? vec.height}`;
}

/**
 * Converts a Javascript Date into a human-readable string of the format '2 hours ago',
 * '3 days ago', '2 weeks ago', 'on January 3rd', or 'on January 3rd, 2019', depending on the current date.
 *
 * @param date - The date to convert.
 * @returns a human-readable date.
 */

export function date(date: Date | number) {
	let d = typeof date === 'number' ? new Date(date) : date;
	if (Date.now() - +d < 1000 * 60 * 60 * 24 * 3) return dayjs(date).fromNow();
	else if (d.getFullYear() == new Date().getFullYear()) return "on " + dayjs(date).format("MMMM Do");
	else return "on " + dayjs(date).format("MMMM Do, YYYY");
}

// export function fileNameToName(name: string, len?: number) {
// 	let preExtension = name.substring(0, name.lastIndexOf('.') < 0 ? name.length : name.lastIndexOf('.'));
// 	let cleanName = preExtension.replace(/[_-]+/g, ' ').split(' ').map((str) => {
// 		if (str.length < 2) return str;
// 		const firstChar = str[0];
// 		const rest = str.substring(1);
// 		return firstChar.toUpperCase() + rest.toLowerCase();
// 	}).join(' ');
// 	if (len && cleanName.length > len) cleanName = cleanName.substring(0, len);
// 	return cleanName;
// }

/**
 * Converts a string to a valid ascii lowercase + underscores identifier,
 * by replacing specifal characters with underscores and trimming.
 * Returns null if the resultant string is empty or outside of the length constraints.
 *
 * @param str - The string to sanitize.
 * @param min - The minimum length of the resultant string. Default 3.
 * @param max - The maximum length of the resultant string. Default 32.
 * @param clamp - Whether or not to clamp the string to the maximum length if it is longer. Default true.
 * @returns the sanitized string, or null if the string does not meet the constraints provided.
 */

export function identifier(str: string, min: number = 3, max: number = 32, clamp: boolean = true) {
	const sanitized: string = str
		.toLowerCase() // lowercase the identifier
		.replace(/[ -]/g, '_') // replace space-like characters with underscores
		.replace(/[^a-zA-Z0-9_]/g, '') // remove all other non-alphanumeric characters
		.split('_').filter(Boolean).join('_'); // trim underscore whitespace

	if (sanitized.length > max && clamp) return sanitized.substring(0, max);
	if (sanitized.length < min || sanitized.length > max) return null;
	return sanitized;
}

/**
 * Title cases a string by replacing underscores and hyphens
 * with spaces and capitalizing the first letter of each word.
 *
 * @param str - The string to title case.
 * @returns the title-cased string.
 */

export function titleCase(str: String) {
	return str
		.replace(/[_-]/g, ' ')
		.replace(/\w\S*/g, str => (str.charAt(0)?.toUpperCase() ?? '') + (str.substring(1)?.toLowerCase() ?? ''));
}
