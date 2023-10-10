import path from 'path';
import auriserve from 'auriserve';
import { extendGQLSchema, gqlResolver } from 'dashboard';
import { addElement, removeElement, addStylesheet, removeStylesheet } from 'elements';
import * as Database from './Database';

import * as Elements from '../page';

// import './Style.pcss';
// const styles = path.join(__dirname, 'style.css');
// addStylesheet(styles);

Object.values(Elements).forEach((elem) => addElement(elem));
auriserve.once('cleanup', () => {
	Object.values(Elements).forEach((elem) => removeElement(elem.identifier));
	// removeStylesheet(styles);
});

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
		_nothing: Boolean
	}

	extend type Query { indieweb: IndieWebQueryAPI! }
	extend type Mutation { indieweb: IndieWebMutationAPI! }

`);

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
	}
}
