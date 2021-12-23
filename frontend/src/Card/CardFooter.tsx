import { h, ComponentChildren, RefObject } from 'preact';

import { merge } from 'common/util';

export interface Props {
	// Any default div properties.
	[ key: string ]: any;

	style?: any;
	class?: string;
	children?: ComponentChildren;
	refObj?: RefObject<HTMLDivElement>;
}

/**
 * A card's footer. Just a simple div with some styling.
 */

export default function CardFooter(props: Props) {
	return (
		<div
			{...props}
			ref={props.refObj}
			class={merge('p-4 pt-0 text-neutral-300 text-sm font-medium leading-none text-right', props.class)}
		/>
	);
}

