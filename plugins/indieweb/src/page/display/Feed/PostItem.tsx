import { ComponentChildren, h } from 'preact';

interface Props {
	style?: any;
	class?: string;
	children: ComponentChildren;
}

const identifier = 'indieweb:post-item';

export default function PostItem(props: Props) {
	return (
		<div class={`${identifier} ${props.class ?? ''}`} style={props.style}>
			{props.children}
		</div>
	);
}
