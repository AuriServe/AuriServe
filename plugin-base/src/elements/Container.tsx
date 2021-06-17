import * as Preact from 'preact';
import { ServerDefinition } from 'auriserve-api';

interface Props {
	style?: any;
	class?: string;
	children?: Preact.VNode[];
}

/**
 * Renders a single div with the specified style and class.
 */

function Container(props: Props) {
	return (
		<div style={props.style} class={props.class}>{props.children}</div>
	);
}

export const server: ServerDefinition = {
	identifier: 'Container',
	element: Container,
	config: {
		props: {}
	}
};
