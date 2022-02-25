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

const { database: db } = as.core;

db.exec(`DROP TABLE IF EXISTS users`);
db.exec(`DROP TABLE IF EXISTS roles`);
db.exec(`DROP TABLE IF EXISTS userRoles`);
db.exec(`DROP TABLE IF EXISTS userEmails`);
db.exec(`DROP TABLE IF EXISTS userTokens`);

db.exec(
	`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY,
		identifier TEXT UNIQUE NOT NULL,
		name TEXT NOT NULL,
		password TEXT NOT NULL
	) STRICT`
);

db.exec(
	`CREATE TABLE IF NOT EXISTS userEmails (
		email TEXT,
		user INTEGER
	) STRICT`
);

db.exec(
	`CREATE TABLE IF NOT EXISTS userRoles (
		role TEXT PRIMARY KEY,
		user INTEGER NOT NULL
	) STRICT`
);

db.exec(
	`CREATE TABLE IF NOT EXISTS userTokens (
		token TEXT PRIMARY KEY,
		user INTEGER NOT NULL,
		expires INTEGER NOT NULL
	) STRICT`
);

db.exec(
	`CREATE TABLE IF NOT EXISTS roles (
		identifier TEXT UNIQUE,
		name TEXT,
		ind INTEGER,
		permissions TEXT
	)`
);

as.users = {
	roles: [],
	permissions: new Map(),
	permissionCategories: new Map(),

	async createUser(identifier: string, name: string, email: string, password: string) {
		const id = db
			.prepare('INSERT INTO users(identifier, name, password) VALUES(?, ?, ?)')
			.run(identifier, name, await as.users.hashPassword(password)).lastInsertRowid;
		db.prepare('INSERT INTO userEmails(email, user) VALUES(?, ?)').run(email, id);
	},

	deleteUser(identifier: string) {
		return (
			db.prepare('DELETE FROM users WHERE identifier = ?').run(identifier).changes > 0
		);
	},

	async hashPassword(password: string) {
		return await bcrypt.hash(password, 10);
	},

	async checkPassword(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	},

	async getAuthToken(email: string, password: string): Promise<Token> {
		const user = db
			.prepare(
				`SELECT id, password as hash FROM users INNER JOIN userEmails
				ON users.id = userEmails.user WHERE userEmails.email = ?`
			)
			.get(email) as { id: string; hash: string } | undefined;

		assert(user, 'Invalid email or password.');
		assert(
			await as.users.checkPassword(password, user.hash),
			'Invalid email or password.'
		);

		const token = nanoid(24);
		const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 31; // 1 month from now

		db.prepare(`INSERT INTO userTokens(token, user, expires) VALUES (?, ?, ?)`).run(
			token,
			user.id,
			expires
		);

		return token;
	},

	userIDFromToken(token: Token): Promise<string> {
		const { user: id } =
			db
				.prepare(
					`UPDATE userTokens SET expires = strftime('%s', 'now') + 60 * 60 * 24 * 31 WHERE token = ? AND expires > strftime('%s', 'now') RETURNING user`
				)
				.get(token) ?? {};

		assert(id, 'Invalid token.');
		return id;
	},

	getUser(token: Token): User {
		const userID = as.users.userIDFromToken(token);

		const { identifier, name } = db
			.prepare('SELECT identifier, name FROM users WHERE id = ?')
			.get(userID) as { identifier: string; name: string };

		const emails = db
			.prepare('SELECT email FROM userEmails WHERE user = ?')
			.all(userID)
			.map(({ email }) => email) as string[];

		const roles = db
			.prepare('SELECT role FROM userRoles WHERE user = ?')
			.all(userID)
			.map(({ role }) => role) as string[];

		return { identifier, name, emails, roles };
	},

	getRolePermissions(_roles: string[]): Set<string> {
		return new Set();
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
	icon: 'security',
	priority: PermissionCategoryPriority.MAX,
});

as.users.addPermission({
	identifier: 'administrator',
	description: 'Bypass permissions and role heirarchy. Use with caution.',
	category: 'administration',
});

// Test data

(async () => {
	await as.users.createUser('aurailus', 'Aurailus', 'me@auri.xyz', 'password');
	as.users.getUser(await as.users.getAuthToken('me@auri.xyz', 'password'));
	try {
		as.users.addRole('admin', 0, 'Administrator', ['administrator']);
		as.users.addRole('asshole', 100, 'ass', ['administrator']);
	} catch (e) {
		console.warn(e);
	}
	// db.exec(
	// 	`INSERT INTO roles(identifier, name, ind, permissions) VALUES('admin', 'Admin', 0, 'admin')`
	// );
	// db.exec(`INSERT INTO userRoles(role, user) VALUES('administrator', 1)`);
	// db.exec(`INSERT INTO userEmails(email, user) VALUES('admin@example.com', 1)`);

	// const token = await as.users.getAuthToken('admin@example.com', 'admin');
	// console.log(await as.users.getUser(token!));

	// console.log(await as.users.getAuthToken('admin@example.co', 'admin'));
	// console.log(await as.users.getAuthToken('admin@example.com', 'admi'));
	// console.log(await as.users.getAuthToken('admin@example.com', ''));
	// console.log(await as.users.getAuthToken('admin@example.com', 'admin'));
})();

// end test data

as.core.once('cleanup', () => as.unexport('users'));
