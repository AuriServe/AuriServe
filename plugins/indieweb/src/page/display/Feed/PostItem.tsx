import { ComponentChildren, h } from 'preact';

interface Props {
	i?: number;
	class?: string;
	style?: Record<string, string | undefined | null>;
	children: ComponentChildren;
}

const identifier = 'indieweb:post-item';

export default function PostItem(props: Props) {
	return (
		<div class={`${identifier} ${props.class ?? ''}`} style={{ ...props.style, '--i': props.i }}>
			{props.children}
		</div>
	);
}
