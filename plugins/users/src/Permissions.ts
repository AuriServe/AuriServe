import auriserve from 'auriserve';
import { assert, titleCase } from 'common';

import { Token } from './Users';
import { roles } from './Roles';

const { database } = auriserve;

export interface Permission {
	identifier: string;
	name: string;
	description?: string;
	requires: string[];
	category: string;

	default: boolean;
}

export enum PermissionCategoryPriority {
	MIN = 1,
	LOW = 2,
	NORMAL = 3,
	HIGH = 4,
	MAX = 5,
}

export interface PermissionCategory {
	identifier: string;
	name: string;
	description?: string;
	icon: string;
	priority: PermissionCategoryPriority;
}

export type PermissionCategoryArgument = Omit<
	PermissionCategory,
	'name' | 'icon' | 'priority'
> & Partial<PermissionCategory>;

export type PermissionArgument = Omit<
	Permission,
	'name' | 'category' | 'default' | 'requires'
> & Partial<Permission>;

export const permissions: Map<string, Permission> = new Map();

export const permissionCategories: Map<string, PermissionCategory> = new Map();

export function addPermission(permission: PermissionArgument) {
	permission.name ??= titleCase(permission.identifier);
	permission.category ??= 'default';
	permission.default ??= false;
	permission.requires ??= [];

	assert(
		!permissions.has(permission.identifier),
		`Permission '${permission.identifier}' already exists.`
	);

	assert(
		permissionCategories.has(permission.category),
		`Permission category '${permission.category}' does not exist.`
	);

	permissions.set(permission.identifier, permission as Permission);
}

export function removePermission(identifier: string): boolean {
	return permissions.delete(identifier);
}

export function addPermissionCategory(permissionCategory: PermissionCategoryArgument) {
	assert(
		!permissionCategories.has(permissionCategory.identifier),
		`Permission category '${permissionCategory.identifier}' already exists.`
	);

	permissionCategory.name ??= titleCase(permissionCategory.identifier);
	permissionCategory.icon ??= 'default';
	permissionCategory.priority ??= PermissionCategoryPriority.NORMAL;

	permissionCategories.set(
		permissionCategory.identifier,
		permissionCategory as PermissionCategory
	);
}

export function removePermissionCategory(identifier: string): boolean {
	return permissionCategories.delete(identifier);
}

export function getRolePermissions(checkRoles: string[]): Set<string> {
	return roles
		.filter((role) => checkRoles.includes(role.identifier))
		.reduce<Set<string>>((acc, role) => {
			for (const permission of role.permissions) acc.add(permission);
			return acc;
		}, new Set());
}

export function getUserPermissions(token: Token): Set<string> {
	const userID = database
		.prepare('SELECT user FROM userTokens WHERE token = ?')
		.get(token)?.user;

	assert(userID, 'Invalid token.');

	const roles: string[] = database
		.prepare(`SELECT role FROM userRoles WHERE user = ?`)
		.all(userID)
		.map((r) => r.role);

	return getRolePermissions(roles);
}

addPermissionCategory({
	identifier: 'default',
});

addPermissionCategory({
	identifier: 'administration',
	icon: 'role',
	priority: PermissionCategoryPriority.MAX,
});

addPermission({
	identifier: 'administrator',
	description: 'Bypass permissions and role heirarchy. Use with caution.',
	category: 'administration',
});
