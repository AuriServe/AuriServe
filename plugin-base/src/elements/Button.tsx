import { h, ComponentChildren } from 'preact';

import { mergeClasses } from 'common/util';
import { ServerDefinition } from 'common/definition';

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
	return <a
		rel='noopener'
		href={props.url}
		title={props.image && props.label}
		aria-label={props.image && props.label}
		target={props.target === 'new' ? '_blank' : undefined}
		class={mergeClasses('Button', props.class, props.image && 'ImageButton')}
	>
		{!props.image && props.label}
		{props.image && <img src={props.image.url ?? '/media/' + props.image.fileName + '.' + props.image.extension}
			width={props.width} height={props.width} alt=''/>}
	</a>;
}

export const server: ServerDefinition = { identifier: 'Button', element: Button };
