import { database, log } from 'auriserve';

import { Document } from './Interface';

database.prepare('CREATE TABLE IF NOT EXISTS pages (path TEXT PRIMARY KEY, content TEXT)').run();

// database.prepare('CREATE TABLE IF NOT EXISTS includes (path TEXT PRIMARY KEY, content TEXT)').run();

export function clearCache() {
	database.exec('DELETE FROM pages');
	// database.exec('DELETE FROM includes');
}

/**
 * Adds a page to the database using its full path.
 *
 * @param path - The absolute path to the page file.
 */

export async function cache(path: string, pageStr: string) {
	database.prepare('INSERT OR REPLACE INTO pages (path, content) VALUES (?, ?)')
		.run(path, pageStr);
}

/**
 * Returns a page from the database using its full path.
 *
 * @param path - The absolute path to the page file.
 * @returns the page.
 */

export function getDocument(path: string): Document | null {
	try {
		const content = database.prepare('SELECT content FROM pages WHERE path = ?').get(path)?.content;
		return content ? JSON.parse(content) : null;
	}
	catch (err) {
		if (typeof err === 'object' && err && 'message' in err) {
			log.error('Failed to parse page \'%s\': %s', path, (err as any).message);
		}
		return null;
	}
}
