import { h, Fragment } from 'preact';
import { useState, useRef, useLayoutEffect } from 'preact/hooks';
// // import { withHydration, ClientDefinition, ServerDefinition } from 'plugin-api';

// import { Media } from 'common/graph/type';
import { merge } from 'common';

type ViewState = 'STATIC' | 'WAITING' | 'TRANSITIONING' | 'LOADED';

interface Props {
	// media: Media;

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

const identifier = 'base:image';

function Image(props: Props) {
	const imageRef = useRef<HTMLImageElement>(null);

	const [lightbox, setLightbox] = useState<boolean>(false);
	const [state, setState] = useState<ViewState>('STATIC');

	useLayoutEffect(() => setState('WAITING'), []);

	// useEffect(() => {
	// 	if (state !== 'WAITING') return;
	// 	if (imageRef.current!.complete) setState('LOADED');
	// 	else imageRef.current!.addEventListener('load', () => {
	// 		setState('TRANSITIONING');
	// 		setTimeout(() => setState('LOADED'), 1000);
	// 	});
	// }, [ props.media.url, state ]);

	const width = 400;
	const height = 300;

	// const width = props.media.size?.x ?? 1;
	// const height = props.media.size?.y ?? 1;
	const imageStyle = props.protect
		? { 'pointer-events': 'none', 'user-select': 'none' }
		: {};

	return (
		<Fragment>
			<div
				class={merge(identifier, props.class)}
				style={{
					...props.style,
					aspectRatio: props.aspect
						? props.aspect
						: `${Math.round((width / height) * 100) / 100}`,
				}}
				onClick={() => setLightbox(true)}>
				<img
					ref={imageRef}
					width={width}
					height={height}
					style={imageStyle}
					src='https://placekitten.com/400/300'
					// src={props.media.url}
					class={merge(
						'image',
						state !== 'STATIC' && state !== 'LOADED' && 'hide',
						state === 'TRANSITIONING' && 'fade-in'
					)}
					alt={props.alt ?? ''}
					loading='lazy'
				/>
				{state !== 'STATIC' && state !== 'LOADED' && (
					<img
						width={width}
						height={height}
						style={imageStyle}
						src='https://placekitten.com/400/300'
						// src={props.media.url + '?res=preload'}
						class={merge('ImageView-Preload', state === 'TRANSITIONING' && 'fade-out')}
						alt=''
						role='presentation'
					/>
				)}
			</div>

			{lightbox && (
				<div
					onClick={() => setLightbox(false)}
					class={merge('ImageView-Modal ', props.class)}>
					{/* <img style={imageStyle} src={props.media.url} alt={props.alt ?? ''}/> */}
					<img
						style={imageStyle}
						src='https://placekitten.com/400/300'
						alt={props.alt ?? ''}
					/>
				</div>
			)}
		</Fragment>
	);
}

export default { identifier, component: Image };

// export const HydratedImageView = withHydration('ImageView', ImageView, (props: any) => {
// 	props.media = {
// 		url: props.media?.url,
// 		size: props.media?.size
// 	} as Media;
// 	return props;
// });

// export const server: ServerDefinition = { identifier: 'ImageView', element: HydratedImageView };

// export const client: ClientDefinition = { identifier: 'ImageView', element: ImageView };