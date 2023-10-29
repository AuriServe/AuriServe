import path from 'path';
import svgo from 'svgo';
import sizeOf from 'image-size';
import { promises as fs } from 'fs';

import * as Database from './Database';
import { Media, MediaVariant } from '../common/Type';
import { MEDIA_DIR, VARIANT_DIR, fileHash } from './Ingest';

/**
 * Ingests a media SVG, optimizing it, and generating an inline version.
 */

export async function ingestSVG(media: Media, canonical: MediaVariant) {
	const filePath = path.join(MEDIA_DIR, canonical.path);
	const parsedPath = path.parse(filePath);

	const svg = svgo.optimize(await fs.readFile(filePath, 'utf-8'), {
		path: filePath,
		multipass: true,

		plugins: [ {
			name: 'preset-default',
			params: { overrides: { removeViewBox: false } }
		} ]
	});

	const outputPath = path.join(VARIANT_DIR, `${parsedPath.name}.min.svg`);
	await fs.writeFile(outputPath, svg.data, 'utf-8')

	const [ stat, hash ] = await Promise.all([ fs.stat(outputPath), fileHash(outputPath) ]);
	const { width, height } = sizeOf(outputPath) as { width: number; height: number };

	Database.addMediaVariant(
		{ mid: media.id, hash, path: path.relative(MEDIA_DIR, outputPath),
			size: stat.size, type: 'svg_min', prop: 0, width, height });

	const inlineData = svg.data
		.replace(/"/g, `'`)
		.replace(/>\s{1,}</g, `><`)
		.replace(/\s{2,}/g, ` `)
		.replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);

	const inlined = `data:image/svg+xml,${inlineData}`;
	Database.addMediaVariant(
		{ mid: media.id, hash, path: inlined,
			size: stat.size, type: 'svg_inline', prop: 0, width, height });
}
