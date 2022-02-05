import { h, ComponentChildren } from 'preact';

import { tw, merge } from '../Twind';

interface Props {
	gap?: number;
	columns?: number;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default function Grid(props: Props) {
	return (
		<div
			class={merge(tw`grid`, props.class)}
			style={{
				gridAutoRows: '6rem',
				gridTemplateColumns: `repeat(${props.columns ?? 3}, minmax(0, 1fr))`,
				gap: `${(props.gap ?? 4) / 4}rem`,
				...props.style,
			}}>
			{props.children}
		</div>
	);
}
