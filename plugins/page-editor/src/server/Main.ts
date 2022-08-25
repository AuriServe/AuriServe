// import auriserve from 'auriserve';
// import { promises as fs } from 'fs';
// import { stylesheets } from 'elements';
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

// const route = auriserve.router.get('/dashboard/res/elements.css', async (_, res) => {
// 	res.send((await Promise.all([...stylesheets.values()].map((style) => fs.readFile(style)))).join('\n'));
// });
//
// auriserve.once('cleanup', () => auriserve.router.remove(route));
