import { h } from 'preact';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

interface Props {
	style?: any;
	class?: string;
	children?: ComponentChildren;
}

const identifier = 'base:container';

function Container(props: Props) {
	return (
		<div
			style={props.style}
			class={merge(identifier, props.class)}
			children={props.children}
		/>
	);
}

export default { identifier, component: Container };
