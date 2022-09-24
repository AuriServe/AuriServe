import { FunctionalComponent, h } from 'preact';
import { assert, merge } from 'common';
import { hydrate, Static } from 'hydrated';
import { useEffect, useState } from 'preact/hooks';

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
}

export type ExternalProps = SharedProps & {
	url: string;
}

export type ServerMediaProps = SharedProps & {
	media: number;
}

export type ClientMediaProps = SharedProps & {
	path: string;
}

const identifier = 'base:image';

function ExternalImage(props: ExternalProps) {

	const style =
		(props.protect ? 'pointer-events: none; user-select: none; ' : '') +
		(props.aspect ? `object-fit: cover; aspect-ratio: ${props.aspect}; ` : '');

	return (
		<div
			class={merge(identifier, 'external', props.class)}
			style={`aspect-ratio: ${props.aspect}; ${props.style ?? ''}`}>
			<img
				style={style}
				src={props.url}
				alt={props.alt ?? ''}
				loading={(props.lazy ?? true) ? 'lazy' : undefined}
			/>
		</div>
	);
}

const VALID_SIZES = { 'sm': 480, 'md': 960, 'lg': 1920 } as const;

function MediaImage(props: ServerMediaProps | ClientMediaProps) {
	const [ state, setState ] = useState<'static' | 'loading' | 'loaded_transition' | 'loaded'>('static');
	useEffect(() => setState('loading'), []);

	const [ size, setSize ] = useState<number | null>(null);

	const style =
		(props.protect ? 'pointer-events: none; user-select: none; ' : '') +
		(props.aspect ? `object-fit: cover; aspect-ratio: ${props.aspect}; ` : '');

	function handleLoad(elem: HTMLImageElement | null) {
		if (!elem) return;
		elem.addEventListener('load', () => {
			setState('loaded_transition');
			setTimeout(() => setState('loaded'), 500);
		});
	}

	const preferredSize = size == null ? null : size > 960 ? 'lg' : size > 480 ? 'md' : 'sm';

	return (
		<div ref={(elem) => setSize(elem ? elem.clientWidth * window.devicePixelRatio : null)}
			class={merge(identifier, 'media', props.class)}
			style={`aspect-ratio: ${props.aspect}; ${props.style ?? ''}`}>
			{state !== 'loaded' &&
				<Static>
					<img
						aria-hidden
						style={style}
						src={('media' in props ?
							media.getMediaImageVariants(props.media).find(variant => variant.type === 'load')!.path : '')}
						class='loader'
					/>
				</Static>
			}
			{state !== 'static' && preferredSize &&
				<picture>
					{Object.entries(VALID_SIZES).filter(([ name ]) => name === preferredSize).map(([ name, size ]) => (
						<source key={name} srcset={`/media/variants/${(props as ClientMediaProps).path}.${name}.webp ${size}w`}/>
					))}
					{Object.entries(VALID_SIZES).filter(([ name ]) => name === preferredSize).map(([ name, size ]) => (
						<source key={name} srcset={`/media/variants/${(props as ClientMediaProps).path}.${name}.webp ${size}w`}/>
					))}
					<img
						ref={state === 'loading' ? handleLoad : undefined}
						style={style}
						src={`/media/variants/${(props as ClientMediaProps).path}.lg.webp`}
						alt={props.alt ?? ''}
						loading={(props.lazy ?? true) ? 'lazy' : undefined}
						class={merge('full', state !== 'loading' && 'loaded')}
					/>
				</picture>
			}
		</div>
	);
}

function ImageSwitch(props: ExternalProps | ServerMediaProps | ClientMediaProps) {
	if ('url' in props) return <ExternalImage {...props} />;
	return <MediaImage {...props} />;
}

const Image = hydrate(identifier, ImageSwitch, (props: ExternalProps | ServerMediaProps | ClientMediaProps) => {
	if ('url' in props) return props;
	assert('media' in props, 'Hydration function is running on the client?');

	const newProps = props as Record<string, any>;
	const variants = media.getMediaImageVariants(props.media);
	delete newProps.media;

	newProps.path = variants[0].path.replace(/.+[\\/]media\/variants\//, '').replace(/\.\w+\.webp/, '');

	return newProps as any;
});

export default { identifier, component: Image as FunctionalComponent };
