import { h } from 'preact';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

interface Props {
	url?: string;
	image?: string;
	label?: string;

	target?: 'new';
	width?: number;

	class?: string;
	children?: ComponentChildren;
}

const identifier = 'base:button';

function Button(props: Props) {
	return (
		<a
			rel='noreferrer noopener'
			href={props.url}
			title={props.image && props.label}
			aria-label={props.image && props.label}
			target={props.target === 'new' ? '_blank' : undefined}
			class={merge(identifier, props.class, props.image && 'image')}>
			{!props.image && <span>{props.label}</span>}
			{props.image && (
				<img
					src={props.image}
					width={props.width}
					height={props.width}
					alt=''
				/>
			)}
		</a>
	);
}

export default { identifier, component: Button };
