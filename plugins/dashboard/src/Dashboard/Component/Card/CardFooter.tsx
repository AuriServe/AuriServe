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
 * A card's footer. Just a simple div with some styling.
 */

export default function CardFooter(props: Props) {
	return (
		<div
			{...props}
			ref={props.refObj}
			class={merge(
				tw`CardFooter~(p-4 pt-0 text-(grey-300 sm right) font-medium leading-none)`,
				props.class
			)}
		/>
	);
}
