import type { DatabasePost } from '../server/Database';

export type Post<T extends Record<string, any> = Record<string, any>> = Omit<DatabasePost, 'data'> & {
	data: T;
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

/** The type definition for a blog post revision, which are owned by blog posts. */
export interface BlogPostRevision {
	/** The revision's tag. */
	tag?: string;

	/** The date this revision was created. */
	created: number;

	/** The post's title. */
	title: string;

	/** The post's content, used in the editor. NOT to be directly written to a client-facing page. */
	content: string;

	/** The post's plaintext description, for search engines and embeds. */
	description: string;

	/** The media id for the banner image, if there is one. */
	banner?: number;

	/** The alignment of the banner image. */
	bannerAlign?: [ number, number ];

	/** Whether or not to show the banner in the post page. */
	showBanner?: boolean;

	/**
	 * The post preview to be used on-site. HTML, but only inline formatting. No headers or images.
	 * May be the beginning of the article, or it may be manually written.
	 */
	preview: string;

	/** A reference to *all* media items that are used in this revision, for usage-tracking. */
	media: number[];
}

/** The type definition for a blog post, which contains one or more `BlogPostRevision`s. */
export interface BlogPost {
	/** The post's navigation tree. */
	navigation: { anchor: string; title: string; level: string; }[];

	/** The post's main content, converted to client-side HTML. May be inserted into client-facing pages. */
	html: string;

	/** A list of post revisions ordered chronologically. Oldest first. */
	revisions: BlogPostRevision[];

	/** The current revision of the post which is being used. */
	currentRevision: number;

	/** A reference to *all* media items that are used, for usage-tracking. */
	media: number[];
}
