import path from 'path';
import { assert } from 'common';
import { promises as fs, constants as fsc } from 'fs';
import auriserve, { router, dataPath, database, log } from 'auriserve';

import { getFileType } from './FileType';
import { generateAllPresets } from './WebP';
import { init, Media, MediaImageVariant } from './Database';

init();

const MEDIA_DIR = path.join(dataPath, 'media');
const VARIANTS_DIR = path.join(MEDIA_DIR, 'variants');

const routes = [
	router.get('/media/variants/:path', async (req, res) => {
		const file = req.params.path;
		try {
			assert(typeof file === 'string', 'Invalid path.');
			const medPath = path.join(VARIANTS_DIR, file);
			await fs.access(medPath, fsc.R_OK);
			res.sendFile(medPath);
		}
		catch (e) {
			res.sendStatus(500);
		}
	}),

	router.get('/media/:path', async (req, res) => {
		const file = req.params.path;
		try {
			assert(typeof file === 'string', 'Invalid path.');
			const medPath = path.join(MEDIA_DIR, file);
			await fs.access(medPath, fsc.R_OK);
			res.sendFile(medPath);
		}
		catch (e) {
			res.sendStatus(500);
		}
	})
];

auriserve.once('cleanup', () => routes.forEach(route => router.remove(route)));

export interface IngestOptions {
	path?: string;
	name?: string;
	description?: string;
	overwrite?: boolean;
	copy?: boolean;
}

export async function ingest(file: string, options: IngestOptions = {}): Promise<Media> {
	const stat = await fs.stat(file);

	options.path ??= path.join(MEDIA_DIR, path.parse(file).base);
	assert(options.path.substring(0, options.path.lastIndexOf('/')) === path.join(MEDIA_DIR),
		'Invalid output path.');

	assert(path.parse(options.path).ext === path.parse(file).ext,
		'Output path must have the same extension as the input path.');

	options.name ??= path.parse(file).name;
	options.description ??= '';

	const existing = database.prepare('SELECT id, type FROM media WHERE path = ?').get(options.path);
	assert(!existing || !!options.overwrite, 'Media already exists.');

	if (options.path !== file) {
		if (options.copy) await fs.copyFile(file, options.path);
		else await fs.rename(file, options.path);
	}

	if (existing && existing.type === 'image')
		database.prepare('DELETE FROM media_image_variants WHERE media = ?').run(existing.id);

	const type = getFileType(options.path);

	const id = database.prepare(
		'INSERT OR REPLACE INTO media (path, name, description, type, size) VALUES (?, ?, ?, ?, ?)')
		.run(options.path, options.name, options.description, type, stat.size).lastInsertRowid as number;

	if (type === 'image') {
		const paths = await generateAllPresets(options.path, VARIANTS_DIR);
		await Promise.all(Object.entries(paths).map(async ([ preset, file ]) => {
			const stat = await fs.stat(file);

			// Convert to data uri if the length < 1024.
			if (stat.size < 1024) {
				const data = await fs.readFile(file, 'base64');
				await fs.unlink(file);
				file = `data:image/webp;base64,${data}`;
			}

			database.prepare('INSERT INTO media_image_variants (media, path, type, size) VALUES (?, ?, ?, ?)')
				.run(id, file, preset, stat.size);
		}));
	}

	return getMedia(id);
}

export function remove(id: number): boolean;
export function remove(path: string): boolean;

export function remove(idOrPath: number | string) {
	if (typeof idOrPath === 'string') idOrPath = getMedia(idOrPath)?.id ?? -1;

	const id = database.prepare('DELETE FROM media WHERE id = ? RETURNING id').get(idOrPath).id;
	if (typeof id !== 'number') return false;

	const paths = database.prepare('DELETE FROM media_image_variants WHERE media = ? RETURNING path').all(id);

	paths.forEach(({ path }) => {
		if (path.startsWith('data:')) return;
		fs.unlink(path).catch(() => { /* Don't care if it failed. */ });
	});

	return true;
}

export function getMedia(id: number): Media;
export function getMedia(path: string): Media;

export function getMedia(idOrPath: number | string): Media | null {
	if (typeof idOrPath === 'number') return database.prepare('SELECT * FROM media WHERE id = ?').get(idOrPath);
	return database.prepare('SELECT * FROM media WHERE path = ?').get(idOrPath);
}

/**
 * Gets a list of variants for the specified media item.
 * Variants are only generated for raster images.
 *
 * @param id - The ID of the image.
 * @returns a list of all variants of an image media item.
 */

export function getMediaImageVariants(id: number): MediaImageVariant[];

/**
 * Gets a list of variants for the specified media item.
 * Variants are only generated for raster images.
 *
 * @param path - The path of the image.
 * @returns a list of all variants of an image media item.
 */

export function getMediaImageVariants(path: string): MediaImageVariant[];

/**
 * Gets a list of variants for the specified media item.
 * Variants are only generated for raster images.
 *
 * @param idOrPath - The ID or path of the image.
 * @returns a list of all variants of an image media item.
 */

export function getMediaImageVariants(idOrPath: number | string): MediaImageVariant[] {
	if (typeof idOrPath === 'string') idOrPath = getMedia(idOrPath).id ?? -1;
	return database.prepare('SELECT * FROM media_image_variants WHERE media = ?').all(idOrPath);
}

/**
 * Returns true if the specified file path is in the media database.
 *
 * @param file - The file path to check.
 * @returns true if the file is in the media database.
 */

export function fileIsInDatabase(file: string): boolean {
	return database.prepare('SELECT id FROM media WHERE path = ?').get(file) ||
		database.prepare('SELECT id FROM media_image_variants WHERE path = ?').get(file);
}

/*
 * Sync the state of the database and the filesystem by adding any unindexed media items,
 * and removing any media items and their variants that have been removed from the filesystem.
 */

(async () => {
	await fs.mkdir(path.join(VARIANTS_DIR)).catch(() => { /* Don't care if it exists. */ });

	const allFiles = await fs.readdir(MEDIA_DIR);
	const toIngest = allFiles.filter(file => file.lastIndexOf('.') > 0 && !fileIsInDatabase(path.join(MEDIA_DIR, file)));

	if (toIngest.length) {
		log.info(`Ingesting ${toIngest.length} media item${toIngest.length === 1 ? '' : 's'}.`);
		const start = Date.now();
		await Promise.all(toIngest.map(async file => {
			const { id } = await ingest(path.join(MEDIA_DIR, file), { overwrite: true });
			log.debug(`Ingested '${file}' as ${id}.`)
		}));
		log.info(`Ingesting completed in ${Date.now() - start} ms.`);
	}

	const allMedia = database.prepare('SELECT path FROM media').all();
	const toRemove = allMedia.filter(media => !allFiles.includes(path.parse(media.path).base)).map(media => media.path);

	if (toRemove.length) {
		log.info(`Removing ${toRemove.length} media item${toRemove.length === 1 ? '' : 's'}.`);
		const start = Date.now();
		toRemove.map(file => {
			remove(file);
			log.debug(`Removed '${path.parse(file).base}'.`)
		});
		log.info(`Removing completed in ${Date.now() - start} ms.`);
	}
})();
