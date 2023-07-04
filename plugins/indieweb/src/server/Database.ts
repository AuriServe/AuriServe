import path from 'path';
import { database } from 'auriserve';

const POSTS_TBL = 'indieweb_posts';
const ENGAGEMENTS_TBL = 'indieweb_engagements';
const TAGS_TBL = 'indieweb_post_tags';
const MEDIA_TBL = 'indieweb_post_media';
const COMMENTS_TBL = 'indieweb_post_comments';

/** A database post. */
export interface DatabasePost {
	id: number;
	type: string;
	created: number;
	modified: number;
	data: string;
}

export type Post = Omit<DatabasePost, 'data'> & {
	data: Record<string, any>;
	media: number[];
	tags: string[];
}

/** A used media item in a post. */
export interface Media {
	id: number;
	post: number;
	media: number;
}

/** Tags for a post. */
export interface Tag {
	id: number;
	post: number;
	tag: string;
}

/** An engagement (like, share, comment, etc) on a post. */
export interface Engagement {
	id: number;
	post: number;
	type: 'like' | 'share' | 'comment';
	date: number;
}

/** A comment on a post. */
export interface Comment {
	id: number;
	engagement: number;
	content: string;
}

export function init() {
	/**
	 * Clean-up databases, for testing.
	 */

	database.prepare(`DROP TABLE IF EXISTS ${POSTS_TBL}`).run();
	database.prepare(`DROP TABLE IF EXISTS ${ENGAGEMENTS_TBL}`).run();
	database.prepare(`DROP TABLE IF EXISTS ${TAGS_TBL}`).run();
	database.prepare(`DROP TABLE IF EXISTS ${MEDIA_TBL}`).run();
	database.prepare(`DROP TABLE IF EXISTS ${COMMENTS_TBL}`).run();


	/**
	 * Holds the base information for posts. All posts include a created date, modified date (which defaults to
	 * the creation date), type (which is used by renderers), and JSON data. Posts can also have tags and media,
	 * which are stored in their own tables. Engagements will also reference post ids.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${POSTS_TBL} (
			id INTEGER PRIMARY KEY,
			type TEXT NOT NULL,
			created INTEGER NOT NULL,
			modified INTEGER NOT NULL,
			data TEXT NOT NULL
		) STRICT`
	).run();

	/**
	 * Holds references to media items for posts. If a post uses a media item,
	 * it must have an entry for it in this table, for usage tracking.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${MEDIA_TBL} (
			id INTEGER PRIMARY KEY,
			post INTEGER NOT NULL REFERENCES ${POSTS_TBL}(id) ON DELETE CASCADE,
			media INTEGER NOT NULL,
			${/*media INTEGER NOT NULL REFERENCES media_media(id) ON DELETE CASCADE,*/''}
			UNIQUE (post, media)
		) STRICT`
	).run();

	/**
	 * Contains all of the tags for all of the posts. A post cannot have multiple of the same tag.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${TAGS_TBL} (
			id INTEGER PRIMARY KEY,
			post INTEGER NOT NULL REFERENCES ${POSTS_TBL}(id) ON DELETE CASCADE,
			tag TEXT NOT NULL,
			UNIQUE (post, tag)
		) STRICT`
	).run();

	database.prepare(`CREATE INDEX IF NOT EXISTS indieweb_tags_index ON ${TAGS_TBL}(tag)`).run();
}

init();

const QUERY_INSERT_POST = database.prepare(
	`INSERT INTO ${POSTS_TBL} (type, created, modified, data) VALUES (?, ?, ?, ?)`);
const QUERY_INSERT_POST_MEDIA = database.prepare(
	`INSERT INTO ${MEDIA_TBL} (post, media) VALUES (?, ?)`);
const QUERY_INSERT_POST_TAG = database.prepare(
	`INSERT INTO ${TAGS_TBL} (post, tag) VALUES (?, ?)`);
const QUERY_INSERT_POST_MEDIA_ARRAY = database.transaction((post: number, media: number[]) =>
	media.forEach(m => QUERY_INSERT_POST_MEDIA.run(post, m)));
const QUERY_INSERT_POST_TAG_ARRAY = database.transaction((post: number, tags: string[]) =>
	tags.forEach(t => QUERY_INSERT_POST_TAG.run(post, t)));
