import * as zod from 'zod';

import * as Database from './Database';
import * as PostRegistry from './PostRegistry';
import { assert } from 'common';
import { Post, Visibility } from '../common/Type';
import { log } from 'auriserve';

/** A post update. */
export interface PostUpdate {
	type: string;
	[key: string]: any;
}

/** A post update to create a post. */
// export interface PostCreateUpdate extends PostUpdate {
// 	type: 'create';

// 	postType: string;
// 	slug: string;
// 	created: number;
// 	modified: number;
// 	tags?: string[];
// 	visibility: Visibility;
// }

/** A post update to modify the post's metadata. */
export interface PostMetadataUpdate extends PostUpdate {
	type: 'metadata';

	tags?: string[];
	slug?: string;
}

export default function updatePost(id: number, rawUpdates: string[]): boolean {

	console.log('updating post');
	try {
		let post: Post = Database.getPost(id)!;
		let updates = zod.array(zod.record(zod.string(), zod.any())).parse(rawUpdates);

		// If the post doesn't exist, error out or create one, if necessary.

		assert(post, 'Post does not exist.');
		// if (!post) {
		// 	assert
		// 	assert(updates[0]?.type === 'create', 'Post does not exist, and the first update was not a \'create\' update.');

		// 	const createData = zod.object({ postType: zod.string(), slug: zod.string().min(3), created: zod.number(),
		// 		modified: zod.number(), tags: zod.array(zod.string()).min(1).optional(),
		// 		visibility: zod.number().min(0).max(2) })
		// 		.parse(updates[0].data);

		// 	const postType = PostRegistry.get(createData.postType);
		// 	assert(postType, `Post type '${createData.postType}' does not exist.`);

		// 	Database.addPost({
		// 		created: createData.created,
		// 		modified: createData.modified,
		// 		slug: createData.slug,
		// 		data: postType.onCreate(),
		// 		type: createData.postType,
		// 		visibility: createData.visibility,
		// 		tags: createData.tags
		// 	});

		// 	post = Database.getPost(id)!;
		// }
		// assert(post, 'Created the post, but it still doesn\'t exist.');

		// Handle any general updates.

		updates = updates.filter(update => {
			switch(update.type) {
				default:
					return true;
				case 'metadata': {
					const metadataUpdate = zod.object({
						tags: zod.array(zod.string()).min(1).optional(),
						slug: zod.string().min(3).optional()
					}).parse(update.data);

					if (metadataUpdate.tags) post.tags = metadataUpdate.tags;
					if (metadataUpdate.slug) post.slug = metadataUpdate.slug;
					return false;
				}
			}
		});

		// Handle post type-specific updates.

		const postType = PostRegistry.get(post.type);
		assert(postType, `Post type '${post.type}' does not exist.`);
		post.data = postType.onUpdate(post.data, updates);

		// Update the post, return positive.

		Database.updatePost(post);
		return true;
	}
	catch (e) {
		log.warn(e as any);
		return false;
	}
}
