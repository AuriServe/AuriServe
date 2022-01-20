import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { withHydration, ClientDefinition, ServerDefinition } from 'plugin-api';

import { Media } from 'common/graph/type';

import { ImageView } from './ImageView';

import './ImageGallery.sss';

export interface Props {
	gap?: number;
	width?: number;

	lightbox?: true;
	protect?: true;
	aspect?: number;

	media: Media[];
	count?: number;
	loadMore?: number;

	style?: any;
	class?: string;
}

/**
 * Renders a grid of images in a grid or masonry layout.
 * Can disclose only a subset of images, and show a button to show more.
 */

export function ImageGallery(props: Props) {
	const [ loadCount, setLoadCount ] = useState<number>(props.count ?? props.media.length);
	useEffect(() => setLoadCount(props.count ?? props.media.length), [ props.count, props.media ]);

	return (
		<div class='ImageGallery'>
			<div class='ImageGallery-Grid'
				style={{
					columnGap: props.gap ? props.gap + 'px' : undefined,
					gridTemplateColumns: `repeat(auto-fit, minmax(min(${props.width ?? 300}px, 100%), 1fr))`
				}}>
				{props.media.slice(0, loadCount).map(media =>
					<ImageView
						media={media}
						key={media.id}
						aspect={props.aspect}
						protect={props.protect}
						lightbox={props.lightbox}
						style={{
							marginBottom: props.gap ? props.gap + 'px' : undefined,
							gridRow: !props.aspect ? `span ${Math.floor(media.size!.y / media.size!.x * 30)}` : undefined
						}}
					/>
				)}
			</div>
			{'window' in global && props.loadMore && loadCount < props.media.length &&
				<button onClick={() => setLoadCount(l => l + props.loadMore!)}
					class='ImageGallery-ShowMore Button'>Show More</button>}
		</div>
	);
};

export const HydratedImageGallery = withHydration('ImageGallery', ImageGallery, (props: Props) => {
	props.media = props.media.map(media => ({
		url: media.url,
		size: media.size })
	) as Media[];
	return props;
});

export const server: ServerDefinition = { identifier: 'ImageGallery', element: HydratedImageGallery };

export const client: ClientDefinition = { identifier: 'ImageGallery', element: ImageGallery };
