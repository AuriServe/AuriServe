import { RefObject, RefCallback } from 'preact';

export function refs<T = HTMLElement>(
	...refs: (RefObject<T> | RefCallback<T>)[]
): RefCallback<T> {
	return ((elem: T) => {
		for (const ref of refs) {
			if (typeof ref === 'function') ref(elem);
			else ref.current = elem;
		}
	}) as RefCallback<T>;
}
