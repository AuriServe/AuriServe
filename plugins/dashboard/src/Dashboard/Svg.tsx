import { h } from 'preact';

import { tw, merge } from './Twind';

export interface Props {
	// Other attributes to be put on the container.
	[key: string]: any;

	/** The SVG source to render. */
	src: string;

	/** The size in quarter-rems. Each unit equates to 4 pixels. */
	size?: number;
}

/**
 * Renders an SVG icon from its source.
 * Note that all the SVGs in the res folder are very compressed,
 * and importing them will only add them to the bundle once.
 * Inherets default colors from the document, but they can be overridden using the icon utility classes.
 */

export default function Svg(props: Props) {
	const size = props.size ? `${props.size / 4}rem` : undefined;

	return (
		<div
			{...props}
			src={undefined}
			size={undefined}
			class={merge(tw`interact-none box-content`, props.class)}
			style={{ ...props.style, width: size, height: size }}
			dangerouslySetInnerHTML={{ __html: props.src }}
		/>
	);
}
