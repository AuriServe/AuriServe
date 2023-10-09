import { h } from 'preact';

import PostItem from './PostItem';
import { getOptimizedImage } from 'media';
import { FeedRenderCtx } from './Feed';

const TYPES = [ 'zythia' ] as const;

type WebRingType = typeof TYPES[number];

interface Props {
	type: WebRingType;
	ctx?: FeedRenderCtx;
}

const INFO: Record<string, {
	title: string;
	titleColor: string;
	description: string;
	descriptionColor: string;
	icon: number;
	background: number;
	url: string;
}> = {
	zythia: {
		title: '',
		titleColor: '#0000',
		description: '',
		descriptionColor: '#0000',
		icon: 64,
		background: 63,
		url: 'https://zythia.art'
	}
} as const;

export default function WebRingItem({ type, ctx }: Props) {
	const info = INFO[type];

	return (
		<PostItem
			i={ctx?.i}
			class={`webring`}
			style={{
				'--icon': `url(/media/${getOptimizedImage(info.icon, 64)?.path})`,
				'--background': `url(/media/${getOptimizedImage(info.background, 350)?.path})`,
				'--titleColor': info.titleColor,
				'--descriptionColor': info.descriptionColor
		}}>
			<a class='inner' target='_blank' rel='noreferrer' href={info.url}>
				<div class='icon'/>
				<div class='content'>
					<p class='title'>{info.title}</p>
					<p class='description'>{info.description}</p>
				</div>
			</a>
		</PostItem>
	);
}
