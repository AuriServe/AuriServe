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

export function elementBounds(elem: HTMLElement): {
	top: number;
	left: number;
	width: number;
	height: number;
} {
	const { x: left, y: top, width, height } = elem.getBoundingClientRect();
	return {
		left: left + document.documentElement.scrollLeft,
		top: top + document.documentElement.scrollTop,
		width,
		height,
	};
}
