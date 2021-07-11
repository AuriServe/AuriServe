import Preact from 'preact';

import { mergeClasses } from 'common/util';

interface Props {
	children?: Preact.ComponentChildren;
	class?: string;
}

export default function Page(props: Props) {
	return (
		<div class={mergeClasses('pb-14', props.class)}>
			{props.children}
		</div>
	);
}
