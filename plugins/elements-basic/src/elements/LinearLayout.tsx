import as from 'auriserve';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

const {
	preact: { h },
} = as.preact;

// import './LinearLayout.sss';

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
		// eslint-disable-next-line
		// @ts-ignore
		<div
			style={{
				flexDirection: props.direction === 'row' ? 'row' : undefined,
				maxWidth: props.width ? `${props.width}px` : undefined,
				gap: props.gap ? `${props.gap}px` : undefined,
				alignItems:
					props.layoutChildren === 'start'
						? 'flex-start'
						: props.layoutChildren === 'end'
						? 'flex-end'
						: props.layoutChildren === 'center'
						? 'center'
						: undefined,
				...(props.style ?? {}),
			}}
			class={merge('LinearLayout', props.class)}
			children={props.children}
		/>
	);
}

export default { identifier: 'LinearLayout', component: LinearLayout };