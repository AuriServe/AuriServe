import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { Media } from 'common/graph/type';
import { ClientDefinition, ServerDefinition } from 'common/definition';

import './ImageGallery.sss';

import { client as ImageView } from './ImageView';

import { withHydration } from '../Hydration';

interface Props {
	gap: number;
	width: number;
	aspect?: number;

	lightbox?: true;
	protect?: true;

	media: Media[];

	class?: string;
	children?: Preact.VNode[];

	count?: number;
	loadMore?: number;
}

/**
 * Renders a grid of images, the same way a GridLayout renders children.
 * Can specify properties to apply to all of the images.
 */

function ImageGallery(props: Props) {
	const [ loadCount, setLoadCount ] = useState<number>(props.count ?? props.media.length);
	useEffect(() => setLoadCount(props.count ?? props.media.length), [ props.count, props.media ]);

	return (
		<div class='ImageGallery'>
			<div class='ImageGallery-Grid'
				style={{
					columnGap: props.gap + 'px',
					gridTemplateColumns: `repeat(auto-fit, minmax(min(${props.width ?? 300}px, 100%), 1fr))`
				}}>
				{props.media.slice(0, loadCount).map(media =>
					<ImageView.element
						media={media}
						key={media.id}
						aspect={props.aspect}
						protect={props.protect}
						lightbox={props.lightbox}
						style={{
							marginBottom: props.gap + 'px',
							gridRow: props.aspect ? '' : `span ${Math.floor(media.size!.y / media.size!.x * 30)}`
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

const HydratedImageGallery = withHydration('ImageGallery', ImageGallery, (props: Props) => {
	props.media = props.media.map(media => ({ url: media.url, size: media.size })) as Media[];
	return props;
});

export const server: ServerDefinition = {
	identifier: 'ImageGallery',
	element: HydratedImageGallery,
	config: {
		props: {
			gap: { name: 'Children Gap', type: [ 'number', 'text' ], default: 8 },
			width: { name: 'Children Width', type: [ 'number', 'text' ], default: 300 },
			aspect: { name: 'Aspect Ratio', type: [ 'number' ], optional: true },

			lightbox: { name: 'Open Lightbox on Click', type: 'boolean', default: true },
			protect: { name: 'Copy Protection', type: 'boolean' },

			media: { name: 'Images', entries: {
				src: { name: 'Image Source', type: [ 'media:image', 'url:image' ] },
				alt: { name: 'Alt Text', type: 'text', optional: true }
			}},

			count: { name: 'Initial Images', type: [ 'number' ], optional: true },
			loadMore: { name: 'Load More Count', type: [ 'number' ], optional: true }
		}
	}
};

export const client: ClientDefinition = {
	identifier: 'ImageGallery',
	element: ImageGallery
};
