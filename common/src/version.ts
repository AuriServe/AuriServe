import { assert } from './assert';

/**
 * Represents a version string implementing a subset of the SemVer format.
 * Does not support pre-release versions or tags.
 */

export default class Version {
	/** The major (1st) version number. */
	readonly major: number;

	/** The minor (2nd) version number.*/
	readonly minor: number;

	/** The patch (3rd) version number. */
	readonly patch: number;

	/**
	 * Constructs a new Version object out of a version string.
	 * Throws an AssertError if the version string does not match the required format.
	 */

	constructor(str: string) {
		const parts = str.trim().split('.');
		assert(parts.length === 3, `Invalid version string: '${str}'.`);
		this.major = parseInt(parts[0], 10);
		this.minor = parseInt(parts[1], 10);
		this.patch = parseInt(parts[2], 10);
	}

	/**
	 * Checks if this Version object satisfies the range string specified.
	 * Note: only exact versions, ^, ~, and x are supported. Ranges ard pre-release tags are not supported.
	 *
	 * @param range - The range string to check against.
	 * @returns a boolean indicating if the version matches.
	 */

	matches(range: string): boolean {
		const strParts = range.trim().split('.');

		let minorFuzzy = strParts[1] === 'x';
		if (!minorFuzzy && strParts[0].startsWith('^')) {
			strParts[0] = strParts[0].substring(1).trim();
			minorFuzzy = true;
		}

		let patchFuzzy = strParts[2] === 'x';
		if (!patchFuzzy && strParts[0].startsWith('~')) {
			strParts[0] = strParts[0].substring(1).trim();
			patchFuzzy = true;
		}

		const majorFuzzy = strParts[0].startsWith('x');

		minorFuzzy ||= majorFuzzy;
		patchFuzzy ||= minorFuzzy;

		const major = strParts[0] === 'x' ? 0 : parseInt(strParts[0], 10);
		const minor =
			strParts[1] === 'x' || strParts[1] === undefined ? 0 : parseInt(strParts[1], 10);
		const patch =
			strParts[2] === 'x' || strParts[2] === undefined ? 0 : parseInt(strParts[2], 10);

		if (major !== this.major) return majorFuzzy ? this.major >= major : false;
		if (minor !== this.minor) return minorFuzzy ? this.minor >= minor : false;
		if (patch !== this.patch) return patchFuzzy ? this.patch >= patch : false;
		return true;
	}
}
