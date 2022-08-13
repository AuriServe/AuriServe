import { h, ComponentChildren } from 'preact';

import { tw, merge } from '../../Twind';

interface Props {
	class?: string;
	children?: ComponentChildren;
}

export default function Page(props: Props) {
	return <div class={merge(tw`Page~(grid pb-14)`, props.class)}>{props.children}</div>;
}
