import as from 'auriserve';
const { addPermission, addPermissionCategory } = as.users;

addPermission({
	identifier: 'view_audit_log',
	description: 'See audit logs for activities the user has permission to perform.',
	category: 'administration',
});

addPermission({
	identifier: 'view_permissions',
	description: 'View user and role permissions.',
	category: 'administration',
});

addPermission({
	identifier: 'manage_permissions',
	description: 'Add, remove, and edit user and role permissions.',
	// requires: ['view_permissions'],
	category: 'administration',
});

addPermissionCategory({
	identifier: 'plugins',
	icon: 'plugin',
});

addPermission({
	identifier: 'view_plugins',
	category: 'plugins',
});

addPermission({
	identifier: 'toggle_plugins',
	// requires: ['view-plugins'],
	category: 'plugins',
});

addPermission({
	identifier: 'manage_plugins',
	description: 'Install and uninstall plugins.',
	// requires: ['view-plugins', 'toggle-plugins'],
	category: 'plugins',
});

addPermissionCategory({
	identifier: 'users',
	icon: 'users',
});

addPermission({
	identifier: 'view_users',
	category: 'users',
});

addPermission({
	identifier: 'manage_users',
	description: 'Add, remove, and manage users with lower roles.',
	// requires: ['view-users'],
	category: 'users',
});

addPermission({
	identifier: 'reset_passwords',
	description: 'Reset the passwords of users with lower roles.',
	// requires: ['view-users'],
	category: 'users',
});
