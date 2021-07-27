import { h, ComponentChildren } from 'preact';

import { mergeClasses } from 'common/util';
import { ServerDefinition } from 'common/definition';

import './GridLayout.sss';

export interface Props {
	gap?: number;
	width?: number;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

/**
 * Renders a grid of children, with as many columns as can fit with the desired width.
 * A gap can be specified to be put between each child.
 */

export function GridLayout(props: Props) {
	return <div
		style={{
			gap: props.gap ? props.gap + 'px' : undefined,
			gridTemplateColumns: `repeat(auto-fit, minmax(min(
				${Number.isInteger(props.width) ? props.width : props.width ? props.width : 300}px, 100%), 1fr))`,
			...props.style
		}}
		class={mergeClasses('GridLayout', props.class)}
		children={props.children}
	/>;
}

export const server: ServerDefinition = { identifier: 'GridLayout', element: GridLayout };
