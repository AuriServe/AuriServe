import { h } from 'preact';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

interface Props {
	direction?: 'column' | 'row';
	layoutChildren?: 'start' | 'end' | 'center' | 'stretch';

	gap?: number;
	width?: number;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

const identifier = 'base:stack';

function Stack(props: Props) {
	return (
		<div
			style={{
				flexDirection: props.direction === 'row' ? 'row' : 'column',
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
			class={merge(identifier, props.class)}
			children={props.children}
		/>
	);
}

export default { identifier, component: Stack };
