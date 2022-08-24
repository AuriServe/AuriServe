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
