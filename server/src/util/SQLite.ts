import path from 'path';
import SQLite, { Options } from 'better-sqlite3';

const IS_NEXE = !process.argv[0].replace(/\.exe/g, '').endsWith('node');

export default function connect(dbPath: string, options: Options = {}) {
	return new SQLite(dbPath, {
		...options,
		// eslint-disable-next-line
		// @ts-ignore
		nativeBinding: IS_NEXE
			? path.resolve(path.join(__dirname, '../native/better_sqlite3.node'))
			: undefined,
	});
}

export type { Database, Statement, Transaction, SqliteError } from 'better-sqlite3';
