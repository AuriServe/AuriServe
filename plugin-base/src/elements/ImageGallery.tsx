import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ServerDefinition, ClientDefinition, Media } from 'auriserve-api';

import './ImageGallery.sss';

import { client as ImageView } from './ImageView';
import { server as GridLayout } from './GridLayout';

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
			<GridLayout.element
				class={('ImageGallery-Grid ' + (props.class ?? '')).trim()}
				gap={props.gap}
				width={props.width}>

				{props.media.map((media, i) => {
					if (i >= loadCount) return;
					return (
						<ImageView.element
							key={i}
							media={media}
							aspect={props.aspect}
							lightbox={props.lightbox}
							protect={props.protect}
						/>
					);
				})}
			</GridLayout.element>
			{'window' in global && props.loadMore && loadCount < props.media.length &&
				<button onClick={() => setLoadCount(l => l + props.loadMore!)}
					class='ImageGallery-ShowMore'>Show More</button>}
		</div>
	);
};

const HydratedImageGallery = withHydration('ImageGallery', ImageGallery, (props: Props) => {
	props.media = props.media.map(media => ({ publicPath: media.publicPath })) as Media[];
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

			images: { name: 'Images', entries: {
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
