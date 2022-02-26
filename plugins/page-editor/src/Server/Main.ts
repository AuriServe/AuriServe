import as from 'auriserve';

as.users.addPermissionCategory({
	identifier: 'pages',
	icon: 'file',
});

as.users.addPermission({
	identifier: 'view-pages',
	category: 'pages',
});

as.users.addPermission({
	identifier: 'edit-pages',
	requires: ['view-pages'],
	category: 'pages',
});

as.users.addPermission({
	identifier: 'manage-pages',
	description: 'Add, remove, and reorganize pages.',
	requires: ['view-pages', 'edit-pages'],
	category: 'pages',
});
