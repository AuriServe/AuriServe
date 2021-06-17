import * as Preact from 'preact';
import { ServerDefinition } from 'auriserve-api';

interface Props {
	url?: string;
	label: string;
	image?: any;

	target?: 'new';
	width?: number;

	class?: string;
	children?: Preact.VNode[];
}

/**
 * Renders a link styled as a button.
 */

function Button(props: Props) {
	return (
		<a
			rel='noopener'
			href={props.url}
			title={props.image && props.label}
			aria-label={props.image && props.label}
			class={[ 'Button', props.class, props.image && 'ImageButton' ].filter(s => s).join(' ')}
			target={props.target === 'new' ? '_blank' : undefined}
		>
			{!props.image && props.label}
			{props.image && <img src={props.image.url ?? '/media/' + props.image.fileName + '.' + props.image.extension}
				width={props.width} height={props.width} alt=''/>}
		</a>
	);
}

export const server: ServerDefinition = {
	identifier: 'Button',
	element: Button,
	config: {
		props: {
			url: { type: [ 'url', 'page' ], optional: true },
			image: { type: [ 'media:image', 'url' ], optional: true },
			label: { type: 'text' }
		}
	}
};
