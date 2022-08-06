import { h } from 'preact';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

import { Text } from './Text';

interface Props {
	image?: string;
	name: string;
	title?: string;
	content?: string;

	class?: string;
	style?: string;
	children?: ComponentChildren;
}

const identifier = 'base:testimonial';

function Testimonial(props: Props) {
	return (
		<div class={merge(identifier, props.class)}>
			{props.image && <img
				class='testimonial-image'
				src={props.image}
				alt=''
			/>}
			<p class='testimonial-name'>{props.name}</p>
			{props.title && <p class='testimonial-title'>{props.title}</p>}
			{props.content && <Text content={props.content} class='testimonial-content'/>}
			{props.children}
		</div>
	);
}

export default { identifier, component: Testimonial };
