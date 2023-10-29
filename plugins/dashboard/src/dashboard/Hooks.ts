import { RefObject } from 'preact';
import { useInlineEffect, useLazyRef } from 'vibin-hooks';
import { useEffect, useState, useMemo } from 'preact/hooks';
import { MutableRefObject } from 'preact/compat';

/**
 * Calls onCancel if a click event is triggered on an element that is not a child of the currently ref'd popup.
 * Optionally, a condition function can be supplied, and the cancel test will only occur if the function returns true.
 * Any dependents for the condition function can be supplied in the dependents array,
 * this hook will automatically handle depending on the current popup, cancel function, and condition function.
 *
 * @param roots - A ref of elements to exclude from outside-clicks.
 * @param onCancel - The function to call if a click occurs outside of `popup`.
 * @param condition - An optional function to determine whether or not to run the click test.
 * @param dependents - An array of dependents for the condition function.
 */

export function usePopupCancel(
	roots: RefObject<any> | RefObject<any>[],
	onCancel: () => any,
	condition?: () => boolean,
	dependents?: any[]
) {
	const body = document.getElementsByTagName('body')[0];

	useEffect(() => {
		const rootsArray = Array.isArray(roots) ? roots : [roots];
		if (condition && !condition()) return undefined;

		const handlePointerCancel = (e: MouseEvent | TouchEvent) => {
			let x = e.target as HTMLElement;
			while (x) {
				for (const r of rootsArray) if (x === r.current) return;
				x = x.parentNode as HTMLElement;
			}
			onCancel();
		};

		const handleFocusCancel = (e: FocusEvent) => {
			let x = e.target as HTMLElement;
			while (x) {
				for (const r of rootsArray) if (x === r.current) return;
				x = x.parentNode as HTMLElement;
			}
			onCancel();
		};

		body.addEventListener('focusin', handleFocusCancel);
		body.addEventListener('mousedown', handlePointerCancel);
		body.addEventListener('touchstart', handlePointerCancel);

		return () => {
			body.removeEventListener('focusin', handleFocusCancel);
			body.removeEventListener('mousedown', handlePointerCancel);
			body.removeEventListener('touchstart', handlePointerCancel);
		};
	}, [onCancel, condition, ...(dependents || [])]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Sends a message to a host with the requested properties.
 */

function sendMessage(
	key: string,
	target: { postMessage: any },
	type: string,
	body?: any
) {
	target.postMessage({ _as: key, type, body });
}

/**
 * Takes a message event, a key, and a recieve callback and
 * executes the callback if it meets the required parameters.
 */

function recieveMessage(
	key: string,
	onRecieve: (type: string, body?: string) => void,
	evt: MessageEvent
) {
	if (evt.origin !== window.location.origin || !evt.data._as || evt.data._as !== key)
		return;

	const type = evt.data.type as string;
	const body = evt.data.body as any;

	onRecieve(type, body);
}

/**
 * Provides cross-origin message passing between hosts, with an optional key to mask out other origins.
 * This function works by being defined on both ends, and both are initialized with the same key.
 *
 * @param target - The target to send messages to, must have a postMessage method.
 * @param onRecieve - The function to call when a messae is recieved.
 * @param key - An optional string to mask out other origins.
 * @returns a function to send messages between origins.
 */

export function useMessaging(
	target: { postMessage: any } | null | undefined,
	onRecieve: (type: string, body?: string) => void,
	dependents: any[],
	key = '!'
) {
	useEffect(() => {
		if (!target) return undefined;
		const cb = recieveMessage.bind(undefined, key, onRecieve);

		window.addEventListener('message', cb);
		return () => window.removeEventListener('message', cb);
	}, [key, target, onRecieve, ...dependents]); // eslint-disable-line react-hooks/exhaustive-deps

	return target && sendMessage.bind(undefined, key, target);
}

export type Classes = string | ClassMap | UseClasses;

interface ClassMap { [key: string]: Classes };

interface UseClassesCache {
	flatClasses: Map<string, string>;
	mappedClasses: Map<string, ClassMap>;
	inheritedClasses: UseClasses | null;
}

export interface UseClasses {
	get: (path?: string, def?: string) => string;
	map: (path: string) => ClassMap;
	__type: 'useClasses';
}

function isUseClasses(obj: any): obj is UseClasses {
	return obj && obj.__type === 'useClasses';
}

/**
 * A hook that takes in a complex class structure and provides a stable getter function for getting the classes out.
 * The input is a string, or a `ClassMap`. This allows components to accept multiple class strings in one prop easily.
 *
 * Returns an object containing two functions:
 * `get` - Returns the classes for a given path, or the default value if it doesn't exist.
 * `map` - Maps all of the classes that are a descendant of `path` to a new `Classes` object.
 * These functions do not get invalidated upon rerender.
 * This hook will automatically rerender the component when its input classes change.
 *
 * @param classes - The classes object to read from.
 * @returns
 */

export function useClasses(classes: Classes | undefined | null) {
	const [ , setFlatClassesIntegrity ] = useState<number>(0);

	const cache: MutableRefObject<UseClassesCache> = useLazyRef<UseClassesCache>(() => ({
		flatClasses: new Map<string, string>(),
		mappedClasses: new Map<string, ClassMap>(),
		inheritedClasses: isUseClasses(classes) ? classes : null,
	} as UseClassesCache));

	useInlineEffect(() => {
		const maybeDeletedKeys = new Set([ ...cache.current.flatClasses.keys() ]);
		const newFlatClasses = new Map<string, string>();
		let changed = false;

		function addRecursively(elem: Classes, path: string) {
			if (typeof elem === 'string') {
				newFlatClasses.set(path, elem);
				if (!changed) {
					if (cache.current.flatClasses.get(path) !== elem) changed = true;
					maybeDeletedKeys.delete(path);
				}
			}
			else for (const [ key, value ] of Object.entries(elem)) {
				addRecursively(value, `${path}${(path && key !== '.') ? '.' : ''}${key}`);
			}
		}

		const rootClasses = newFlatClasses.get('');
		if (rootClasses != null) {
			newFlatClasses.set('.', rootClasses);
			maybeDeletedKeys.delete('.');
		}

		if ((!classes && cache.current.flatClasses.size > 0) ||
			(isUseClasses(classes) && cache.current.inheritedClasses !== classes)) {
			console.log('changed cause this');
			changed = true;
		}
		else if (classes) {
			addRecursively(classes, '');
		}

		if (changed || maybeDeletedKeys.size) {
			// console.log('recurse', changed, maybeDeletedKeys.size);
			cache.current = {
				flatClasses: newFlatClasses,
				mappedClasses: new Map<string, ClassMap>(),
				inheritedClasses: isUseClasses(classes) ? classes : null
			};
			setFlatClassesIntegrity(i => i + 1);
		}
	}, [ classes ]);

	return useMemo((): UseClasses => {
		return {
			get(path = '', def = '') {
				return cache.current.inheritedClasses?.get(path, def) ?? cache.current.flatClasses.get(path) ?? def;
			},
			map(path) {
				if (cache.current.inheritedClasses) return cache.current.inheritedClasses.map(path);
				const cached = cache.current.mappedClasses.get(path);
				if (cached) return cached;
				const obj: ClassMap = {};
				for (const [ key, value ] of cache.current.flatClasses.entries()) {
					if (key.startsWith(path)) {
						const newPath = key === path ? '.' : key.slice(path.length + 1);
						obj[newPath] = value;
					}
				}
				cache.current.mappedClasses.set(path, obj);
				return obj;
			},
			__type: 'useClasses'
		};
	}, [ cache ]);
}
