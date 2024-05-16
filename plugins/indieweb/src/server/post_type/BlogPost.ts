import zod from 'zod'
import { ensure } from 'auriserve';
import sanitizeHtml from 'sanitize-html';

import { ServerPostType } from '../PostRegistry';
import { BlogPost, BlogPostRevision } from '../../common/Type';

/**
 * The Zod schema for a blog post revision.
 */

export const BlogPostRevisionSchema = zod.object({
	tag: zod.string().optional(),
	created: zod.number(),
	title: zod.string(),
	content: zod.string(),
	description: zod.string(),
	banner: zod.number().optional(),
	bannerAlign: zod.tuple([ zod.number(), zod.number() ]).optional(),
	showBanner: zod.boolean().optional(),
	preview: zod.string(),
	media: zod.array(zod.number())
});

/**
 * The Zod schema for a blog post.
 */

export const BlogPostSchema = zod.object({
	navigation: zod.array(zod.object({
		anchor: zod.string(),
		title: zod.string(),
		level: zod.string()
	})),
	html: zod.string(),
	revisions: zod.array(BlogPostRevisionSchema),
	currentRevision: zod.number(),
	media: zod.array(zod.number())
});

/**
 * The Zod schema for a blog post's update object,
 * which is sent by the client when a blog post is modified.
 */

export const BlogPostUpdateSchema = zod.array(zod.union([
	zod.object({
		type: zod.literal('modify_revision'),

		revisionInd: zod.number(),
		currentRevision: zod.optional(zod.number()),
		revision: zod.string()
	}), zod.object({
		type: zod.literal('remove_revision'),

		removeRevision: zod.number(),
		currentRevision: zod.number(),
	})
]));

/**
 * Creates a blank blog post revision.
 */

function createRevision(): BlogPostRevision {
	return {
		content: '',
		created: 0,
		description: '',
		media: [],
		preview: '',
		title: '',
		banner: undefined,
		bannerAlign: undefined,
		showBanner: undefined,
	};
}

/** Sanitizes the HTML of a revision's fields. */

function parseRevisionHTML(revision: BlogPostRevision) {

	// Sanitize editor content.

	revision.content = sanitizeHtml(revision.content, {
		allowedTags: [
			'address', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup', 'section', 'blockquote', 'dd', 'div',
			'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'ol', 'p', 'pre', 'ul', 'a', 'abbr', 'b', 'bdi', 'bdo',
			'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby',
			's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'caption',
			'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'img'
		],
		allowedAttributes: {
			a: [ 'href', 'name', 'target' ],
			img: [ 'src', 'alt' ],
			'*': [ 'class', 'id' ],
		},
		allowProtocolRelative: false,
	});

	// Sanitize the description.
	const maxDescriptionLength = 500;
	if (!revision.description) revision.description = revision.content.slice(0,
		revision.content.length < maxDescriptionLength ? revision.content.length :
		revision.content.slice(0, maxDescriptionLength).lastIndexOf(' '));
	revision.description = sanitizeHtml(revision.description, {
		allowedTags: [
			'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'li', 'ol', 'p', 'pre', 'ul', 'abbr', 'b', 'bdi', 'bdo',
			'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span',
			'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'caption'
		],
		allowedAttributes: {}
	});

	// Sanitize the preview.
	const maxPreviewLength = 500;
	if (!revision.preview) revision.preview = revision.content.slice(0, revision.content.length < maxPreviewLength
		? revision.content.length : revision.content.slice(0, maxPreviewLength).lastIndexOf(' '));
	revision.preview = sanitizeHtml(revision.preview, {
		allowedTags: [],
		allowedAttributes: {},
	});
}

function updatePostCurrentRevision(data: BlogPost, revisionInd: number) {
	const revision = data.revisions[revisionInd];

	// This might be a no-op most of the time but it's good not to forget.
	data.currentRevision = revisionInd;

	// Currently a no-op. This will be used for filtering elements or whatever.
	data.html = sanitizeHtml(revision.content, {
		allowedTags: false,
		allowedAttributes: false,
	});
}

export const TYPE: ServerPostType = {
	type: 'blog',

	/**
	 * Creates a blank blog post.
	 */

	onCreate: (): BlogPost => ({
		navigation: [],
		html: '',
		revisions: [ createRevision() ],
		currentRevision: 0,
		media: []
	}),

	/**
	 * Big updater function for blog posts.
	 * Takes a series of updates matching the `BlogPostUpdateSchema` and applies them to the post.
	 * Known update types are `modify_revision`, which updates the content of a revision, and the current revision,
	 * and `remove_revision`, which removes a revision and updates the current revision.
	 */

	onUpdate: (currentData, update): BlogPost => {
		const data = currentData as BlogPost;
		const updates = BlogPostUpdateSchema.parse(update);

		for (const update of updates) {
			switch (update.type) {
			case 'modify_revision': {
				const { revisionInd, revision: revisionJSON, currentRevision } = update;
				ensure(revisionInd <= data.revisions.length + 1, 'Revision index out of bounds.');

				const isNewRevision = revisionInd >= data.revisions.length;
				if (isNewRevision) data.revisions.push({} as any); // Doesn't matter what this is, it gets overwritten.

				ensure(!currentRevision || currentRevision < data.revisions.length, 'Current revision out of bounds.');
				if (currentRevision !== undefined) data.currentRevision = currentRevision;

				// Get the revision and sanitize its contents.

				const revision = BlogPostRevisionSchema.parse(JSON.parse(revisionJSON));
				data.revisions[revisionInd] = revision;
				parseRevisionHTML(revision);

				// Update the media list.
				const mediaSet = new Set<number>();
				data.revisions.forEach(r => r.media.forEach(m => mediaSet.add(m)));
				data.media = Array.from(mediaSet);

				// If this is the current revision, update the post's HTML.
				if (revisionInd === data.currentRevision) updatePostCurrentRevision(data, revisionInd);

				break;
			}
			case 'remove_revision': {
				const { removeRevision, currentRevision } = update;
				let needRecalculateHTML = removeRevision === data.currentRevision || currentRevision !== data.currentRevision;
				ensure(removeRevision < data.revisions.length, 'Revision index out of bounds.');
				ensure(currentRevision < data.revisions.length, 'Current revision out of bounds.');

				data.currentRevision = currentRevision;
				if (data.currentRevision > removeRevision) data.currentRevision--;
				data.revisions.splice(removeRevision, 1);

				if (needRecalculateHTML) updatePostCurrentRevision(data, data.currentRevision);

				break;
			}
			}
		}

		return data;
	}
}

export default TYPE;
