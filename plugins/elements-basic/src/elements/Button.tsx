import { h } from 'preact';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

export interface Props {
	url?: string;
	image?: any;
	label?: string;

	target?: 'new';
	width?: number;

	class?: string;
	children?: ComponentChildren;
}

/**
 * Renders a link styled as a button.
 */

export function Button(props: Props) {
	return (
		<a
			rel='noreferrer noopener'
			href={props.url}
			title={props.image && props.label}
			aria-label={props.image && props.label}
			target={props.target === 'new' ? '_blank' : undefined}
			class={merge('Button', props.class, props.image && 'ImageButton')}>
			{!props.image && <span>{props.label}</span>}
			{props.image && (
				<img
					src={
						props.image.url ?? `/media/${props.image.fileName}.${props.image.extension}`
					}
					width={props.width}
					height={props.width}
					alt=''
				/>
			)}
		</a>
	);
}

export default { identifier: 'Button', component: Button };
