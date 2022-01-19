import { h } from 'preact';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

export interface Props {
	style?: any;
	class?: string;
	children?: ComponentChildren;
}

/**
 * Renders a single div with the specified style and class.
 */

export function Container(props: Props) {
	return (
		<div
			style={props.style}
			class={merge('Container', props.class)}
			children={props.children}
		/>
	);
}

export default { identifier: 'Container', component: Container };
