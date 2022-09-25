import { assert, merge } from 'common';
import { hydrate, Static } from 'hydrated';
import { createPortal } from 'preact/compat';
import { FunctionalComponent, h } from 'preact';
import { useState, useLayoutEffect, useEffect, useRef } from 'preact/hooks';

const media = (typeof window === 'undefined' ? require('media') : null) as typeof import('media');

export interface BaseProps {
	alt?: string;
	style?: string;
	class?: string;
}

export interface SharedProps {
	alt?: string;
	aspect?: number;
	lightbox?: boolean;
	protect?: boolean;
	lazy?: boolean;
	class?: string;
	style?: string;
	imgStyle?: string;
}

export type ExternalProps = SharedProps & {
	url: string;
}

export type ServerMediaProps = SharedProps & {
	media: number;
}

export type ClientMediaProps = SharedProps & {
	path: string;
	width: number;
	height: number;
}

const identifier = 'base:image';

interface ModalProps {
	open: boolean;

	path: string;
	fullPath: string;
	width: number;
	height: number;

	alt?: string;
	protect?: boolean;

	onClose: (evt: MouseEvent) => void;
}

function ImageModal(props: ModalProps) {
	const metaRef = useRef<HTMLDivElement>(null);

	const padding = 32;

	const [ render, setRender ] = useState(false);
	const [ size, setSize ] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

	useEffect(() => {
		if (props.open) setRender(true);
		else setTimeout(() => setRender(false), 200);
	}, [ props.open ]);

	useLayoutEffect(() => {
		if (!render) return;

		const computeSize = () => {
			const ratio = Math.min(1, (window.innerWidth - padding * 2) / props.width,
				(window.innerHeight - padding * 2 - (metaRef.current?.offsetHeight ?? 0)) / props.height);
			setSize({ width: props.width * ratio, height: props.height * ratio });
		}
		computeSize();

		window.addEventListener('resize', computeSize);
		return () => window.removeEventListener('resize', computeSize);
	}, [ props.width, props.height, metaRef, render ]);

	if (!render) return null;

	return createPortal(
		<div class={`base:image-modal ${props.open && 'open'}`} onClick={props.onClose}>
			<figure class='content' onClick={(evt) => evt.stopPropagation()} style={{ maxWidth: size.width }}>
				<div class='image' style={{ width: size.width, height: size.height }}>
					<img style={props.protect ? 'pointer-events: none; user-select: none;' : ''}
						src={props.path} {...size} alt={props.alt ?? ''}/>
				</div>
				<div class='meta' ref={metaRef}>
					{props.alt && <figcaption class='alt'>{props.alt}</figcaption>}
					{!props.protect && <a class='link' href={props.fullPath} target='_blank' rel='noopener noreferrer'>
						Open Original
					</a>}
				</div>
			</figure>
		</div>,
		document.getElementById('page')!
	)
}

/**
 * Renders an external image. No fancy stuff here.
 */

function ExternalImage(props: ExternalProps) {
	const style =
		(props.protect ? 'pointer-events: none; user-select: none; ' : '') +
		(props.aspect ? `object-fit: cover; aspect-ratio: ${props.aspect}; ` : '');

	const [ lightbox, setLightbox ] = useState(false);
	const [ initialLoad, setInitialLoad ] = useState(true);
	const [ size, setSize ] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

	function handleLoad(elem: HTMLImageElement | null) {
		if (!elem || !initialLoad) return;
		setInitialLoad(false);

		if (elem.complete) setSize({ width: elem.naturalWidth, height: elem.naturalHeight });
		else elem.addEventListener('load', () => setSize({ width: elem.naturalWidth, height: elem.naturalHeight }));
	}

	function handleSetLightbox(evt: MouseEvent) {
		evt.preventDefault();
		setLightbox(!lightbox);
	}

	const Tag = props.lightbox && !props.protect ? 'a' : props.lightbox ? 'button' : 'div';

	return (
		<Tag class={merge(identifier, 'external', props.class)} style={props.style}
			onClick={props.lightbox ? handleSetLightbox : undefined} target='_blank'
			href={Tag === 'a' ? props.url : undefined}>
			<img
				ref={handleLoad}
				style={style}
				src={props.url}
				alt={props.alt ?? ''}
				loading={(props.lazy ?? true) ? 'lazy' : undefined}
			/>
			<ImageModal
				open={lightbox}
				path={props.url}
				fullPath={props.url}
				width={size.width}
				height={size.height}
				alt={props.alt}
				protect={props.protect}
				onClose={handleSetLightbox}
			/>
		</Tag>
	);
}

