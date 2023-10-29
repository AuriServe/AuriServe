import { MediaGraph } from "../common/Type";

const THUMBNAIL_MIN_SIZE = 300;

export function getThumbnail(media: MediaGraph, minSize = THUMBNAIL_MIN_SIZE) {
	const scaledVariants = media.variants.filter(v => v.type === 'image_scaled' && (v.width ?? 0) >= minSize);
	if (scaledVariants.length === 0) return media.canonicalVariant;
	let smallest = scaledVariants[0];
	for (const variant of scaledVariants) {
		if ((variant.width ?? 0) < (smallest.width ?? 0)) smallest = variant;
	}
	return smallest;
}
