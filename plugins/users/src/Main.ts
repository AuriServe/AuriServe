import as from 'auriserve';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { assert, titleCase } from 'common';

import User, { Token } from './User';
import {
	Permission,
	PermissionArgument,
	PermissionCategory,
	PermissionCategoryArgument,
	PermissionCategoryPriority,
} from './Permission';

export * from './API';

const { database } = as.core;
import { init as databaseInit, getRoles } from './Database';
databaseInit();

as.users = {
	roles: getRoles(),
	permissions: new Map(),
	permissionCategories: new Map(),

	async createUser(identifier: string, name: string, email: string, password: string) {
		const id = database
			.prepare('INSERT INTO users(identifier, name, password) VALUES(?, ?, ?)')
			.run(identifier, name, await as.users.hashPassword(password)).lastInsertRowid;
		database.prepare('INSERT INTO userEmails(email, user) VALUES(?, ?)').run(email, id);
	},

	deleteUser(identifier: string) {
		return (
			database.prepare('DELETE FROM users WHERE identifier = ?').run(identifier).changes >
			0
		);
	},

	async hashPassword(password: string) {
		return await bcrypt.hash(password, 10);
	},

	async checkPassword(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	},

	async getAuthToken(identity: string, password: string): Promise<Token> {
		type DBUser = { id: number; hash: string };
		let user: DBUser | undefined;

		if (identity.includes('@')) {
			user = database
				.prepare(
					`SELECT id, password as hash FROM users INNER JOIN userEmails
					ON users.id = userEmails.user WHERE userEmails.email = ?`
				)
				.get(identity);
		} else {
			user = database
				.prepare(`SELECT id, password as hash FROM users WHERE identifier = ?`)
				.get(identity);
		}

		assert(user, 'Invalid email or password.');
		assert(
			await as.users.checkPassword(password, user.hash),
			'Invalid email or password.'
		);

		const token = nanoid(24);
		const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 31; // 1 month from now

		database
			.prepare(`INSERT INTO userTokens(token, user, expires) VALUES (?, ?, ?)`)
			.run(token, user.id, expires);

		return token;
	},

	userIDFromToken(token: Token): Promise<string> {
		const { user: id } =
			database
				.prepare(
					`UPDATE userTokens SET expires = strftime('%s', 'now') + 60 * 60 * 24 * 31 WHERE token = ? AND expires > strftime('%s', 'now') RETURNING user`
				)
				.get(token) ?? {};

		assert(id != null, 'Invalid token.');
		return id;
	},

	async createPasswordResetToken(identifier: string): Promise<string> {
		const id = database.prepare('SELECT id FROM users WHERE identifier = ?').get(identifier).id;

		const token = nanoid(24);
		const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3; // 3 days from now

		database
			.prepare(`INSERT INTO userPasswordResetTokens(token, user, expires) VALUES (?, ?, ?)`)
			.run(token, id, expires);

		return token;
	},

	async resetPassword(token: string, password: string): Promise<Token> {
		const { user, expires } =
			database.prepare(`DELETE FROM userPasswordResetTokens WHERE token = ? RETURNING user, expires`)
			.get(token) ?? {};

		assert(expires > Date.now() / 1000, 'This token has expired.');

		const identifier = database
			.prepare('UPDATE users SET password = ? WHERE id = ? RETURNING identifier')
			.get(await as.users.hashPassword(password), user).identifier;

		assert(identifier, 'Invalid token.');

		database.prepare('DELETE FROM userTokens WHERE user = ?').run(user);
		return await as.users.getAuthToken(identifier, password);
	},

	listUsers(): User[] {
		const emails: { email: string; user: number }[] = database
			.prepare(`SELECT email, user FROM userEmails`)
			.all();
		const roles: { role: string; user: number }[] = database
			.prepare(`SELECT role, user FROM userRoles`)
			.all();
		const users: (User & { id: number })[] = database
			.prepare(`SELECT id, identifier, name FROM users`)
			.all();

		return users.map((user) => ({
			identifier: user.identifier,
			name: user.name,
			emails: emails
				.filter((email) => email.user === user.id)
				.map((email) => email.email),
			roles: roles.filter((role) => role.user === user.id).map((role) => role.role),
		}));
	},

	getUser(token: Token): User {
		const userID = as.users.userIDFromToken(token);

		const { identifier, name } = database
			.prepare('SELECT identifier, name FROM users WHERE id = ?')
			.get(userID) as { identifier: string; name: string };

		const emails = database
			.prepare('SELECT email FROM userEmails WHERE user = ?')
			.all(userID)
			.map(({ email }) => email) as string[];

		const roles = database
			.prepare('SELECT role FROM userRoles WHERE user = ?')
			.all(userID)
			.map(({ role }) => role) as string[];

		return { identifier, name, emails, roles };
	},

	getUserPermissions(token: Token): Set<string> {
		const userID = database
			.prepare('SELECT user FROM userTokens WHERE token = ?')
			.get(token)?.user;

		assert(userID, 'Invalid token.');

		const roles: string[] = database
			.prepare(`SELECT role FROM userRoles WHERE user = ?`)
			.all(userID)
			.map((r) => r.role);

		return this.getRolePermissions(roles);
	},

	getRolePermissions(roles: string[]): Set<string> {
		return as.users.roles
			.filter((role) => roles.includes(role.identifier))
			.reduce<Set<string>>((acc, role) => {
				for (const permission of role.permissions) acc.add(permission);
				return acc;
			}, new Set());
	},

	addPermissionCategory(permissionCategory: PermissionCategoryArgument) {
		assert(
			!as.users.permissionCategories.has(permissionCategory.identifier),
			`Permission category '${permissionCategory.identifier}' already exists.`
		);

		permissionCategory.name ??= titleCase(permissionCategory.identifier);
		permissionCategory.icon ??= 'default';
		permissionCategory.priority ??= PermissionCategoryPriority.NORMAL;

		as.users.permissionCategories.set(
			permissionCategory.identifier,
			permissionCategory as PermissionCategory
		);
	},

	removePermissionCategory(identifier: string): boolean {
		return as.users.permissionCategories.delete(identifier);
	},

	addPermission(permission: PermissionArgument) {
		permission.name ??= titleCase(permission.identifier);
		permission.category ??= 'default';
		permission.default ??= false;
		permission.requires ??= [];

		assert(
			!as.users.permissions.has(permission.identifier),
			`Permission '${permission.identifier}' already exists.`
		);

		assert(
			as.users.permissionCategories.has(permission.category),
			`Permission category '${permission.category}' does not exist.`
		);

		as.users.permissions.set(permission.identifier, permission as Permission);
	},

	removePermission(identifier: string): boolean {
		return as.users.permissions.delete(identifier);
	},

	addRole(identifier: string, ind: number, name: string, permissions: string[]) {
		assert(
			as.users.roles.findIndex((role) => role.identifier === identifier) === -1,
			`Role '${identifier}' already exists.`
		);
		this.roles.splice(ind, 0, { identifier, name, permissions });
	},

	removeRole(identifier: string): boolean {
		const ind = as.users.roles.findIndex((roles) => roles.identifier === identifier);
		if (ind === -1) return false;
		as.users.roles.splice(ind, 1);
		return true;
	},
};

as.users.addPermissionCategory({
	identifier: 'default',
});

as.users.addPermissionCategory({
	identifier: 'administration',
	icon: 'role',
	priority: PermissionCategoryPriority.MAX,
});

as.users.addPermission({
	identifier: 'administrator',
	description: 'Bypass permissions and role heirarchy. Use with caution.',
	category: 'administration',
});

as.core.once('cleanup', () => as.unexport('users'));
