import { h, ComponentChildren } from 'preact';
import { ServerDefinition } from 'plugin-api';

import { mergeClasses } from 'common/util';

export interface Props {
	style?: any;
	class?: string;
	children?: ComponentChildren;
}

/**
 * Renders a single div with the specified style and class.
 */

export function Container(props: Props) {
	return <div
		style={props.style}
		class={mergeClasses('Container', props.class)}
		children={props.children}
	/>;
}

export const server: ServerDefinition = { identifier: 'Container', element: Container };
