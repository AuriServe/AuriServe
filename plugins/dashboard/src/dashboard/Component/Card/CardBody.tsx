import { h, ComponentChildren, RefObject } from 'preact';

import { tw, merge } from '../../Twind';

export interface Props {
	// Any default div properties.
	[key: string]: any;

	style?: any;
	class?: string;
	children?: ComponentChildren;
	refObj?: RefObject<HTMLDivElement>;
}

/**
 * A card's body. Just a simple div with padding.
 */

export default function CardBody(props: Props) {
	return (
		<div {...props} ref={props.refObj} class={merge(tw`CardBody~(p-4)`, props.class)} />
	);
}
