import { h } from 'preact';
import { merge } from 'common';

interface Props {
	url: string;
	alt?: string;

	aspect?: number;
	lightbox?: boolean;
	protect?: boolean;

	lazy?: boolean;

	class?: string;
	style?: string;
	imgClass?: string;
	imgStyle?: string;
}

const identifier = 'base:image';

function Image(props: Props) {
	const imageStyle =
		(props.protect ? 'pointer-events: none; user-select: none; ' : '') +
		(props.aspect ? `object-fit: cover; aspect-ratio: ${props.aspect}; ` : '') +
		(props.imgStyle ?? '');

	const Tag = props.lightbox ? 'a' : 'div';

	return (
		<Tag
			href={props.url}
			target='_blank'
			class={merge(identifier, props.class)}
			style={`aspect-ratio: ${props.aspect}; ${props.style ?? ''}`}>
			<img
				style={imageStyle}
				src={props.url}
				class={merge('image', props.imgClass)}
				alt={props.alt ?? ''}
				loading={(props.lazy ?? true) ? 'lazy' : undefined}
			/>
		</Tag>
	);
}

export default { identifier, component: Image };