/**
 * Renders a Media image. Bakes in a placeholder and lazy loads the actual version based on the rendered size.
 */

function MediaImage(props: ServerMediaProps | ClientMediaProps) {
	let path = (props as any).path;
	let width = (props as any).width;
	let height = (props as any).height;

	const aspectRatio = props.aspect || (width / height);

	if (!('path' in props)) {
		const variants = media.getMediaImageVariants(props.media);
		const lgVariant = variants.find(variant => variant.type === 'lg')!;
		path = lgVariant.path.replace(/.+[\\/]media\/variants\//, '').replace(/\.\w+\.webp/, '');
		width = lgVariant.width;
		height = lgVariant.height;
	}

	const [ lightbox, setLightbox ] = useState(false);
	const [ initialLoad, setInitialLoad ] = useState(true);
	const [ state, setState ] = useState<'static' | 'loading' | 'transition' | 'loaded'>('static');

	function handleCheckLoad(elem: HTMLImageElement | null) {
		if (!elem || !initialLoad) return;
		setInitialLoad(false);

		setTimeout(() => {
			if (elem.complete) setState('loaded');
			else {
				setState('loading');
				elem.addEventListener('load', () => {
					setState('transition');
					setTimeout(() => setState('loaded'), 1000);
				});
			}
		}, 50);
	}

	function handleSetLightbox(evt: MouseEvent) {
		evt.preventDefault();
		setLightbox(!lightbox);
	}

	const Tag = props.lightbox && !props.protect ? 'a' : props.lightbox ? 'button' : 'div';

	return (
		<Tag class={merge(identifier, 'media', props.class)} style={props.style}
			onClick={props.lightbox ? handleSetLightbox : undefined} target='_blank'
			href={Tag === 'a' ? `/media/variants/${path}.full.webp` : undefined}>
			{state !== 'loaded' &&
				<Static>
					<div
						aria-hidden
						style={`aspect-ratio: ${aspectRatio}; ${props.imgStyle ?? ''};
							background-image: url(${('media' in props ?
							media.getMediaImageVariants(props.media).find(variant => variant.type === 'load')!.path : '')});`}
						class='preview'
					/>
				</Static>
			}
			<div
				style={`aspect-ratio: ${aspectRatio}; ${props.imgStyle ?? ''}
					background-image: url(/media/variants/${path}.lg.webp);`}
				class={merge('image',
					state === 'static' && 'static',
					state === 'loaded' && 'loaded',
					state === 'transition' && 'loaded animate'
				)}
			/>
			<img
				ref={handleCheckLoad}
				style={`${props.protect ? 'pointer-events: none; user-select: none;' : ''} aspect-ratio: ${aspectRatio};`}
				width={width}
				height={height}
				src={`/media/variants/${path}.lg.webp`}
				alt={props.alt ?? ''}
				loading={(props.lazy ?? true) ? 'lazy' : undefined}
				class='loader'
			/>
			<ImageModal
				open={lightbox}
				path={`/media/variants/${path}.lg.webp`}
				fullPath={`/media/variants/${path}.full.webp`}
				width={width}
				height={height}
				alt={props.alt}
				protect={props.protect}
				onClose={handleSetLightbox}
			/>
		</Tag>
	);
}

/**
 * Renders either a MediaImage or ExternalImage depending on the props provided.
 */

function ImageSwitch(props: ExternalProps | ServerMediaProps | ClientMediaProps) {
	if ('url' in props) return <ExternalImage {...props} />;
	return <MediaImage {...props} />;
}

/**
 * Hydrated Image component, which converts the data for the Client Media Image using the Media API.
 */

const Image = hydrate(identifier, ImageSwitch, (props: ExternalProps | ServerMediaProps | ClientMediaProps) => {
	if ('url' in props) return props;
	assert('media' in props, 'Hydration function is running on the client?');

	const newProps = props as Record<string, any>;
	const variants = media.getMediaImageVariants(props.media);
	const lgVariant = variants.find(variant => variant.type === 'lg')!;
	delete newProps.media;

	newProps.path = lgVariant.path.replace(/.+[\\/]media\/variants\//, '').replace(/\.\w+\.webp/, '');
	newProps.width = lgVariant.width;
	newProps.height = lgVariant.height;

	return newProps as any;
});

export default { identifier, component: Image as FunctionalComponent };
