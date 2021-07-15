import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { useState, useRef, useEffect, useLayoutEffect } from 'preact/hooks';

import { Media } from 'common/graph/type';
import { ClientDefinition, ServerDefinition } from 'common/definition';

import { withHydration } from '../Hydration';

import './ImageView.sss';
import { mergeClasses } from 'common/util';

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
 * Creates a set of styles for ImageView DOM elements
 * based on user-specified options.
 *
 * @param {Props} props - The ImageView props parameter.
 * @returns a table of styles.
 */

// function getStyles(props: Props) {
// 	let wrapperStyles: any = Object.assign({}, props.style);

// 	wrapperStyles.maxWidth = Number.isInteger(props.width) ? props.width + 'px' : props.width;
// 	wrapperStyles.maxHeight = Number.isInteger(props.height) ? props.height + 'px' : props.height;

// 	if (props.aspect) {
// 		wrapperStyles.height = 0;
// 		wrapperStyles.paddingBottom = props.aspect + '%';
// 	}

// 	let accessStyles: any = {};

// 	if (props.protect) {
// 		accessStyles.pointerEvents = 'none';
// 		accessStyles.userSelect = 'none';
// 	}

// 	let imageStyles: any = Object.assign(props.aspect ? { width: '100%', height: '100%' } : {
// 		aspectRatio: `${props.media.size?.x} / ${props.media.size?.y}`
// 	}, props.imgStyle);

// 	if (props.aspect) imageStyles.position = 'absolute';

// 	return { wrapperStyles: wrapperStyles, imageStyles: imageStyles, accessStyles: accessStyles };
// }


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

	return (
		<Preact.Fragment>
			<div class={mergeClasses('ImageView', props.class)}>
				<div
					ref={ref}
					class={'ImageView-Aspect'}
					style={{ paddingBottom: (props.aspect ? props.aspect : height / width * 100) + '%', ...props.style }}
					onClick={props.lightbox ? () => setLightbox(true) : undefined}>
					<img
						ref={imageRef}
						width={width}
						height={height}
						src={props.media.url}
						class={mergeClasses('ImageView-Image',
							(state !== 'STATIC' && state !== 'LOADED') && 'Hide', state === 'TRANSITIONING' && 'FadeIn')}
						alt={props.alt ?? ''}
						loading='lazy'/>
					{state !== 'STATIC' && state !== 'LOADED' && <img
						width={width}
						height={height}
						src={props.media.url + '?res=preload'}
						class={mergeClasses('ImageView-Preload', state === 'TRANSITIONING' && 'FadeOut')}
						alt=''
						role='presentation'/>}
				</div>
			</div>

			{lightbox && <div onClick={() => setLightbox(false)}
				class={mergeClasses('ImageView-Modal ', props.class)}>
				<img src={props.media.url} alt={props.alt ?? ''}/>
			</div>}
		</Preact.Fragment>
	);
});

const HydratedImageView = withHydration('ImageView', ImageView, (props: any) => {
	props.media = {
		url: props.media?.url,
		size: props.media?.size
	} as any;
	return props;
});

export const server: ServerDefinition = {
	identifier: 'ImageView',
	element: HydratedImageView,
	config: {
		props: {
			media: { name: 'Image Source', type: [ 'media:image' ] },
			alt: { name: 'Alt Text', type: 'text', optional: true },
			aspect: { name: 'Aspect Ratio', type: [ 'number' ], optional: true },
			lightbox: { name: 'Open Lightbox on Click', type: 'boolean', default: true },
			protect: { name: 'Copy Protection', type: 'boolean' }
		}
	}
};

export const client: ClientDefinition = {
	identifier: 'ImageView',
	element: ImageView
};
