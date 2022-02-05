import { h } from 'preact';

import { merge, tw } from '../twind';

interface Props {
	class?: string;
}

export default function Header(props: Props) {
	return <hr class={merge(tw`ml-3 mr-3 my-2 border-gray-500 border-t-2`, props.class)} />;
}
