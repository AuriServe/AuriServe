import path from 'path';
import { database } from 'auriserve';
import { MEDIA_DIR } from './Ingest';
import { MediaType, MEDIA_TYPES, VARIANT_TYPES, VariantType } from '../common/Type';

const MEDIA_TBL = 'media_media';
const VARIANTS_TBL = 'media_variants';
const IMAGES_TBL = 'media_images';

/** A media item. Individual files pretaining to it are represented by `MediaVariant`s. */
export interface Media {
	id: number;
	name: string;
	description: string;
	type: MediaType;
	canonical: number;
}

/** An ingested media variant. This includes the canonical file. References a `Media`. */
export interface MediaVariant {
	id: number;
	mid: number;
	path: string;
	size: number;
	hash: string;
	type: VariantType;
	prop: number;
}

/** Dimensions for an image media variant. References a `MediaVariant`. */
export interface MediaImageStat {
	id: number;
	vid: number;
	width: number;
	height: number;
}

export function init() {
	/**
	 * Clean-up databases, for testing.
	 */

	// database.prepare('DROP TABLE IF EXISTS ${MEDIA_TBL}').run();
	// database.prepare('DROP TABLE IF EXISTS ${VARIANTS_TBL}').run();
	// database.prepare('DROP TABLE IF EXISTS ${IMAGES_TBL}').run();
	database.prepare('DROP TABLE IF EXISTS media').run();
	database.prepare('DROP TABLE IF EXISTS media_image_variants').run();

	/**
	 * Holds references to Media items. Each media item may have multiple files pretaining to it,
	 * which are held in the `media_variants` table. Contains a reference to the canonical media variant.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${MEDIA_TBL} (
			id INTEGER PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT NOT NULL,
			type TEXT NOT NULL,
			canonical INTEGER
			CHECK (type IN (${MEDIA_TYPES.map(t => `'${t}'`).join(',')}))
		) STRICT`
	).run();

	/**
	 * Holds references to Media Variants. Each media variant is a file pretaining to a media item.
	 * Each file has a different role, which is represented by the `type` column. Some may have a `prop` column as well,
	 * containing additional numeric data about the file, such as the resolution of a `image_scaled` variant.
	 * Each variant links back to a media item, and Media items specify their canonical variant, which is required.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${VARIANTS_TBL} (
			id INTEGER PRIMARY KEY,
			mid INTEGER NOT NULL REFERENCES ${MEDIA_TBL}(id) ON DELETE CASCADE,
			path TEXT NOT NULL,
			size INTEGER NOT NULL,
			hash TEXT NOT NULL,
			type TEXT NOT NULL,
			prop INTEGER NOT NULL,
			CHECK (type IN (${VARIANT_TYPES.map(t => `'${t}'`).join(',')})),
			UNIQUE (type, prop, mid)
		) STRICT`
	).run();

	database.prepare(`CREATE INDEX IF NOT EXISTS media_variants_mid ON ${VARIANTS_TBL} (mid)`).run();
	// database.prepare('CREATE UNIQUE INDEX IF NOT EXISTS media_variants_path ON media_variants (path)').run();

	/**
	 * Holds information about the dimensions of image and svg media variants.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${IMAGES_TBL} (
			id INTEGER PRIMARY KEY,
			vid INTEGER NOT NULL REFERENCES ${VARIANTS_TBL}(id) ON DELETE CASCADE,
			width INTEGER NOT NULL,
			height INTEGER NOT NULL
		) STRICT`
	).run();

	database.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS media_images_vid ON ${IMAGES_TBL} (vid)`).run();
}

init();

const QUERY_GET_MEDIA_FROM_ID = database.prepare(`SELECT * FROM ${MEDIA_TBL} WHERE id = ?`);
const QUERY_GET_VARIANT_FROM_ID = database.prepare(`SELECT * FROM ${VARIANTS_TBL} WHERE id = ?`);
const QUERY_GET_VARIANT_FROM_PATH = database.prepare(`SELECT * FROM ${VARIANTS_TBL} WHERE path = ?`);
const QUERY_GET_VARIANTS_FROM_MEDIA_ID = database.prepare(`SELECT * FROM ${VARIANTS_TBL} WHERE mid = ?`);
const QUERY_GET_IMAGE_STAT_FROM_VARIANT_ID = database.prepare(`SELECT * FROM ${IMAGES_TBL} WHERE vid = ?`);
const QUERY_GET_MEDIA_HASH_FROM_PATH = database.prepare(`SELECT hash FROM ${VARIANTS_TBL} WHERE path = ?`);
const QUERY_GET_VARIANT_FROM_TYPE_AND_ID = database.prepare(`SELECT * FROM ${VARIANTS_TBL} WHERE mid = ? AND type = ?`);
const QUERY_GET_MEDIA_CANONICAL_PATH_HASH_PAIRS = database.prepare(
	`SELECT ${MEDIA_TBL}.id, ${VARIANTS_TBL}.hash, ${VARIANTS_TBL}.path FROM ${MEDIA_TBL}
	INNER JOIN ${VARIANTS_TBL} ON ${MEDIA_TBL}.canonical = ${VARIANTS_TBL}.id`);
const QUERY_INSERT_MEDIA = database.prepare(
	`INSERT INTO ${MEDIA_TBL} (name, description, type) VALUES (?, ?, ?)`);
const QUERY_INSERT_OR_REPLACE_MEDIA = database.prepare(
	`INSERT OR REPLACE INTO ${MEDIA_TBL} (name, description, type, id) VALUES (?, ?, ?, ?)`);
const QUERY_INSERT_MEDIA_VARIANT = database.prepare(
	`INSERT INTO ${VARIANTS_TBL} (mid, path, size, hash, type, prop) VALUES (?, ?, ?, ?, ?, ?)`);
const QUERY_INSERT_MEDIA_IMAGE_STAT = database.prepare(
	`INSERT INTO ${IMAGES_TBL} (vid, width, height) VALUES (?, ?, ?)`);
const QUERY_DELETE_MEDIA = database.prepare(`DELETE FROM ${MEDIA_TBL} WHERE id = ?`);
const QUERY_DELETE_MEDIA_VARIANTS_FROM_ID = database.prepare(`DELETE FROM ${VARIANTS_TBL} WHERE mid = ?`);
const QUERY_SET_MEDIA_CANONICAL_VARIANT = database.prepare(`UPDATE ${MEDIA_TBL} SET canonical = ? WHERE id = ?`);
const QUERY_GET_SMALLEST_VARIANT_FROM_SIZE_AND_ID = database.prepare(
	`SELECT * FROM ${VARIANTS_TBL} WHERE mid = ? AND prop >= ? ORDER BY size ASC LIMIT 1`);
const QUERY_GET_CANONICAL_VARIANT_FROM_ID = database.prepare(
	`SELECT * FROM ${VARIANTS_TBL} WHERE id = (SELECT canonical FROM media_media WHERE id = ?)`);

/** Converts a relative media path to an absolute one. */

export function toAbsolute(relativePath: string) {
	return path.resolve(MEDIA_DIR, relativePath);
}

/** Converts an absolute media path to a relative one. */

export function toRelative(absolutePath: string) {
	return path.relative(MEDIA_DIR, absolutePath);
}



/** Gets a media item from an id or path. */

export function getMedia(idOrPath: number | string): Media | null {
	if (typeof idOrPath === 'string') {
		const { mid } = QUERY_GET_VARIANT_FROM_PATH.get(idOrPath) ?? {};
		if (!mid) return null;
		idOrPath = mid;
	}

	return QUERY_GET_MEDIA_FROM_ID.get(idOrPath);
}

/**
 * Adds a new media item to the database. If `media.id` is specified, the media item with that id will be replaced.
 * Also adds a canonical variant based on the specified information. Deletes all other variants if replacing.
 * Returns the media item's id.
 */

export function addMedia(
	media: Omit<Media, 'canonical' | 'id'> & { id?: number },
	variant: Omit<MediaVariant, 'id' | 'mid' | 'type' | 'prop'>,
	imageStat?: Omit<MediaImageStat, 'id' | 'vid'>) {

	let media_id: number;
	if ('id' in media) media_id = QUERY_INSERT_OR_REPLACE_MEDIA.run(
		media.name, media.description, media.type, media.id).lastInsertRowid as number;
	else media_id = QUERY_INSERT_MEDIA.run(
		media.name, media.description, media.type).lastInsertRowid as number;

	QUERY_DELETE_MEDIA_VARIANTS_FROM_ID.run(media_id);

	const variant_id = addMediaVariant({ ...variant, mid: media_id, type: 'original', prop: 0 }, imageStat);

	QUERY_SET_MEDIA_CANONICAL_VARIANT.run(variant_id, media_id);

	return media_id;
}

export function removeMedia(id: number) {
	return QUERY_DELETE_MEDIA.run(id).changes > 0;
}

/**
 * Adds a new media variant to the database. Returns the variant's id.
 * If `imageStat` is specified, adds a new image stat entry and links it to the variant.
 */

export function addMediaVariant(
	variant: Omit<MediaVariant, 'id'>,
	imageStat?: Omit<MediaImageStat, 'id' | 'vid'>) {

	const variant_id = QUERY_INSERT_MEDIA_VARIANT.run(
		variant.mid, variant.path, variant.size, variant.hash, variant.type, variant.prop).lastInsertRowid;

	if (imageStat) QUERY_INSERT_MEDIA_IMAGE_STAT.run(
		variant_id, imageStat.width, imageStat.height);

	return variant_id;
}

/** Gets a media variant from an id or path. */

export function getMediaVariant(idOrPath: number | string): MediaVariant | null {
	if (typeof idOrPath === 'number') return QUERY_GET_VARIANT_FROM_ID.get(idOrPath);
	return QUERY_GET_VARIANT_FROM_PATH.get(idOrPath);
}

/** Gets the canonical media variant from a media id. */

export function getCanonicalVariant(id: number): MediaVariant | null {
	return QUERY_GET_CANONICAL_VARIANT_FROM_ID.get(id);
}

/** Gets all of the variants of a media variant from a media id. */

export function getMediaVariants(id: number): MediaVariant[] {
	return QUERY_GET_VARIANTS_FROM_MEDIA_ID.all(id);
}

/** Gets the variant image stats from a media variant id. */

export function getImageStat(id: number): MediaImageStat | null {
	return QUERY_GET_IMAGE_STAT_FROM_VARIANT_ID.get(id);
}

/** Check if a media variant at the path specified matches the hash specified. */

export function mediaHashMatches(path: string, hash: string): boolean {
	const variant = QUERY_GET_MEDIA_HASH_FROM_PATH.get(path);
	return variant && variant.hash === hash;
}

/** Retrieves all of the media items, with their canonical variant hash and path. */

export function getAllCanonicalPathHashPairs(): { id: number; hash: string; path: string }[] {
	return QUERY_GET_MEDIA_CANONICAL_PATH_HASH_PAIRS.all();
}

/**
 * Gets an optimized image from the database.
 * Will return the path, hash, and dimensions of the smallest image at least `size` pixels wide and tall.
 * Will return the largest image if no image is at least `size` pixels wide and tall.
 * Will return a data uri if `size` is 'inline', or a full-res optimized image if `size` is 'full'.
 */

export function getOptimizedImage(id: number, size: 'image_inline' | 'image_full' | 'svg_min' | number):
	{ path: string; width: number; height: number; hash: string } | null {

	let variant: MediaVariant;
	if (typeof size === 'string') variant = QUERY_GET_VARIANT_FROM_TYPE_AND_ID.get(id, size);
	else {
		variant = QUERY_GET_SMALLEST_VARIANT_FROM_SIZE_AND_ID.get(id, size);
		if (!variant) variant = QUERY_GET_VARIANT_FROM_TYPE_AND_ID.get(id, 'image_full');
	}

	if (!variant) return null;
	const stat = QUERY_GET_IMAGE_STAT_FROM_VARIANT_ID.get(variant.id);
	return { path: variant.path, hash: variant.hash, width: stat?.width, height: stat?.height };
}
