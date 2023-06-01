export const MEDIA_EXTENSIONS_IMAGE =
	[ 'png', 'jpg', 'webp', 'gif', 'bmp' ] as const;
export const MEDIA_EXTENSIONS_SVG =
	[ 'svg' ] as const;
export const MEDIA_EXTENSIONS_AUDIO =
	[ 'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma' ] as const;
export const MEDIA_EXTENSIONS_VIDEO =
	[ 'mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv' ] as const;
export const MEDIA_EXTENSIONS_FONT =
	[ 'ttf', 'otf', 'woff', 'woff2' ] as const;
export const MEDIA_EXTENSIONS_DOCUMENT =
	[ 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'txt', 'rtf' ] as const;

export type ImageExtensions = typeof MEDIA_EXTENSIONS_IMAGE[number];
export type SVGExtensions = typeof MEDIA_EXTENSIONS_SVG[number];
export type AudioExtensions = typeof MEDIA_EXTENSIONS_AUDIO[number];
export type VideoExtensions = typeof MEDIA_EXTENSIONS_VIDEO[number];
export type FontExtensions = typeof MEDIA_EXTENSIONS_FONT[number];
export type DocumentExtensions = typeof MEDIA_EXTENSIONS_DOCUMENT[number];

export const MEDIA_TYPES = [ 'image', 'svg', 'audio', 'video', 'document', 'font', 'other' ] as const;

export type MediaType = typeof MEDIA_TYPES[number];

export const MEDIA_EXTENSIONS: Record<MediaType, readonly string[]> = {
	image: MEDIA_EXTENSIONS_IMAGE,
	svg: MEDIA_EXTENSIONS_SVG,
	audio: MEDIA_EXTENSIONS_AUDIO,
	video: MEDIA_EXTENSIONS_VIDEO,
	document: MEDIA_EXTENSIONS_DOCUMENT,
	font: MEDIA_EXTENSIONS_FONT,
	other: []
};

export function getMediaType(file: string): MediaType {
	const ext = file.slice(file.lastIndexOf('.') + 1) as any;
	for (const [ type, extensions ] of Object.entries(MEDIA_EXTENSIONS))
		if (extensions.includes(ext)) return type as MediaType;
	return 'other';
}

export const VARIANT_TYPES = [
	'original',
	'image_inline', 'image_scaled', 'image_full',
	'svg_min', 'svg_inline',
	'font_optimized', 'font_inline'
];

export type VariantType = typeof VARIANT_TYPES[number];
