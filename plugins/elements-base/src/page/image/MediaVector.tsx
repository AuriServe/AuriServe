import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import { Modal } from './Modal';
import { Static } from 'hydrated';
import { SharedProps, identifier } from './Type';
import { merge, mergeStyles, joinClass } from '../../common/util';

const fs = (typeof window === 'undefined' ? require('fs') : null) as typeof import('fs');
const media = (typeof window === 'undefined' ? require('media') : null) as typeof import('media');
const auriserve = (typeof window === 'undefined' ? require('auriserve') : null) as typeof import('auriserve');

export interface Props extends SharedProps {
	media: number;

	// The following should not be manually set.
	svg: string;
	width: number;
	height: number;
}

export default function MediaVector(props: Props) {
	const cn = joinClass(identifier);
	const [ lightbox, setLightbox ] = useState(false);
	const handleSetLightbox = useCallback((e: Event) => (e.preventDefault(), setLightbox(l => !l)), []);
	const Tag = (props.lightbox && !props.protect) ? 'a' : props.lightbox ? 'button' : 'div';

	if ('media' in props) {
		const variant = media.getOptimizedImage(props.media, 'svg_min');
		if (!variant) auriserve.log.error('No variant found for media image', props.media);

		props.svg = fs.readFileSync(media.toAbsolute(variant?.path ?? ''), 'utf-8');
		props.width = variant?.width ?? 0;
		props.height = variant?.height ?? 0;
	}

	const aspect = props.aspect || (props.width / props.height);

	return (
		<Tag
			class={merge(identifier, cn`media vector`, props.class)}
			style={mergeStyles(
				props.maxWidth && `max-width: ${props.maxWidth}px`,
				props.maxHeight && `max-height: ${props.maxHeight}px`,
				`aspect-ratio: ${aspect};`,
				props.style
			)}
			target='_blank'
			href={Tag === 'a' ? props.svg : undefined}
			onClick={props.lightbox ? handleSetLightbox : undefined}
		>
			<Static>
				<div class={cn`svg-wrap`} dangerouslySetInnerHTML={{ __html: props.svg }}/>
			</Static>
			{/* <img
				class={merge(props.protect && cn`protect`)}
				style={mergeStyles(props.aspect && `object-fit: cover; aspect-ratio: ${props.aspect};`)}
				src={props.svg}
				alt={props.alt ?? ''}
				loading={(props.lazy ?? true) ? 'lazy' : undefined}
			/> */}

			<Modal
				open={lightbox}
				alt={props.alt}
				url={props.svg}
				originalUrl={props.svg}
				protect={props.protect}
				onClose={handleSetLightbox}
			/>
		</Tag>
	);
}
