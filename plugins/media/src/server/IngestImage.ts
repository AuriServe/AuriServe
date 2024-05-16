import path from 'path';
import sizeOf from 'image-size';
import { assert } from 'common';
import { log } from 'auriserve';
import { promises as fs } from 'fs';
import { exec } from 'child_process';

import * as Database from './Database';
import { MEDIA_DIR, VARIANT_DIR, fileHash } from './Ingest';
import { Media, MediaVariant, VariantType } from '../common/Type';

/** Default quality for scaling images. */
const DEFAULT_QUALITY = 80;

/** Maximum byte size for the inline image variant. */
const INLINE_BYTE_HINT = 1024;

/** Maximum size for the inline image variant. */
const INLINE_MAX_SIZE = 64;

/** Maximum size for storing an image in the database. */
const MAX_DB_SIZE = 1024 * 2;

/** Sizes to generate for `image_scaled` images. */
const SCALED_SIZES = [ 2880, 1920, 1440, 960, 480, 256, 128 ];

/**
 * Executes cwebp with the properties specified.
 */

export function execCWebP(input: string, output: string, options: string) {
	return new Promise<string>((resolve, reject) => {
		fs.unlink(output).catch(() => { /* we don't care if the file exists. */ }).finally(() =>
			exec(`cwebp ${options} "${input.replace(/\\/, '\\\\').replace(/"/g, '\\"')}"\
				-o "${output.replace(/\\/, '\\\\').replace(/"/g, '\\"')}"`, (err) => {
				if (err) reject(err);
				else resolve(output);
			})
		);
	});
}

/**
 * Scales width and height dimensions to both fit within a single maxmimum size.
 */

export function scaleTo(width: number, height: number, max: number): { width: number, height: number }{
	const ratio = Math.max(Math.max(width, height) / max, 1);
	return { width: Math.floor(width / ratio), height: Math.floor(height / ratio) };
}

/**
 * Generates a variant image with the constraints specified.
 */

export function generateVariantImage(inPath: string, outPath: string,
	inSize: { width: number; height: number }, maxSize?: number, quality: number = DEFAULT_QUALITY, maxBytes?: number) {

	let options = '';

	if (maxSize) {
		inSize ??= sizeOf(inPath) as { width: number, height: number };
		const size = scaleTo(inSize.width, inSize.height, maxSize);
		options += `-resize ${size.width} ${size.height} `;
	}

	if (quality) options += `-q ${quality} `;
	if (maxBytes) options += `-size ${maxBytes} `;

	return execCWebP(inPath, outPath, options);
}

/**
 * Ingests a media image, generating different scaled variants.
 */

export async function ingestImage(media: Media, canonical: MediaVariant) {
	const canonicalVariant = Database.getMediaVariant(canonical.id, true);
	assert(canonicalVariant && canonicalVariant.width != null && canonicalVariant.height != null,
		'Image variant does not exist.');

	const canonicalPath = path.join(MEDIA_DIR, canonical.path);
	const parsedPath = path.parse(canonicalPath);
	const dimensions = { width: canonicalVariant.width!, height: canonicalVariant.height! };
	const maxDimension = Math.max(dimensions.width, dimensions.height);

	await Promise.all([

		// Scaled variants.
		...[ ...new Set([ ...SCALED_SIZES, Math.min(maxDimension, SCALED_SIZES[SCALED_SIZES.length - 1]) ]).values() ]
		.filter(s => s <= maxDimension).map(async (size) => {
			const outputPath = path.join(VARIANT_DIR, `${parsedPath.name}.${size}.webp`);
			await generateVariantImage(canonicalPath, outputPath, dimensions, size);
			return { path: outputPath, type: 'image_scaled', prop: size };
		}),

		// Full variant.
		(async () => {
			const outputPath = path.join(VARIANT_DIR, `${parsedPath.name}.full.webp`);
			await generateVariantImage(canonicalPath, outputPath, dimensions);
			return { path: outputPath, type: 'image_full' };
		})(),

		// Inline variant.
		(async () => {
			const outputPath = path.join(VARIANT_DIR, `${parsedPath.name}.inline.webp`);
			await generateVariantImage(canonicalPath, outputPath, dimensions, INLINE_MAX_SIZE, undefined, INLINE_BYTE_HINT);
			return { path: outputPath, type: 'image_inline' };
		})()

	].map(async promise => {
		try {
			const data = await promise as { path: string; type: VariantType; prop?: number };
			const { width, height } = sizeOf(data.path) as { width: number, height: number };
			const [ stat, hash ] = await Promise.all([ fs.stat(data.path), fileHash(data.path) ]);

			if (data.type === 'image_inline') {
				const b64Path = await fs.readFile(data.path, 'base64');
				await fs.unlink(data.path);
				data.path = `data:image/webp;base64,${b64Path}`;
			}
			else {
				data.path = path.relative(MEDIA_DIR, data.path);
			}

			Database.addMediaVariant(
				{
					mid: media.id,
					type: data.type,
					prop: data.prop ?? 0,
					path: data.path,
					hash,
					size: stat.size,
					width,
					height
				});
		}
		catch (err) {
			log.error('%s', err); return null;
		}
	}));
}
