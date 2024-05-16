import auriserve, { log } from 'auriserve';
import { extendGQLSchema, gqlResolver } from 'dashboard';

import * as Database from './Database';

import * as PostRegistry from './PostRegistry';
import BlogPostType from './post_type/BlogPost';

import * as Elements from '../page';
import { addElement, removeElement } from 'elements';
import updatePost from './UpdatePost';

// Add the indieweb elements to the event registry.

Object.values(Elements).forEach((elem) => addElement(elem));
auriserve.once('cleanup', () => {
	Object.values(Elements).forEach((elem) => removeElement(elem.identifier));
	// removeStylesheet(styles);
});

// Extend the GraphQL schema to have post endpoints.

extendGQLSchema(`
	type IndieWebPost {
		id: Int!
		slug: String!
		type: String!
		created: Int!
		modified: Int!
		visibility: Int!
		data: String!
		media: [Int!]!
		tags: [String!]!
	}

	type IndieWebQueryAPI {
		posts: [IndieWebPost!]!
		postBySlug(slug: String!): IndieWebPost
		postById(id: Int!): IndieWebPost
	}

	type IndieWebMutationAPI {
		update_post(id: Int!, update: [String!]): String!
		create_post(type: String!, payload: String!): String!
	}

	extend type Query { indieweb: IndieWebQueryAPI! }
	extend type Mutation { indieweb: IndieWebMutationAPI! }
`);

// Implement the GraphQL extensions.

gqlResolver.indieweb = {
	posts: () => {
		const posts = Database.getPosts();
		return posts.map((post) => ({
			...post,
			data: JSON.stringify(post.data),
		}));
	},
	postBySlug: (ctx: any) => {
		const post = Database.getPost(ctx.slug);
		if (!post) return null;
		return { ...post, data: JSON.stringify(post.data) };
	},
	postById: (ctx: any) => {
		const post = Database.getPost(ctx.id);
		if (!post) return null;
		return { ...post, data: JSON.stringify(post.data) };
	},

	// Either get a post, or mutate it, depending on the presence of `ctx.data`.
	update_post: (ctx: any) => {
		return '';
		// console.log('HAS DATA?', !!ctx.data)
		// if (!ctx.data) {
		// 	const post = Database.getPost(ctx.id);
		// 	if (!post) return false;
		// 	return post;
		// }
		// else {
		// 	console.log('UPDATING POST');
		// 	return updatePost(ctx.id, ctx.data);
		// }
	},

	create_post: (ctx: any) => {
		const type = ctx.type;
		console.log('create');
		return '';
	}
}

// Add the default post types to the post registry.

PostRegistry.register(BlogPostType);
