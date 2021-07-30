import { h, Fragment } from 'preact';
import { forwardRef } from 'preact/compat';
import { useState, useRef, useEffect, useLayoutEffect } from 'preact/hooks';
import { withHydration, ClientDefinition, ServerDefinition } from 'plugin-api';

import { Media } from 'common/graph/type';
import { mergeClasses } from 'common/util';

import './ImageView.sss';

type ViewState = 'STATIC' | 'WAITING' | 'TRANSITIONING' | 'LOADED';

export interface Props {
	media: Media;

	alt?: string;
	aspect?: number;
	lightbox?: boolean;
	protect?: boolean;

	width?: number | string;
	height?: number | string;

	class?: string;
	style?: any;
	imgStyle?: any;
}

/**
 * Renders a lazy-loaded image with optional copy protection and lightbox.
 */

export const ImageView = forwardRef<HTMLDivElement, Props>(function ImageView(props, ref) {
	const imageRef = useRef<HTMLImageElement>(null);

	const [ lightbox, setLightbox ] = useState<boolean>(false);
	const [ state, setState ] = useState<ViewState>('STATIC');

	useLayoutEffect(() => setState('WAITING'), []);

	useEffect(() => {
		if (state !== 'WAITING') return;
		if (imageRef.current!.complete) setState('LOADED');
		else imageRef.current!.addEventListener('load', () => {
			setState('TRANSITIONING');
			setTimeout(() => setState('LOADED'), 1000);
		});
	}, [ props.media.url, state ]);


	const width = props.media.size?.x ?? 1;
	const height = props.media.size?.y ?? 1;
	const imageStyle = props.protect ? { 'pointer-events': 'none', 'user-select': 'none' } : {};

	return (<Fragment>
		<div class={mergeClasses('ImageView', props.class)} style={props.style}>
			<div
				ref={ref}
				class={'ImageView-Aspect'}
				style={{ paddingBottom: (props.aspect ? props.aspect : height / width * 100) + '%' }}
				onClick={props.lightbox ? () => setLightbox(true) : undefined}>
				<img
					ref={imageRef}
					width={width}
					height={height}
					style={imageStyle}
					src={props.media.url}
					class={mergeClasses('ImageView-Image',
						(state !== 'STATIC' && state !== 'LOADED') && 'Hide', state === 'TRANSITIONING' && 'FadeIn')}
					alt={props.alt ?? ''}
					loading='lazy'/>
				{state !== 'STATIC' && state !== 'LOADED' && <img
					width={width}
					height={height}
					style={imageStyle}
					src={props.media.url + '?res=preload'}
					class={mergeClasses('ImageView-Preload', state === 'TRANSITIONING' && 'FadeOut')}
					alt=''
					role='presentation'/>}
			</div>
		</div>

		{lightbox && <div onClick={() => setLightbox(false)}
			class={mergeClasses('ImageView-Modal ', props.class)}>
			<img style={imageStyle} src={props.media.url} alt={props.alt ?? ''}/>
		</div>}
	</Fragment>);
});

export const HydratedImageView = withHydration('ImageView', ImageView, (props: any) => {
	props.media = {
		url: props.media?.url,
		size: props.media?.size
	} as Media;
	return props;
});

export const server: ServerDefinition = { identifier: 'ImageView', element: HydratedImageView };

export const client: ClientDefinition = { identifier: 'ImageView', element: ImageView };
