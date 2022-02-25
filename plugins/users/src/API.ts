import Role from './Role';
import User, { Token } from './User';
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

	createUser(
		identifier: string,
		name: string,
		email: string,
		password: string
	): Promise<void>;
	deleteUser(identifier: string): boolean;

	hashPassword(password: string): Promise<string>;
	checkPassword(hash: string, password: string): Promise<boolean>;

	getAuthToken(email: string, password: string): Promise<Token>;
	userIDFromToken(token: Token): Promise<string>;

	getUser(token: string): User;
	getRolePermissions(roles: string[]): Set<string>;

	addPermissionCategory(permissionCategory: PermissionCategoryArgument): void;
	removePermissionCategory(identifier: string): boolean;

	addPermission(permission: PermissionArgument): void;
	removePermission(identifier: string): boolean;

	addRole(role: Role): void;
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
