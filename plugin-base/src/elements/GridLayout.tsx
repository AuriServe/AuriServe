import * as Preact from 'preact';
import { ServerDefinition } from 'auriserve-api';

interface Props {
	gap: number;
	width: number;

	style?: string;
	class?: string;
	children?: Preact.VNode[];
}

/**
 * Renders a grid of children, with as many columns as can fit with the desired width.
 * A gap can be specified to be put between each child.
 */

export function GridLayout(props: Props) {
	const style = {
		display: 'grid',
		gap: Number.isInteger(props.gap) ? props.gap + 'px' : props.gap,
		gridGap: Number.isInteger(props.gap) ? props.gap + 'px' : props.gap,
		gridTemplateColumns: `repeat(auto-fit, minmax(min(
			${Number.isInteger(props.width) ? props.width : props.width ? props.width : 300}px, 100%), 1fr))`
	};

	return (
		<div style={Object.assign({}, style, props.style)}
			class={('GridLayout ' + (props.class ?? '')).trim()}>
			{props.children}
		</div>
	);
}

export const server: ServerDefinition = {
	identifier: 'GridLayout',
	element: GridLayout,
	config: {
		props: {
			gap: { name: 'Children Gap', type: [ 'number', 'text' ], default: 8 },
			width: { name: 'Children Width', type: [ 'number', 'text' ], default: 300 }
		}
	}
};
