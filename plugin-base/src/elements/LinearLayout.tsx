import { h, ComponentChildren } from 'preact';
import { ServerDefinition } from 'plugin-api';

import { mergeClasses } from 'common/util';

import './LinearLayout.sss';

export interface Props {
	direction?: 'column' | 'row';
	layoutChildren?: 'start' | 'end' | 'center' | 'stretch';

	gap?: number;
	width?: number;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

/**
 * Renders a linear list of children horizontally or vertically,
 * justified to the left, right, center, or stretched, with a set gap between them.
 */

export function LinearLayout(props: Props) {
	return (
		<div
			style={{
				flexDirection: props.direction === 'row' ? 'row' : undefined,
				maxWidth: props.width ? props.width + 'px' : undefined,
				gap: props.gap ? props.gap + 'px' : undefined,
				alignItems:
					props.layoutChildren === 'start' ? 'flex-start' :
					props.layoutChildren === 'end' ? 'flex-end' :
					props.layoutChildren === 'center' ? 'center' :
					undefined,
				...props.style ?? {}
			}}
			class={mergeClasses('LinearLayout', props.class)}
			children={props.children}
		/>
	);
}

export const server: ServerDefinition = { identifier: 'LinearLayout', element: LinearLayout };
