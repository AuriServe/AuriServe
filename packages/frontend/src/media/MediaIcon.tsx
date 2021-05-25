import * as Preact from 'preact';

import './MediaIcon.sass';

interface Props {
	path: string;
	image?: string;
	imageIcon?: boolean;

	class?: string;
}

const IMAGE_EXTS = ['png', 'svg', 'jpg', 'jpeg', 'svg', 'gif'];
const ICON_PREFIX = '/admin/asset/icon/ext-';

const ICONS: {[key: string]: string | undefined} = {
	unknown: ICON_PREFIX + 'unknown-color.svg',

	md:  ICON_PREFIX + 'txt-color.svg',
	txt: ICON_PREFIX + 'txt-color.svg',

	pdf: ICON_PREFIX + 'pdf-color.svg',

	doc:  ICON_PREFIX + 'document-color.svg',
	docx: ICON_PREFIX + 'document-color.svg',

	xls:  ICON_PREFIX + 'sheet-color.svg',
	xlsx: ICON_PREFIX + 'sheet-color.svg',

	ppt:  ICON_PREFIX + 'slideshow-color.svg',
	pptx: ICON_PREFIX + 'slideshow-color.svg',

	image: ICON_PREFIX + 'image-color.svg'
};

export function mediaIsImage(path: string) {
	return IMAGE_EXTS.filter((p) => path.endsWith('.' + p)).length > 0;
}

export default function MediaIcon(props: Props) {
	const isImage = props.image ?? mediaIsImage(props.path);
	const showImage = (props.imageIcon === undefined || props.imageIcon);

	if (isImage && showImage) return (
		<img
			class={('MediaIcon Image ' + (props.class ?? '')).trim()}
			src={(props.image ? props.image : props.path + '?res=thumbnail')}
			alt='' loading='lazy'
		/>
	);

	let iconUrl = ICONS.unknown;
	if (isImage) iconUrl = (showImage ? props.image ?? props.path : ICONS.image);
	else iconUrl = ICONS[props.path.substr(props.path.lastIndexOf('.') + 1)] ?? iconUrl;

	return (
		<img
			class={('MediaIcon Icon ' + (props.class ?? '')).trim()}
			src={iconUrl}
			alt=''
		/>
	);
}
