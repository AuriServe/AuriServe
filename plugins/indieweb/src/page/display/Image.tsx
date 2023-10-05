import { assert, merge } from 'common';
import { hydrate, Static } from 'hydrated';
import { createPortal } from 'preact/compat';
import { FunctionalComponent, h } from 'preact';
import { useState, useLayoutEffect, useEffect, useRef } from 'preact/hooks';

const media = (typeof window === 'undefined' ? require('media') : null) as typeof import('media');
const auriserve = (typeof window === 'undefined' ? require('auriserve') : null) as typeof import('auriserve');

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
	blurSize: number;
}

export type ServerProps = SharedProps & {
	media: number;
}

export type ClientProps = SharedProps & {
	path: string;
	width: number;
	height: number;
}

const identifier = 'indieweb:image';

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

const BLUR_RADIUS = 32;
const BLUR_SIZE = 80;

/**
 * Renders a Media image. Bakes in a placeholder and lazy loads the actual version based on the rendered size.
 */

function RawImage(props: ServerProps | ClientProps) {
	let path = (props as any).path;
	let width = (props as any).width;
	let height = (props as any).height;

	const aspectRatio = props.aspect || (width / height);

	if (!('path' in props)) {
		// const variants = media.getMediaImageVariants(props.media);
		// const lgVariant = variants.find(variant => variant.type === 'lg')!;
		// if (!lgVariant) auriserve.log.error('No variant found for media image', props.media);
		// path = (lgVariant?.path ?? '').replace(/.+[\\/]media\/variants\//, '').replace(/\.\w+\.webp/, '');
		// width = lgVariant?.width ?? 0;
		// height = lgVariant?.height ?? 0;
	}

	const [ lightbox, setLightbox ] = useState(false);
	const [ initialLoad, setInitialLoad ] = useState(true);
	const [ state, setState ] = useState<'static' | 'loading' | 'transition' | 'loaded'>('static');

	const blurRef = useRef<HTMLCanvasElement>(null);
	const elemRef = useRef<HTMLElement | null>(null);

	function handleCheckLoad(elem: HTMLImageElement | null) {
		if (!elem || !initialLoad) return;
		setInitialLoad(false);

		setTimeout(() => {
			if (elem.complete) {
				setState('loaded');
			}
			else {
				setState('loading');
				elem.addEventListener('load', () => {
					setState('transition');
					setTimeout(() => setState('loaded'), 1000);
				});
			}
		}, 50);

		setTimeout(() => {
			const loaderSrc = (elemRef.current!.querySelector('.preview')! as HTMLElement)
				.style.backgroundImage.replace(/url\("(.+)"\)/, '$1');

			const loaderImg = new window.Image();
			loaderImg.src = loaderSrc;


			const canvas = blurRef.current!;
			canvas.width = elem.naturalWidth + (props.blurSize ?? BLUR_SIZE) * 2;
			canvas.height = elem.naturalHeight + (props.blurSize ?? BLUR_SIZE) * 2;
			const ctx = canvas.getContext('2d')!;

			ctx.fillStyle = '#0F172A';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.filter = `blur(${BLUR_RADIUS}px) saturate(200%)`;
			const printWidth = canvas.width - BLUR_RADIUS * 6;
			const printHeight = canvas.height - BLUR_RADIUS * 6;
			ctx.drawImage(loaderImg, BLUR_RADIUS * 3, BLUR_RADIUS * 3, printWidth, printHeight);

			ctx.filter = '';

			const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < canvas.width; i++) {
				for (let j = 0; j < canvas.height; j++) {
					const index = (i + j * canvas.width) * 4;
					if (Math.random() < 0.5) data.data[index + 0] += 1;
					if (Math.random() < 0.5) data.data[index + 1] += 1;
					if (Math.random() < 0.5) data.data[index + 2] += 1;
				}
			}

			ctx.putImageData(data, 0, 0);
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
			ref={(ref: any) => elemRef.current = ref}
			href={Tag === 'a' ? `/media/variants/${path}.full.webp` : undefined}>
			<canvas ref={blurRef} style={`top: -${props.blurSize ?? BLUR_SIZE}px; left: -${props.blurSize ?? BLUR_SIZE}px;`}/>
			{state !== 'loaded' &&
				<Static>
					<div
						aria-hidden
						// style={`aspect-ratio: ${aspectRatio}; ${props.imgStyle ?? ''};
						// 	background-image: url(${('media' in props ?
						// 	media.getMediaImageVariants(props.media).find(variant => variant.type === 'load')?.path ?? '' : '')});`}
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
 * Hydrated Image component, which converts the data for the Client Media Image using the Media API.
 */

const Image = hydrate(identifier, RawImage, (props: ServerProps | ClientProps) => {
	// assert('media' in props, 'Hydration function is running on the client?');

	// const newProps = props as Record<string, any>;
	// const variants = media.getMediaImageVariants(props.media);
	// const lgVariant = variants.find(variant => variant.type === 'lg')!;
	// if (!lgVariant) auriserve.log.error('No variant found for media image', props.media);
	// delete newProps.media;

	// newProps.path = (lgVariant?.path ?? '').replace(/.+[\\/]media\/variants\//, '').replace(/\.\w+\.webp/, '');
	// newProps.width = lgVariant?.width ?? 0;
	// newProps.height = lgVariant?.height ?? 0;

	// return newProps as any;

	return props as any;
});

export default { identifier, component: Image as FunctionalComponent };
