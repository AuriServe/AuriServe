import { h } from 'preact';
import { useMemo } from 'preact/hooks';

import External from './External';
import MediaRaster from './MediaRaster';
import MediaVector from './MediaVector';
import { identifier, Props } from './Type';

const media = (typeof window === 'undefined' ? require('media') : null) as typeof import('media');

enum Type {
	External = 'external',
	MediaRaster = 'media-raster',
	MediaVector = 'media-vector',
	MediaMissing = 'media-missing'
};

export function Image(props: Props) {
	const type = useMemo(() => {
		if ('url' in props) return Type.External;
		else if ('path' in props) return Type.MediaRaster;
		else if ('vector' in props) return Type.MediaVector;
		else if (!('media' in props)) return Type.MediaMissing;

		const mediaItem = media.getMedia(props.media);
		if (mediaItem?.type === 'svg') return Type.MediaVector;
		else if (mediaItem?.type === 'image') return Type.MediaRaster;
		return Type.MediaMissing;
	}, [ props ]);

	switch (type) {
		case Type.External: return <External {...props as any} />;
		case Type.MediaRaster: return <MediaRaster {...props as any} />;
		case Type.MediaVector: return <MediaVector {...props as any} />;
		case Type.MediaMissing: return <div>TEMP MISSING MEDIA</div>;
	}
}

export default { identifier, component: Image };
