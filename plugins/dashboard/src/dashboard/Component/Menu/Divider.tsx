import { h } from 'preact';

import { merge, tw } from '../../Twind';

interface Props {
	class?: string;
}

export default function Header(props: Props) {
	return <hr class={merge(tw`my-2 mx-1 rounded border-(t-2 gray-600)`, props.class)} />;
}
