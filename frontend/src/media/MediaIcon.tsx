import { h } from 'preact';

import Svg from '../Svg';

import { tw, merge } from '../twind';

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
	const isImage =
		props.image ?? IMAGE_EXTS.filter((p) => props.path.endsWith(`.${p}`)).length > 0;
	const showImage = !props.iconOnly ?? props.image;

	return (
		<div
			class={merge(
				tw`flex w-18 h-18 bg-gray-(100 dark:750) icon-p-gray-100 icon-s-gray-300
				rounded interact-none place-items-center items-center justify-center transition`,
				props.class
			)}>
			{isImage && showImage ? (
				<img
					width={64}
					height={64}
					src={props.image ?? props.path}
					alt=''
					loading='lazy'
					role='presentation'
					class={tw`w-full h-full rounded object-cover`}
				/>
			) : (
				<Svg src={icon_document} size={10} />
			)}
		</div>
	);
}
