import { RefObject, RefCallback } from 'preact';

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T;

export function refs<T = HTMLElement>(
	...refs: (RefObject<T> | RefCallback<T> | undefined)[]
): RefCallback<T> {
	return ((elem: T) => {
		for (const ref of refs) {
			if (typeof ref === 'function') ref(elem);
			else if (ref) ref.current = elem;
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

export function camelCaseToTitle(str: string): string {
	return str
		.replace(/([^a-z])/g, ' $1')
		.replace(/^./, (str) => `${str[0].toUpperCase()}${str.slice(1)}`);
}
