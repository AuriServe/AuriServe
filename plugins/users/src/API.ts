import Role from './Role';
import User, { Token } from './User';
import {
	Permission,
	PermissionArgument,
	PermissionCategory,
	PermissionCategoryArgument,
} from './Permission';

export default interface API {
	roles: Role[];
	permissions: Map<string, Permission>;
	permissionCategories: Map<string, PermissionCategory>;

	/**
	 * Creates a new user with the given information.
	 *
	 * @param identifier - The user's identifier.
	 * @param name - The user's name.
	 * @param email - The user's email.
	 * @param password - The user's password.
	 */

	createUser(
		identifier: string,
		name: string,
		email: string,
		password: string
	): Promise<void>;

	/**
	 * Deletes a user with the given identifier.
	 *
	 * @param identifier - The identifier of the user to delete.
	 * @returns A boolean if the user existed before it was deleted.
	 */

	deleteUser(identifier: string): boolean;

	/**
	 * Returns a hash for the given password.
	 *
	 * @param password - The password to hash.
	 */

	hashPassword(password: string): Promise<string>;

	/**
	 * Checks a password hash against a password, returning true if they match.
	 *
	 * @param password - The password to check.
	 * @param hash - The password hash to check against.
	 */

	checkPassword(password: string, hash: string): Promise<boolean>;

	/**
	 * Returns a token for a user email / username + password combination.
	 * Throws an AssertError if the combination is invalid.
	 *
	 * @param identity - The user's email or username.
	 * @param password - The user's password.
	 */

	getAuthToken(identity: string, password: string): Promise<Token>;

	/**
	 * Returns the user's database ID from the given token.
	 *
	 * @param token - The user's token.
	 */

	userIDFromToken(token: Token): Promise<string>;

	listUsers(): User[];
	getUser(token: string): User;
	getUserPermissions(token: string): Set<string>;
	getRolePermissions(roles: string[]): Set<string>;

	addPermissionCategory(permissionCategory: PermissionCategoryArgument): void;
	removePermissionCategory(identifier: string): boolean;

	addPermission(permission: PermissionArgument): void;
	removePermission(identifier: string): boolean;

	addRole(identifier: string, ind: number, name: string, permissions: string[]): void;
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