export const QUERY_GET_POST_FROM_ID = database.prepare(`
	SELECT posts.*,
		(SELECT GROUP_CONCAT(tag,'|') AS tags FROM ${TAGS_TBL} WHERE post = posts.id) AS tags,
		(SELECT GROUP_CONCAT(media,'|') AS media FROM ${MEDIA_TBL} WHERE post = posts.id) AS media
	FROM ${POSTS_TBL} AS posts WHERE id = ?
`);
export const QUERY_GET_POST_FROM_DATE_RANGE = database.prepare(`
	SELECT posts.*,
		(SELECT GROUP_CONCAT(tag,'|') AS tags FROM ${TAGS_TBL} WHERE post = posts.id) AS tags,
		(SELECT GROUP_CONCAT(media,'|') AS media FROM ${MEDIA_TBL} WHERE post = posts.id) AS media
	FROM ${POSTS_TBL} AS posts WHERE created >= ? AND created <= ? ORDER BY posts.created
`);

export function addPost(post: Omit<Post, 'id' | 'tags' | 'media'> & { tags?: string[], media?: number[] }) {
	const id = QUERY_INSERT_POST.run(post.type, post.created, post.modified, JSON.stringify(post.data))
		.lastInsertRowid as number;
	if (post.tags?.length) QUERY_INSERT_POST_TAG_ARRAY(id, post.tags);
	if (post.media?.length) QUERY_INSERT_POST_MEDIA_ARRAY(id, post.media);
	return id;
}

function populatePost(post: (DatabasePost & { tags: string, media: string })): Post;
function populatePost(post: null): null;
function populatePost(post: (DatabasePost & { tags: string, media: string }) | null): Post | null {
	if (!post) return null;
	return {
		...post,
		data: JSON.parse(post.data),
		tags: post.tags?.split('|') ?? [],
		media: post.media?.split('|').map(m => Number.parseInt(m, 10)) ?? []
	};
}

export function getPost(id: number): Post | null {
	return populatePost(QUERY_GET_POST_FROM_ID.get(id));
}

export function getPostsInDateRange(start: number, end: number): Post[] {
	return (QUERY_GET_POST_FROM_DATE_RANGE.all(start, end) as (DatabasePost & { tags: string, media: string })[])
		.map((post) => populatePost(post));
}

// export function getPostsInDateRange(start: number, end: number): Post[] {
// 	// const posts = database.prepare(
// 	// 	`SELECT * FROM ${POSTS_TBL} WHERE created >= ? AND created <= ? ORDER BY created DESC`
// 	// ).all(start, end) as Post[];
// 	// return posts.map(p => ({
// 	// 	...p,
// 	// 	data: JSON.parse(p.data)
// 	// }));
// }


// /** Gets a media item from an id or path. */

// export function getMedia(idOrPath: number | string): Media | null {
// 	if (typeof idOrPath === 'string') {
// 		const { mid } = QUERY_GET_VARIANT_FROM_PATH.get(idOrPath) ?? {};
// 		if (!mid) return null;
// 		idOrPath = mid;
// 	}

// 	return QUERY_GET_MEDIA_FROM_ID.get(idOrPath);
// }

// /**
//  * Adds a new media item to the database. If `media.id` is specified, the media item with that id will be replaced.
//  * Also adds a canonical variant based on the specified information. Deletes all other variants if replacing.
//  * Returns the media item's id.
//  */

// export function addMedia(
// 	media: Omit<Media, 'canonical' | 'id'> & { id?: number },
// 	variant: Omit<MediaVariant, 'id' | 'mid' | 'type' | 'prop'>,
// 	imageStat?: Omit<MediaImageStat, 'id' | 'vid'>) {

// 	let media_id: number;
// 	if ('id' in media) media_id = QUERY_INSERT_OR_REPLACE_MEDIA.run(
// 		media.name, media.description, media.type, media.id).lastInsertRowid as number;
// 	else media_id = QUERY_INSERT_MEDIA.run(
// 		media.name, media.description, media.type).lastInsertRowid as number;

// 	QUERY_DELETE_MEDIA_VARIANTS_FROM_ID.run(media_id);

// 	const variant_id = addMediaVariant({ ...variant, mid: media_id, type: 'original', prop: 0 }, imageStat);

// 	QUERY_SET_MEDIA_CANONICAL_VARIANT.run(variant_id, media_id);

// 	return media_id;
// }
