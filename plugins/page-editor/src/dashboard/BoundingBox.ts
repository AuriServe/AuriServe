import { elementBounds } from 'dashboard';

export type BoundingBox = { top: number; left: number; width: number; height: number };
export type PositionBox = { top: number; left: number; bottom: number; right: number };

export default function getBoundingBox(wrapper: HTMLDivElement): BoundingBox {
	const elemBounds = (Array.from(wrapper.children) as HTMLElement[])
		.map((elem) => elementBounds(elem))
		.map(({ top, left, width, height }) => ({
			top,
			left,
			bottom: top + height,
			right: left + width,
		}));

	const bound = elemBounds.reduce<PositionBox>(
		(bound, { top, bottom, left, right }) => ({
			top: Math.min(bound.top, top),
			bottom: Math.max(bound.bottom, bottom),
			left: Math.min(bound.left, left),
			right: Math.max(bound.right, right),
		}),
		{
			top: Infinity,
			left: Infinity,
			bottom: -Infinity,
			right: -Infinity,
		}
	);

	return {
		top: bound.top,
		left: bound.left,
		width: bound.right - bound.left,
		height: bound.bottom - bound.top,
	};
}
