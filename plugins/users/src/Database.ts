import { database } from 'auriserve';

import { Role } from './Roles';
// import {  } from './Users';

export function init() {
	/***** Reset data (DEVELOPMENT ONLY) *****/

	// database.exec(`DROP TABLE IF EXISTS users`);
	// database.exec(`DROP TABLE IF EXISTS roles`);
	// database.exec(`DROP TABLE IF EXISTS userRoles`);
	// database.exec(`DROP TABLE IF EXISTS userEmails`);
	// database.exec(`DROP TABLE IF EXISTS userTokens`);
	// database.exec(`DROP TABLE IF EXISTS userPasswordResetTokens`);

	/* Holds users' identifiers, names, and passwords. */
	database.exec(
		`CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY,
			identifier TEXT UNIQUE NOT NULL,
			name TEXT NOT NULL,
			password TEXT NOT NULL,
			data TEXT NOT NULL
		) STRICT`
	);

	database.exec(
		`CREATE TABLE IF NOT EXISTS userPasswordResetTokens (
			token TEXT PRIMARY KEY,
			user INTEGER NOT NULL,
			expires INTEGER NOT NULL
		) STRICT`
	)

	/* Holds emails that are assigned to users. */
	database.exec(
		`CREATE TABLE IF NOT EXISTS userEmails (
			email TEXT PRIMARY KEY,
			user INTEGER
		) STRICT`
	);

	/* Holds roles that are assigned to users. */
	database.exec(
		`CREATE TABLE IF NOT EXISTS userRoles (
			id INTEGER PRIMARY KEY,
			role TEXT,
			user INTEGER NOT NULL
		) STRICT`
	);

	/* Holds user authentication tokens. */
	database.exec(
		`CREATE TABLE IF NOT EXISTS userTokens (
			token TEXT PRIMARY KEY,
			user INTEGER NOT NULL,
			expires INTEGER NOT NULL
		) STRICT`
	);

	/* Holds serialized roles. Should be loaded from at the beginning, and updated when the live versions change. */
	database.exec(
		`CREATE TABLE IF NOT EXISTS roles (
			id INTEGER PRIMARY KEY,
			identifier TEXT UNIQUE,
			name TEXT,
			ind INTEGER,
			permissions TEXT
		) STRICT`
	);
}

export function getRoles(): Role[] {
	const rawRoles = database.prepare(`SELECT * FROM roles`).all();
	rawRoles.sort((a, b) => a.ind - b.ind);
	return rawRoles.map(
		({ identifier, name, permissions }): Role => ({
			identifier,
			name,
			permissions: permissions.split(','),
		})
	);
}


// Test data

// (async () => {
// 	await createUser('aurailus', 'Aurailus', 'me@auri.xyz', 'password');
// // 	await as.users.createUser('zythia', 'Zythia', 'zythia.woof@gmail.com', 'password');
// // 	await as.users.createUser('piescorch', 'Elliot', 'mail@example.com', 'password');
// // 	await as.users.createUser('lore', 'Lore', 'maila@example.com', 'password');
// // 	await as.users.createUser('choir', 'Jason', 'mailb@example.com', 'password');

// // 	await as.users.createUser('aurailus_', 'Aurailus', '_me@auri.xyz', 'password');
// // 	await as.users.createUser('zythia_', 'Zythia', '_zythia.woof@gmail.com', 'password');
// // 	await as.users.createUser('piescorch_', 'Elliot', '_mail@example.com', 'password');
// // 	await as.users.createUser('lore_', 'Lore', '_maila@example.com', 'password');
// // 	await as.users.createUser('choir_', 'Jason', '_mailb@example.com', 'password');

// // 	await as.users.createUser('aurailus__', 'Aurailus', '__me@auri.xyz', 'password');
// // 	await as.users.createUser('zythia__', 'Zythia', '__zythia.woof@gmail.com', 'password');
// // 	await as.users.createUser('piescorch__', 'Elliot', '__mail@example.com', 'password');
// // 	await as.users.createUser('lore__', 'Lore', '__maila@example.com', 'password');
// // 	await as.users.createUser('choir__', 'Jason', '__mailb@example.com', 'password');

// // 	try {
// 		addRole('administrator', 0, 'Administrator', ['administrator']);
// // 		as.users.addRole('moderator', 100, 'Moderator', ['view_audit_log']);
// // 		as.users.addRole('editor', 100, 'Editor', ['view_pages', 'view_users', 'view_permissions']);
// // 		as.users.addRole('@aurailus', 0, 'Auri', ['(administrator']);
// // 		as.users.addRole('@john', 0, 'John', ['view_audit_log']);
// // 		as.users.addRole('_everyone', 0, 'Everyone', []);
// // 	} catch (e) {
// // 		console.warn(e);
// // 	}

// 	database.exec(`INSERT INTO userRoles(role, user) VALUES('administrator', 1)`);
// // 	db.exec(`INSERT INTO userRoles(role, user) VALUES('editor', 1)`);
// // 	// db.exec(`INSERT INTO userRoles(role, user) VALUES('@aurailus', 1)`);

// // 	db.exec(`INSERT INTO userRoles(role, user) VALUES('editor', 2)`);
// })();
