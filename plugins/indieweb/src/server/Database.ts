import { database } from 'auriserve';
import { Visibility, Post } from '../common/Type';

const POSTS_TBL = 'indieweb_posts';
const ENGAGEMENTS_TBL = 'indieweb_engagements';
const TAGS_TBL = 'indieweb_post_tags';
const MEDIA_TBL = 'indieweb_post_media';
const COMMENTS_TBL = 'indieweb_post_comments';

/** A database post. */
export interface DatabasePost {
	id: number;
	slug: string;
	type: string;
	created: number;
	modified: number;
	visibility: Visibility;
	data: string;
}

export function init() {
	/**
	 * Clean-up databases, for testing.
	 */

	// database.prepare(`DROP TABLE IF EXISTS ${POSTS_TBL}`).run();
	// database.prepare(`DROP TABLE IF EXISTS ${ENGAGEMENTS_TBL}`).run();
	// database.prepare(`DROP TABLE IF EXISTS ${TAGS_TBL}`).run();
	// database.prepare(`DROP TABLE IF EXISTS ${MEDIA_TBL}`).run();
	// database.prepare(`DROP TABLE IF EXISTS ${COMMENTS_TBL}`).run();


	/**
	 * Holds the base information for posts. All posts include a created date, modified date (which defaults to
	 * the creation date), type (which is used by renderers), and JSON data. Posts can also have tags and media,
	 * which are stored in their own tables. Engagements will also reference post ids.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${POSTS_TBL} (
			id INTEGER PRIMARY KEY,
			slug TEXT UNIQUE NOT NULL,
			type TEXT NOT NULL,
			created INTEGER NOT NULL,
			modified INTEGER NOT NULL,
			visibility INTEGER NOT NULL DEFAULT ${Visibility.Public},
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
export const QUERY_GET_POST_FROM_SLUG = database.prepare(`
	SELECT posts.*,
		(SELECT GROUP_CONCAT(tag,'|') AS tags FROM ${TAGS_TBL} WHERE post = posts.id) AS tags,
		(SELECT GROUP_CONCAT(media,'|') AS media FROM ${MEDIA_TBL} WHERE post = posts.id) AS media
	FROM ${POSTS_TBL} AS posts WHERE slug = ?
`);
export const QUERY_GET_POSTS_FROM_DATE_RANGE = database.prepare(`
	SELECT posts.*,
		(SELECT GROUP_CONCAT(tag,'|') AS tags FROM ${TAGS_TBL} WHERE post = posts.id) AS tags,
		(SELECT GROUP_CONCAT(media,'|') AS media FROM ${MEDIA_TBL} WHERE post = posts.id) AS media
	FROM ${POSTS_TBL} AS posts WHERE created >= ? AND created <= ? ORDER BY posts.created DESC
`);
export const QUERY_GET_POSTS_OF_TYPE = database.prepare(`
	SELECT posts.*,
		(SELECT GROUP_CONCAT(tag,'|') AS tags FROM ${TAGS_TBL} WHERE post = posts.id) AS tags,
		(SELECT GROUP_CONCAT(media,'|') AS media FROM ${MEDIA_TBL} WHERE post = posts.id) AS media
	FROM ${POSTS_TBL} AS posts WHERE type = ? ORDER BY posts.created DESC LIMIT ?
`)
export const QUERY_GET_POSTS = database.prepare(`
	SELECT posts.*,
		(SELECT GROUP_CONCAT(tag,'|') AS tags FROM ${TAGS_TBL} WHERE post = posts.id) AS tags,
		(SELECT GROUP_CONCAT(media,'|') AS media FROM ${MEDIA_TBL} WHERE post = posts.id) AS media
	FROM ${POSTS_TBL} AS posts ORDER BY posts.created DESC LIMIT ?
`)

type UnionedDBPost = (DatabasePost & { tags: string, media: string });

export function addPost(post: Omit<Post, 'id' | 'tags' | 'media'> & { tags?: string[], media?: number[] }) {
	const id = QUERY_INSERT_POST.run(post.type, post.created, post.modified, JSON.stringify(post.data))
		.lastInsertRowid as number;
	if (post.tags?.length) QUERY_INSERT_POST_TAG_ARRAY(id, post.tags);
	if (post.media?.length) QUERY_INSERT_POST_MEDIA_ARRAY(id, post.media);
	return id;
}

function populatePost(post: UnionedDBPost): Post;
function populatePost(post: null): null;
function populatePost(post: UnionedDBPost | null): Post | null {
	if (!post) return null;
	return {
		...post,
		data: JSON.parse(post.data),
		tags: post.tags?.split('|') ?? [],
		media: post.media?.split('|').map(m => Number.parseInt(m, 10)) ?? []
	};
}

export function getPost(idOrSlug: number | string): Post | null {
	if (typeof idOrSlug === 'string') return populatePost(QUERY_GET_POST_FROM_SLUG.get(idOrSlug));
	return populatePost(QUERY_GET_POST_FROM_ID.get(idOrSlug));
}

export function getPostsInDateRange(start: number, end: number): Post[] {
	return (QUERY_GET_POSTS_FROM_DATE_RANGE.all(start, end) as UnionedDBPost[])
		.map((post) => populatePost(post));
}

export function getPosts(limit?: number, type?: string) {
	if (!type) return (QUERY_GET_POSTS.all(limit ?? 1000000) as UnionedDBPost[])
		.map((post) => populatePost(post));
	return (QUERY_GET_POSTS_OF_TYPE.all(type, limit ?? 1000000) as UnionedDBPost[])
		.map((post) => populatePost(post));
}
