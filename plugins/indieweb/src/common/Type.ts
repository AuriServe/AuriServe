import type { DatabasePost } from '../server/Database';

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

/** A post's visibility. */
export enum Visibility {
	Private = 0,
	Unlisted = 1,
	Public = 2
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
