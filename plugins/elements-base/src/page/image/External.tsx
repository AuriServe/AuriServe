import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import { Modal } from './Modal';
import { SharedProps, identifier } from './Type';
import { merge, mergeStyles, joinClass } from '../../common/util';

export interface Props extends SharedProps {
	url: string;
}

export default function External(props: Props) {
	const cn = joinClass(identifier);
	const [ lightbox, setLightbox ] = useState(false);
	const handleSetLightbox = useCallback((e: Event) => (e.preventDefault(), setLightbox(l => !l)), []);
	const Tag = (props.lightbox && !props.protect) ? 'a' : props.lightbox ? 'button' : 'div';

	return (
		<Tag
			class={merge(identifier, cn`external`, props.class)}
			style={mergeStyles(
				props.maxWidth && `max-width: ${props.maxWidth}px`,
				props.maxHeight && `max-height: ${props.maxHeight}px`,
				props.style
			)}
			target='_blank'
			href={Tag === 'a' ? props.url : undefined}
			onClick={props.lightbox ? handleSetLightbox : undefined}
		>
			<img
				class={merge(props.protect && cn`protect`)}
				style={mergeStyles(props.aspect && `object-fit: cover; aspect-ratio: ${props.aspect};`)}
				src={props.url}
				alt={props.alt ?? ''}
				loading={(props.lazy ?? true) ? 'lazy' : undefined}
			/>

			<Modal
				open={lightbox}
				alt={props.alt}
				url={props.url}
				originalUrl={props.url}
				protect={props.protect}
				onClose={handleSetLightbox}
			/>
		</Tag>
	);
}
