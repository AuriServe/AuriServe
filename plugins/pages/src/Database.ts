import { promises as fs } from 'fs';
import { database } from 'auriserve';

import { Page } from './Interface';

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

export async function cache(path: string) {
	const page = await fs.readFile(path, 'utf8');
	database.prepare('INSERT OR IGNORE INTO pages (path, content) VALUES (?, ?)').run(path, page);
}

/**
 * Returns a page from the database using its full path.
 *
 * @param path - The absolute path to the page file.
 * @returns the page.
 */

export function getPage(path: string): Page | null {
	const content = database.prepare('SELECT content FROM pages WHERE path = ?').get(path)?.content;
	return content ? JSON.parse(content) : null;
}
