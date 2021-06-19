import * as Preact from 'preact';

import { Portal } from '../structure';

import { mergeClasses } from '../Util';

/** The distance the focus ring should be from the component's bounds. */
const FOCUS_RING_POPOUT = 6;

/** The minimum distance the focus ring should be from the page boundaries. */
const FOCUS_RING_BOUNDARY = 4;

interface FocusRingProps {
	/** Whether or not the focus ring should be active. */
	active: boolean;

	/** The element that the focus ring should surround. */
	for: HTMLButtonElement;
}


/**
 * Returns the boundaries of an element, optionally including margins.
 *
 * @param elem - The element to get the boundaries of.
 * @param margins - Whether or not to include margins.
 */

function getElementBounds(elem: HTMLElement, margins: boolean = false) {
	const clientBounds = elem.getBoundingClientRect();

	if (!margins) return clientBounds;

	const style = getComputedStyle(elem);
	const marginTop    = Number.parseInt(style.marginTop   .replace('px', ''), 10);
	const marginBottom = Number.parseInt(style.marginBottom.replace('px', ''), 10);
	const marginLeft   = Number.parseInt(style.marginLeft  .replace('px', ''), 10);
	const marginRight  = Number.parseInt(style.marginRight .replace('px', ''), 10);

	return { top: clientBounds.top - marginTop, left: clientBounds.left - marginLeft,
		width: clientBounds.width + marginLeft + marginRight,
		height: clientBounds.height + marginTop + marginBottom
	};
}


/**
 * Renders a focus ring around the specified element,
 * providing a visual indicator for the hovered and active components.
 */

export default function FocusRing(props: FocusRingProps) {
	let bounds = { top: Infinity, left: Infinity, width: 0, height: 0 };

	Array.from(props.for?.children ?? []).forEach(child => {
		const rect = getElementBounds(child as HTMLElement);
		if (rect.width) bounds.left = Math.max(Math.min(bounds.left, rect.left + window.scrollX - FOCUS_RING_POPOUT), FOCUS_RING_BOUNDARY);
		if (rect.width) bounds.top = Math.max(Math.min(bounds.top, rect.top + window.scrollY - FOCUS_RING_POPOUT), FOCUS_RING_BOUNDARY);
		bounds.width = Math.max(bounds.width, rect.width + FOCUS_RING_POPOUT * 2);
		bounds.height = Math.max(bounds.height, rect.height + FOCUS_RING_POPOUT * 2);
	});

	bounds.width = Math.min(bounds.width, document.documentElement.scrollWidth - bounds.left - FOCUS_RING_BOUNDARY);
	bounds.height = Math.min(bounds.height, document.documentElement.scrollHeight - bounds.top - FOCUS_RING_BOUNDARY);

	const shadowAlpha = props.active ? 0.2 : 0.05;

	return (
		<Portal to={document.getElementById('root')!}>
			<div style={{ boxShadow: `inset 0 0 4px 0 rgba(0, 0, 0, ${shadowAlpha}), 0 0 4px 0 rgba(0, 0, 0, ${shadowAlpha})`, ...bounds }}
				class={mergeClasses('box-border absolute rounded-md select-none pointer-events-none border-2 z-50',
					props.active ? 'animate-select border-blue-500' : 'animate-fadein-150 border-blue-400 bg-blue-400/10')}/>
		</Portal>
	);
}
