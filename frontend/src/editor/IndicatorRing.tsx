import { h } from 'preact';

import { mergeClasses } from 'common/util';

/** The distance the focus ring should be from the component's bounds. */
const FOCUS_RING_POPOUT = 6;

/** The minimum distance the focus ring should be from the page boundaries. */
const FOCUS_RING_BOUNDARY = 4;

interface Bounds {
	top: number;
	left: number;
	right: number;
	bottom: number;
}

interface Props {
	/** Whether or not the focus ring should be active. */
	active: boolean;

	/** The bounds of the element to display the ring around. */
	elem: Bounds;
}

/**
 * Renders an indicator ring around the specified area,
 * providing a visual indicator for the hovered and active components.
 */

export default function FocusRing(props: Props) {
	const bounds = {
		top: Math.max(props.elem.top - FOCUS_RING_POPOUT, FOCUS_RING_BOUNDARY),
		left: Math.max(props.elem.left - FOCUS_RING_POPOUT, FOCUS_RING_BOUNDARY),
		width: Math.min(props.elem.right + FOCUS_RING_POPOUT * 2,
			document.documentElement.scrollWidth - FOCUS_RING_BOUNDARY * 2) - props.elem.left,
		height: Math.min(props.elem.bottom + FOCUS_RING_POPOUT * 2,
			document.documentElement.scrollHeight) - props.elem.top
	};

	const shadowAlpha = props.active ? 0.2 : 0.05;

	return (
		<div style={{ boxShadow: `inset 0 0 4px 0 rgba(0, 0, 0, ${shadowAlpha}), 0 0 4px 0 rgba(0, 0, 0, ${shadowAlpha})`, ...bounds }}
			class={mergeClasses('box-border absolute rounded-md select-none pointer-events-none border-2 z-50',
				props.active ? 'animate-select border-blue-500' : 'animate-fadein-150 border-blue-400 bg-blue-400/10')}/>
	);
}
