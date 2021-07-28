import { h, ComponentChildren } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { TransitionGroup, CSSTransition } from 'preact-transitioning';
import { withHydration, Static, ServerDefinition, ClientDefinition } from 'plugin-api';

import { Media } from 'common/graph/type';
import { mergeClasses } from 'common/util';

import './ImageCarousel.sss';

export interface Props {
	media: Media[];
	interval?: number;
	height?: string | number;

	class?: string;
	style?: Record<string, string>;
	children?: ComponentChildren;
}

/**
 * Renders a container with a cycling image background.
 */

export function ImageCarousel(props: Props) {
	const [ index, setIndex ] = useState<number>(0);

	useEffect(() => {
		if (props.media.length === 0) return;
		let valid = true;

		const nextIndex = (index + 1) % props.media.length;
		const nextImage = new Image();
		nextImage.src = props.media[nextIndex].url;

		setTimeout(() => {
			const updateImage = () => {
				if (!valid) return;
				setIndex(nextIndex);
			};

			if (nextImage.complete) updateImage();
			else nextImage.onload = updateImage;
		}, props.interval ?? 5000);

		return () => valid = false;
	}, [ index, setIndex, props.interval, props.media ]);

	return <div
		style={{ paddingBottom: typeof props.height === 'number' ? props.height + 'px' : props.height, ...props.style }}
		class={mergeClasses('ImageCarousel', props.class)}
	>

		<div class='ImageCarousel-Images'>
			<TransitionGroup duration={500}>
				<CSSTransition key={index} classNames='Animate'>
					<img className='ImageCarousel-Image' src={props.media[index].url} alt='' role='presentation'/>
				</CSSTransition>
			</TransitionGroup>
		</div>
		<div class='ImageCarousel-Children'>
			<Static>{props.children}</Static>
		</div>
	</div>;
}


export const HydratedImageCarousel = withHydration('ImageCarousel', ImageCarousel, (props: Props) => {
	props.media = props.media.map(media => ({
		url: media.url,
		size: media.size })
	) as Media[];
	return props;
});

export const server: ClientDefinition = { identifier: 'ImageCarousel', element: HydratedImageCarousel };

export const client: ServerDefinition = { identifier: 'ImageCarousel', element: ImageCarousel };
