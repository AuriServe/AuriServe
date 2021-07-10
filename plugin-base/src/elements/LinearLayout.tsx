import * as Preact from 'preact';
import { ServerDefinition } from 'auriserve-api';

interface Props {
	direction: 'column' | 'row';
	layoutChildren: 'start' | 'end' | 'center';
	
	width?: number;
	gap: number | string;

	style?: string;
	class?: string;
	children?: Preact.VNode | Preact.VNode[];
}

/**
 * Renders a linear list of children horizontally or vertically,
 * justified to the left, right, center, or stretched, with a set gap between them.
 */

export function LinearLayout(props: Props) {
	const style = {
		display: 'flex',
		flexDirection: props.direction === 'row' ? 'row' : 'column',
		maxWidth: Number.isInteger(props.width) ? props.width + 'px' : props.width,
		gap: Number.isInteger(props.gap) ? props.gap + 'px' : props.gap ? props.gap : 8,
		alignItems: props.layoutChildren === 'start' ? 'flex-start' :
			props.layoutChildren === 'end' ? 'flex-end' :
				props.layoutChildren === 'center' ? 'center' : 'stretch'
	};

	return (
		<div style={Object.assign({}, style, props.style)}
			class={('LinearLayout ' + (props.class ?? '')).trim()}>
			{props.children}
		</div>
	);
}

export const server: ServerDefinition = {
	identifier: 'LinearLayout',
	element: LinearLayout,
	config: {
		props: {
			maxWidth: { name: 'Max Width', type: 'number', optional: true },
			gap: { name: 'Children Gap', type: [ 'number', 'text' ], default: 8 },
			direction: { name: 'List Direction', type: [ [ 'column', 'row' ] ], default: 'column' },
			layoutChildren: { name: 'Layout Children', type: [ [ 'start', 'end', 'center', 'stretch' ] ], default: 'stretch' }
		}
	}
};
