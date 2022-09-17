import bcrypt from 'bcryptjs';
import { assert } from 'common';
import { nanoid } from 'nanoid';
import { database } from 'auriserve';

export interface User {
	identifier: string;
	name: string;
	emails: string[];
	roles: string[];
}

export type Token = string;

export async function createUser(identifier: string, name: string, email: string, password: string) {
	const id = database
		.prepare('INSERT INTO users(identifier, name, password, data) VALUES (?, ?, ?, ?)')
		.run(identifier, name, await hashPassword(password), '').lastInsertRowid;
	database.prepare('INSERT INTO userEmails(email, user) VALUES(?, ?)').run(email, id);
}

export function deleteUser(identifier: string) {
	return (
		database.prepare('DELETE FROM users WHERE identifier = ?').run(identifier).changes >
		0
	);
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, 10);
}

export async function checkPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

export async function getAuthToken(identity: string, password: string): Promise<Token> {
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
		await checkPassword(password, user.hash),
		'Invalid email or password.'
	);

	const token = nanoid(24);
	const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 31; // 1 month from now

	database
		.prepare(`INSERT INTO userTokens(token, user, expires) VALUES (?, ?, ?)`)
		.run(token, user.id, expires);

	return token;
}

export function userIDFromToken(token: Token): Promise<string> {
	const { user: id } =
		database
			.prepare(
				`UPDATE userTokens SET expires = strftime('%s', 'now') + 60 * 60 * 24 * 31 WHERE token = ? AND expires > strftime('%s', 'now') RETURNING user`
			)
			.get(token) ?? {};

	assert(id != null, 'Invalid token.');
	return id;
}

export async function createPasswordResetToken(identifier: string): Promise<string> {
	const id = database.prepare('SELECT id FROM users WHERE identifier = ?').get(identifier).id;

	const token = nanoid(24);
	const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3; // 3 days from now

	database
		.prepare(`INSERT INTO userPasswordResetTokens(token, user, expires) VALUES (?, ?, ?)`)
		.run(token, id, expires);

	return token;
}

export async function resetPassword(token: string, password: string): Promise<Token> {
	const { user, expires } =
		database.prepare(`DELETE FROM userPasswordResetTokens WHERE token = ? RETURNING user, expires`)
		.get(token) ?? {};

	assert(expires > Date.now() / 1000, 'This token has expired.');

	const identifier = database
		.prepare('UPDATE users SET password = ? WHERE id = ? RETURNING identifier')
		.get(await hashPassword(password), user).identifier;

	assert(identifier, 'Invalid token.');

	database.prepare('DELETE FROM userTokens WHERE user = ?').run(user);
	return await getAuthToken(identifier, password);
}

export function listUsers(): User[] {
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
}

export function getUser(token: Token): User {
	const userID = userIDFromToken(token);

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
}

export function getUserData(identifier: string): Record<string, any> | null {
	const data = database
		.prepare('SELECT data FROM users WHERE identifier = ?')
		.get(identifier).data;
	return data ? JSON.parse(data) : null;
}

export function setUserData(identifier: string, data: Record<string, any>) {
	database
		.prepare('UPDATE users SET data = ? WHERE identifier = ?')
		.run(JSON.stringify(data), identifier);
}
