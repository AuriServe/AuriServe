import Preact from 'preact';

import { Portal } from '../structure';
import IndicatorRing from './IndicatorRing';

interface Bounds {
	top: number;
	left: number;
	right: number;
	bottom: number;
}

/**
 * Returns the boundaries of an element by iterating over its children, optionally including margins.
 *
 * @param elem - The element to get the boundaries of.
 * @param includeMargins - Whether or not to include margins.
 */

export function getElementBounds(elem: HTMLElement, includeMargins: boolean = false): Bounds {
	const bounds: Bounds = { top: Infinity, left: Infinity, bottom: 0, right: 0 };

	for (let child of Array.from(elem?.children ?? [])) {
		const clientBounds = child.getBoundingClientRect();
		if (!clientBounds.width) continue;

		if (!includeMargins) {
			bounds.top = Math.min(bounds.top, clientBounds.top);
			bounds.left = Math.min(bounds.left, clientBounds.left);
			bounds.right = Math.max(bounds.right, clientBounds.right);
			bounds.bottom = Math.max(bounds.bottom, clientBounds.bottom);
		}
		else {
			const style = getComputedStyle(child);
			const marginTop = Number.parseInt(style.marginTop.replace('px', ''), 10);
			const marginLeft = Number.parseInt(style.marginLeft.replace('px', ''), 10);
			const marginRight = Number.parseInt(style.marginRight.replace('px', ''), 10);
			const marginBottom = Number.parseInt(style.marginBottom.replace('px', ''), 10);

			bounds.top = Math.min(bounds.top, clientBounds.top - marginTop);
			bounds.left = Math.min(bounds.left, clientBounds.left - marginLeft);
			bounds.right = Math.max(bounds.right, clientBounds.right + marginRight);
			bounds.bottom = Math.max(bounds.bottom, clientBounds.bottom + marginBottom);
		}
	}

	bounds.top += document.documentElement.scrollTop;
	bounds.left += document.documentElement.scrollLeft;
	bounds.right += document.documentElement.scrollLeft;
	bounds.bottom += document.documentElement.scrollTop;

	return bounds;
}

interface Props {
	/** Whether or not the component area is active.*/
	active: boolean;

	/** The element that the component area is for. */
	for: HTMLElement;

	/** Children to render into the component area. */
	children?: Preact.ComponentChildren;

	/** Whether or not to render an indicator ring. */
	indicator?: boolean;
}

/**
 * Renders an absolutely positioned element over the specified element,
 * allowing controls to be inserted into it. Optionally can display a visible indicator ring.
 */

export default function ComponentArea(props: Props) {
	const bounds = getElementBounds(props.for);
	const style = {
		top: bounds.top,
		left: bounds.left,
		width: bounds.right - bounds.left,
		height: bounds.bottom - bounds.top
	};

	return (
		<Portal to={document.getElementById('root')!}>
			<Preact.Fragment>
				<div class='absolute pointer-events-none' style={style as any}>
					{props.children}
				</div>
				{props.indicator && <IndicatorRing active={props.active} elem={bounds}/>}
			</Preact.Fragment>
		</Portal>
	);
}
