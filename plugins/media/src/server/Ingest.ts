import path from 'path';
import crypto from 'crypto';
import watch from 'node-watch';
import sizeOf from 'image-size';
import { assert } from 'common';
import { promises as fs } from 'fs';
import { dataPath, log } from 'auriserve';

import * as Database from './Database';
import { ingestSVG } from './IngestSVG';
import { ingestImage } from './IngestImage';
import { getMediaType } from '../common/Type';
import { ingestFont } from './IngestFont';

export const MEDIA_DIR = path.join(dataPath, 'media');
export const VARIANT_DIR = path.join(MEDIA_DIR, 'variant');

/** Max size of a file to do a hash computation on. */
const HASH_MAX_SIZE = 1024 * 1024 * 128;

/** Number of parallel ingests to run. */
const INGEST_PARALLELISM = 4;

/**
 * Gets a unique hash for a file. If the file is larger than
 * `HASH_MAX_SIZE`, returns a string containing its size instead.
 */

export async function fileHash(file: string): Promise<string> {
	const stat = await fs.stat(file);
	if (stat.size > HASH_MAX_SIZE) return `size_${stat.size}`;
	const hash = crypto.createHash('sha1');
	hash.update(await fs.readFile(file));
	return hash.digest('hex');
}

/**
 * Reconciles media files that were added, removed, or changed in the media directory,
 * regenerating their variants and updating their database entries as necessary.
 * Returns a function to stop watching the media directory.
 */

export async function reconcileMedia() {

	// Create directories if they don't exist.

	try { await fs.access(MEDIA_DIR); } catch (e) { await fs.mkdir(MEDIA_DIR); }
	try { await fs.access(VARIANT_DIR); } catch (e) { await fs.mkdir(VARIANT_DIR); }

	const allFiles = await fs.readdir(MEDIA_DIR, { withFileTypes: true });

	// Ingest new / modified media files.

	const toIngest = (await Promise.all(allFiles.map(async (file): Promise<[ string, boolean ]> => {
		if (file.isDirectory()) return [ file.name, false ];
		const filePath = path.join(MEDIA_DIR, file.name);
		return [ file.name, !Database.mediaHashMatches(file.name, await fileHash(filePath)) ];
	}))).filter(([ _, shouldIngest ]) => shouldIngest).map(([ file ]) => file);

	if (toIngest.length) {
		log.info(`Ingesting ${toIngest.length} media item${toIngest.length === 1 ? '' : 's'}.`);
		const start = Date.now();

		while (toIngest.length) {
			const promises = [];
			for (let i = 0; i < INGEST_PARALLELISM; i++) {
				const file = toIngest.pop();
				if (file) promises.push((async () => {
					try { await ingest(path.join(MEDIA_DIR, file), { generateVariants: true }); }
					catch (e) { log.error('%s', e); }
				})());
			}
			await Promise.allSettled(promises);
		}

		log.info(`Ingesting completed in ${Date.now() - start} ms.`);
	}

	// Delete media entries whose files have been removed from disk.

	Database.getAllCanonicalPathHashPairs()
		.filter(media => !allFiles.find(file => file.name === path.parse(media.path).base))
		.forEach(media => remove(media.id));

	// Watch for future changes.

	const watcher = watch(MEDIA_DIR, {}, async (evt, filePath) => {
		if (evt === 'remove') {
			const variant = Database.getMediaVariant(path.relative(MEDIA_DIR, filePath));
			if (!variant) return;
			remove(variant.mid);
		}
		else if (evt === 'update') {
			const relativePath = path.relative(MEDIA_DIR, filePath);
			const variant = Database.getMediaVariant(relativePath);
			if (variant && variant.hash === await fileHash(filePath)) return;
			ingest(filePath, { overwrite: variant?.mid, generateVariants: true });
		}
	});

	return () => watcher.close();
}

interface IngestOptions {
	name?: string;
	description?: string;
	overwrite?: number;
	path?: string;
	copy?: boolean;
	generateVariants?: boolean;
}

/**
 * Ingests a file as a media item. Copies or moves it into the media directory,
 * and creates a media entry in the database, as well as a canonical variant.
 * Generates variants if prompted.
 */

export async function ingest(filePath: string, options: IngestOptions) {
	const stat = await fs.stat(filePath);
	const parsedPath = path.parse(filePath);
	const type = getMediaType(filePath);
	const hash = await fileHash(filePath);
	const size = type === 'image' || type === 'svg' ? sizeOf(filePath) : null;
	const relativePath = path.relative(MEDIA_DIR, filePath);

	options.name ??= parsedPath.name;
	options.description ??= '';
	options.path ??= filePath;

	if (!path.isAbsolute(options.path)) options.path = path.resolve(MEDIA_DIR, options.path);
	const existingVariant = Database.getMediaVariant(filePath);

	assert(path.parse(options.path).ext === parsedPath.ext,
		'Output path must have the same extension as the input path.');
	assert(relativePath.split(path.sep).length === 1,
		'Destination path must be in the media directory.');
	assert(!existingVariant || (options.overwrite != null), 'Media item already exists.');

	if (options.path !== filePath) {
		if (options.copy) await fs.copyFile(filePath, options.path);
		else await fs.rename(filePath, options.path);
	}

	const id = Database.addMedia(
		{ name: options.name, description: options.description, type, id: options.overwrite },
		{ hash, path: relativePath, size: stat.size },
		size ? { width: size.width!, height: size.height! } : undefined
	) as number;

	if (options.generateVariants) await generateVariants(id);

	log.debug(`Ingested '${path.parse(options.path).base}' (${id}).`);

	return id;
}

/**
 * Removes a media item and all its variants from the database and disk.
 */

export async function remove(id: number) {
	const variants = Database.getMediaVariants(id);
	if (!variants.length) return;

	await Promise.all(variants.map(async v => {
		if (v.path.startsWith('data:')) return;
		try { await fs.unlink(path.join(MEDIA_DIR, v.path)); }
		catch (e) { /** doesn't matter. */ }
	}));

	const original = variants.find(v => v.type === 'original');
	Database.removeMedia(id);

	log.debug(`Media '${path.parse(original?.path ?? '').base}' (${id}) removed from disk.`);
}

/**
 * Generates variants for a media item.
 * **THE MEDIA ITEM MUST HAVE A CANONICAL VARIANT.**
 */

export async function generateVariants(id: number) {
	const media = Database.getMedia(id);
	assert(media, 'Media item does not exist.');
	assert(media.canonical, 'Media item does not have a canonical variant.');
	const canonical = Database.getMediaVariant(media.canonical);
	assert(canonical, 'Media item\'s canonical variant does not exist.');

	switch (media?.type) {
		case 'audio':
		case 'video':
		case 'document':
		case 'other': {
			return;
		}

		case 'font': {
			await ingestFont(media, canonical);
			return;
		}

		case 'image': {
			await ingestImage(media, canonical);
			return;
		}

		case 'svg': {
			await ingestSVG(media, canonical);
			return;
		}
	}
}
