// import auriserve from 'auriserve';
// import { promises as fs } from 'fs';
// import { stylesheets } from 'elements';
import { getPage, registeredLayouts } from 'pages';
import { extendGQLSchema, gqlResolver } from 'dashboard';
import { addPermission, addPermissionCategory } from 'users';

addPermissionCategory({
	identifier: 'pages',
	icon: 'file',
});

addPermission({
	identifier: 'view-pages',
	category: 'pages',
});

addPermission({
	identifier: 'edit-pages',
	requires: ['view-pages'],
	category: 'pages',
});

addPermission({
	identifier: 'manage-pages',
	description: 'Add, remove, and reorganize pages.',
	requires: ['view-pages', 'edit-pages'],
	category: 'pages',
});

extendGQLSchema(`
	type Page {
		path: String!
		title: String
		description: String
		index: Boolean!
		layout: String!

		serialized: String!
	}

	extend type Query {
		page(path: String!): Page

		layout(identifier: String!): String
	}
`);

gqlResolver.page = ({ path }: { path: string }) => {
	const page = getPage(path);
	if (!page) return null;

	return {
		path,
		title: page.metadata.title,
		description: page.metadata.description,
		index: page.metadata.index ?? true,
		layout: page.content.layout ?? 'default',
		serialized: JSON.stringify(page)
	};
}

gqlResolver.layout = ({ identifier }: { identifier: string }) => {
	return registeredLayouts.get(identifier) ?? null;
}

// const route = auriserve.router.get('/dashboard/res/elements.css', async (_, res) => {
// 	res.send((await Promise.all([...stylesheets.values()].map((style) => fs.readFile(style)))).join('\n'));
// });
//
// auriserve.once('cleanup', () => auriserve.router.remove(route));
