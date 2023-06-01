export const identifier = 'base:image';

export interface SharedProps {
	alt?: string;
	lazy?: boolean;
	aspect?: number;
	maxWidth?: number;
	maxHeight?: number;

	lightbox?: boolean;
	protect?: boolean;

	class?: string;
	style?: string;
}

import type { Props as ExternalProps } from './External'
import type { Props as MediaRasterProps } from './MediaRaster'
import type { Props as MediaVectorProps } from './MediaVector'

export type Props = (ExternalProps | MediaRasterProps | MediaVectorProps);
