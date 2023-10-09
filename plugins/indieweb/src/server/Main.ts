import path from 'path';
import auriserve from 'auriserve';
import { extendGQLSchema, gqlResolver } from 'dashboard';
import { addElement, removeElement, addStylesheet, removeStylesheet } from 'elements';
import * as Database from './Database';

import * as Elements from '../page';

import '../Style.pcss';
const styles = path.join(__dirname, 'style.css');
addStylesheet(styles);

Object.values(Elements).forEach((elem) => addElement(elem));
auriserve.once('cleanup', () => {
	Object.values(Elements).forEach((elem) => removeElement(elem.identifier));
	removeStylesheet(styles);
});

extendGQLSchema(`
	type IndiewebPost {
		id: Int!
		slug: String!
		type: String!
		created: Int!
		modified: Int!
		data: String!
		media: [Int!]!
		tags: [String!]!
	}

	type IndiewebQueryAPI {
		posts: [IndiewebPost!]!
	}

	type IndiewebMutationAPI {
		_nothing: Boolean
	}

	extend type Query { indieweb: IndiewebQueryAPI! }
	extend type Mutation { indieweb: IndiewebMutationAPI! }

`);

gqlResolver.indieweb = {
	posts: () => {
		const posts = Database.getPosts();
		return posts.map((post) => ({
			...post,
			data: JSON.stringify(post.data),
		}));
	}
}
