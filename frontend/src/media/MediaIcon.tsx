import { h } from 'preact';

import Svg from '../Svg';

import { merge } from 'common/util';

import icon_document from '@res/icon/file.svg';

interface Props {
	path: string;
	image?: string;
	iconOnly?: boolean;

	style?: any;
	class?: string;
}

/** Image extensions that should be considered for loading a preview from URL. */
const IMAGE_EXTS = ['png', 'svg', 'jpg', 'jpeg', 'svg', 'gif'];

/**
 * Displays an icon for a media file within a box.
 * If the file is an image, it will be displayed as such unless `iconOnly` is true.
 * If `image` is set, that will always be displayed instead of an icon or loaded image.
 */

export default function MediaIcon(props: Props) {
	const isImage = props.image ?? IMAGE_EXTS.filter((p) => props.path.endsWith('.' + p)).length > 0;
	const showImage = (!props.iconOnly ?? props.image);

	return (
		<div class={merge(props.class,
			'w-18 h-18 bg-neutral-100 dark:bg-neutral-750 primary-neutral-100 secondary-neutral-300',
			'rounded interact-none grid place-items-center transition')}>
			{isImage && showImage
				? <img width={64} height={64} src={props.image ?? props.path} alt='' loading='lazy' role='presentation'
					class='object-cover rounded w-full h-full'/>
				: <Svg src={icon_document} size={10}/>}
		</div>
	);
}
