import as from 'auriserve';
import { titleCase } from 'common';

import User from './User';
import Role from './Role';
import {
	Permission,
	PermissionArgument,
	PermissionCategory,
	PermissionCategoryArgument,
	PermissionCategoryPriority,
} from './Permission';

export * from './API';

const { log: Log } = as.core;

as.users = {
	roles: new Map(),
	permissions: new Map(),
	permissionCategories: new Map(),

	createUser(user: User): boolean {
		Log.info('WIP Created user: %s', user);
		return true;
	},

	deleteUser(identifier: string): boolean {
		Log.info('WIP Deleted user: %s', identifier);
		return true;
	},

	addPermissionCategory(permissionCategory: PermissionCategoryArgument): boolean {
		if (as.users.permissionCategories.has(permissionCategory.identifier)) return false;

		permissionCategory.name ??= titleCase(permissionCategory.identifier);
		permissionCategory.icon ??= 'default';
		permissionCategory.priority ??= PermissionCategoryPriority.NORMAL;

		as.users.permissionCategories.set(
			permissionCategory.identifier,
			permissionCategory as PermissionCategory
		);
		Log.info('Added permission category: %s', permissionCategory);
		return true;
	},

	removePermissionCategory(identifier: string): boolean {
		Log.info('Removed permission category: %s', identifier);
		return as.users.permissionCategories.delete(identifier);
	},

	addPermission(permission: PermissionArgument): boolean {
		if (as.users.permissions.has(permission.identifier)) return false;

		permission.name ??= titleCase(permission.identifier);
		permission.category ??= 'default';
		permission.default ??= false;

		as.users.permissions.set(permission.identifier, permission as Permission);
		Log.info('Added permission: %s', permission);
		return true;
	},

	removePermission(identifier: string): boolean {
		Log.info('Removed permission: %s', identifier);
		return as.users.permissions.delete(identifier);
	},

	addRole(role: Role): boolean {
		Log.info('WIP Added role: %s', role);
		return true;
	},

	removeRole(identifier: string): boolean {
		Log.info('Removed role: %s', identifier);
		return as.users.roles.delete(identifier);
	},
};

as.users.addPermissionCategory({
	identifier: 'default',
});

as.users.addPermissionCategory({
	identifier: 'administration',
	icon: 'security',
	priority: PermissionCategoryPriority.MAX,
});

as.users.addPermission({
	identifier: 'administrator',
	description: 'Bypass permissions and role heirarchy. Use with caution.',
	category: 'administration',
});

as.core.once('cleanup', () => as.unexport('users'));
