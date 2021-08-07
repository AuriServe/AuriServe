import { h, ComponentChildren } from 'preact';

import { mergeClasses } from 'common/util';

interface Props {
	class?: string;
	children?: ComponentChildren;
}

export default function Page(props: Props) {
	return (
		<div class={mergeClasses('pb-14', props.class)}>
			{props.children}
		</div>
	);
}
