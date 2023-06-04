import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import { Modal } from './Modal';
import { Static } from 'hydrated';
import { SharedProps, identifier } from './Type';
import { merge, mergeStyles, joinClass } from '../../common/util';

const media = (typeof window === 'undefined' ? require('media') : null) as typeof import('media');
const auriserve = (typeof window === 'undefined' ? require('auriserve') : null) as typeof import('auriserve');

enum State {
	Static,
	Loading,
	Transition,
	Loaded
};

export interface Props extends SharedProps {
	media: number;
	imgStyle?: string;

	// The following should not be manually set.
	path: string;
	canonical: string;
	hash: string;
	width: number;
	height: number;
}

export default function MediaRaster(props: Props) {
	const cn = joinClass(identifier);
	const [ lightbox, setLightbox ] = useState(false);
	const handleSetLightbox = useCallback((e: Event) => (e.preventDefault(), setLightbox(l => !l)), []);
	const Tag = (props.lightbox && !props.protect) ? 'a' : props.lightbox ? 'button' : 'div';

	let loadVariant = '';

	if ('media' in props) {
		// TODO: Can't benefit from max size unless we pass 2d info.
		const variant = media.getOptimizedImage(props.media, Math.max(props.maxWidth ?? 1920, props.maxHeight ?? 1920));
		if (!variant) auriserve.log.error('No variant found for media image', props.media);
		const canonicalVariant = media.getCanonicalVariant(props.media);

		props.path = `/media/${variant?.path ?? ''}?hash=${variant?.hash ?? ''}`
		props.canonical = `/media/${canonicalVariant?.path ?? ''}?hash=${canonicalVariant?.hash ?? ''}`;
		props.width = variant?.width ?? 0;
		props.height = variant?.height ?? 0;

		loadVariant = media.getOptimizedImage(props.media, 'image_inline')?.path ?? '';
	}

	const aspect = props.aspect || (props.width / props.height);

	const [ state, setState ] = useState<State>(State.Static);

	// function handleCheckLoad(elem: HTMLImageElement | null) {
	// 	if (!elem || !initialLoad) return;
	// 	setInitialLoad(false);

	// 	setTimeout(() => {
	// 		if (elem.complete) setState('loaded');
	// 		else {
	// 			setState('loading');
	// 			elem.addEventListener('load', () => {
	// 				setState('transition');
	// 				setTimeout(() => setState('loaded'), 1000);
	// 			});
	// 		}
	// 	}, 50);
	// }

	const imgStyle = mergeStyles(
		`aspect-ratio: ${aspect};`,
		props.maxWidth && `max-width: ${props.maxWidth}px;`,
		props.maxHeight && `max-height: ${props.maxHeight}px;`,
		props.imgStyle
	);

	return (
		<Tag
			class={merge(identifier, cn`media raster`, props.class)}
			style={mergeStyles(
				props.maxWidth && `max-width: ${props.maxWidth}px`,
				props.maxHeight && `max-height: ${props.maxHeight}px`,
				props.style
			)}
			target={Tag === 'a' ? '_blank' : undefined}
			href={Tag === 'a' ? props.canonical : undefined}
			onClick={props.lightbox ? handleSetLightbox : undefined}
		>
			{/** Static loader image, which renders until the full image is loaded. */}
			{state !== State.Loaded &&
				<Static>
					<div
						aria-hidden
						class={cn`preview`}
						style={mergeStyles(
							imgStyle,
							`background-image: url(${loadVariant})`
						)}
					/>
				</Static>
			}

			{/* The actual image, which transitions in once it loads. */}
			<div
				style={`${imgStyle}
					background-image: url(${props.path});`}
				class={merge(cn`image`,
					state === State.Static && cn`static`,
					state === State.Loaded && cn`loaded`,
					state === State.Transition && cn`loaded animate`
				)}
			/>


			<img
				// ref={handleCheckLoad}
				style={`${imgStyle} ${props.protect ? 'pointer-events: none; user-select: none;' : ''}`}
				width={props.width}
				height={props.height}
				src={props.path}
				alt={props.alt ?? ''}
				loading={(props.lazy ?? true) ? 'lazy' : undefined}
				class={cn`loader`}
			/>

			<Modal
				open={lightbox}
				url={props.path}
				originalUrl={props.canonical}
				alt={props.alt}
				protect={props.protect}
				onClose={handleSetLightbox}
			/>
		</Tag>
	);
}

// const Image = hydrate(identifier, ImageSwitch, (props: ExternalProps | ServerMediaProps | ClientMediaProps) => {
// 	if ('url' in props) return props;
// 	assert('media' in props, 'Hydration function is running on the client?');

// 	const newProps = props as Record<string, any>;
// 	const variants = media.getMediaImageVariants(props.media);
// 	const lgVariant = variants.find(variant => variant.type === 'lg')!;
// 	if (!lgVariant) auriserve.log.error('No variant found for media image', props.media);
// 	delete newProps.media;

// 	newProps.path = (lgVariant?.path ?? '').replace(/.+[\\/]media\/variants\//, '').replace(/\.\w+\.webp/, '');
// 	newProps.width = lgVariant?.width ?? 0;
// 	newProps.height = lgVariant?.height ?? 0;

// 	return newProps as any;
// });
