import Role from './Role';
import User from './User';
import {
	Permission,
	PermissionArgument,
	PermissionCategory,
	PermissionCategoryArgument,
} from './Permission';

export default interface API {
	roles: Map<string, Role>;
	permissionCategories: Map<string, PermissionCategory>;
	permissions: Map<string, Permission>;

	createUser(user: User): boolean;
	deleteUser(identifier: string): boolean;

	addPermissionCategory(permissionCategory: PermissionCategoryArgument): boolean;
	removePermissionCategory(identifier: string): boolean;

	addPermission(permission: PermissionArgument): boolean;
	removePermission(identifier: string): boolean;

	addRole(role: Role): boolean;
	removeRole(identifier: string): boolean;
}

declare global {
	export interface AuriServeAPI {
		users: API;
	}
}

export type { default as Role } from './Role';
export type { default as User } from './User';
export type {
	Permission,
	PermissionArgument,
	PermissionCategory,
	PermissionCategoryArgument,
} from './Permission';
