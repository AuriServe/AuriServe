import { h } from 'preact';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

interface Props {
	role?: 'header' | 'footer' | 'aside' | 'section';

	id?: string;
	class?: string;
	style?: string;
	children?: ComponentChildren;
}

const identifier = 'base:section';

function Section(props: Props) {
	const Tag = props.role ?? 'section';
	return <Tag id={props.id} class={merge(identifier, props.class)} style={props.style} children={props.children} />;
}

export default { identifier, component: Section };
