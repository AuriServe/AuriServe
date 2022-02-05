import { ComponentChildren, h } from 'preact';

import { tw, merge } from '../twind';

interface Props {
	class?: string;
	children: ComponentChildren;
}

export default function Header(props: Props) {
	return (
		<div class={merge(tw`rounded-t flex px-1.5 py-1.5 bg-gray-700`, props.class)}>
			{props.children}
		</div>
	);
}

Header.Spacer = function Spacer() {
	return <div class={tw`grow`} />;
};
