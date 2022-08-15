import Module from 'module';

const rawRequire = Module.prototype.require;

let currentlyOverridden = false;

/**
 * Overrides the `require` function with the callback specified.
 * The callback will be called first any time `require` is used, and if the result is not `undefined`,
 * it will be returned instead of using the native require function.
 * Call `restore` to restore the original `require` function.
 *
 * @param cb - The callback to override `require` with.
 */

export function override(cb: (path: string) => any) {
	if (currentlyOverridden) throw new Error('`require` is already overridden!');
	currentlyOverridden = true;

	function newRequire(path: string) {
		const overridden = cb(path);
		if (typeof overridden !== 'undefined') return overridden;
		return rawRequire(path);
	}

	newRequire.cache = rawRequire.cache;
	newRequire.extensions = rawRequire.extensions;
	newRequire.main = rawRequire.main;
	newRequire.resolve = rawRequire.resolve;

	Module.prototype.require = newRequire;
}

/**
 * Removes the current override set using `override` from `require`.
 */

export function restore() {
	Module.prototype.require = rawRequire;
	currentlyOverridden = false;
}

/**
 * Requires a module from the specified path, ignoring overrides.
 *
 * @param path - The path to the module to require.
 * @returns the module.
 */

export const raw = rawRequire;

/**
 * Removes the cached version of the module specified, and raw-requires it again.
 *
 * @param path - The path of the module to reload.
 * @returns the module.
 */

export function refresh(path: string): any {
	delete require.cache[path];
	return rawRequire(path);
}
