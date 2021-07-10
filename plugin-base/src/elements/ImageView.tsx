import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { useState, useRef, useEffect } from 'preact/hooks';

import { Media } from 'common/graph/type';
import { ClientDefinition, ServerDefinition } from 'common/definition';

import { withHydration } from '../Hydration';

import './ImageView.sss';

type ViewState = 'INITIAL' | 'AWAITING_OBSERVATION' | 'COMPLETE';

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

function getStyles(props: Props) {
	let wrapperStyles: any = Object.assign({}, props.style);
	
	wrapperStyles.maxWidth = Number.isInteger(props.width) ? props.width + 'px' : props.width;
	wrapperStyles.maxHeight = Number.isInteger(props.height) ? props.height + 'px' : props.height;

	if (props.aspect) {
		wrapperStyles.height = 0;
		wrapperStyles.paddingBottom = props.aspect + '%';
	}

	let accessStyles: any = {};

	if (props.protect) {
		accessStyles.pointerEvents = 'none';
		accessStyles.userSelect = 'none';
	}

	let imageStyles: any = Object.assign(props.aspect ? { width: '100%', height: '100%' } : {
		aspectRatio: `${props.media.size?.x} / ${props.media.size?.y}`
	}, props.imgStyle);

	if (props.aspect) imageStyles.position = 'absolute';

	return { wrapperStyles: wrapperStyles, imageStyles: imageStyles, accessStyles: accessStyles };
}


/**
 * Renders a lazy-loaded image with optional copy protection and lightbox.
 */

export const ImageView = forwardRef<HTMLDivElement, Props>(function ImageView(props, forwardRef) {
	const imageRef = useRef<HTMLDivElement>(null);

	const [ state, setState ] = useState<ViewState>('INITIAL');
	const [ lightbox, setLightbox ] = useState<boolean>(false);

	useEffect(() => {
		if (state !== 'INITIAL') return;
		const img = imageRef.current!.querySelector('img')!;
		if (img.complete) return setState('COMPLETE');

		setState('AWAITING_OBSERVATION');

		const completeCb = () => setState('COMPLETE');
		const observer = new IntersectionObserver(([ observing ]: IntersectionObserverEntry[]) => {
			if (observing.intersectionRatio > 0) {
				if (img.complete) setState('COMPLETE');
				else img.addEventListener('load', completeCb);
				observer.disconnect();
			};
		}, { threshold: 0, rootMargin: '0px 0px 1000px 0px' });

		observer.observe(imageRef.current!);
	}, [ props.media, state ]);

	const { wrapperStyles, imageStyles, accessStyles } = getStyles(props);

	return (
		<Preact.Fragment>
			<div style={wrapperStyles} class={('ImageView ' + (props.class ?? '')).trim()}
				ref={ref => {
					imageRef.current = ref!;
					if (typeof forwardRef === 'function') (forwardRef as any)(ref);
					else if (forwardRef) forwardRef.current = ref!;
				}}
				onClick={props.lightbox ? () => setLightbox(true) : undefined}>
				<picture>
					{state !== 'AWAITING_OBSERVATION' && <source srcset={props.media.url}/>}
					<img
						width={props.media.size?.x}
						height={props.media.size?.y}
						style={Object.assign({}, imageStyles, accessStyles)}
						src={props.media.url + '?res=preload'} alt={props.alt || ''} loading={state === 'INITIAL' ? 'lazy' : undefined}/>
				</picture>
			</div>

			{lightbox && <div onClick={() => setLightbox(false)}
				class={('ImageView-Modal ' + (props.class ?? '')).trim()}>
				<img style={accessStyles} src={props.media.url} alt={props.alt || ''}/>
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
