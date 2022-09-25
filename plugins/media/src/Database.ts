import { database } from 'auriserve';
import { FileType } from './FileType';

export interface Media {
	id: number;
	path: string;
	name: string;
	description: string;
	type: FileType,
	size: number;
}

export interface MediaImageVariant {
	id: number;
	media: number;
	path: string;
	type: string;
	size: number;
	width: number;
	height: number;
}


export function init() {
	// database.prepare('DROP TABLE IF EXISTS media').run();
	// database.prepare('DROP TABLE IF EXISTS media_image_variants').run();

	database.prepare(
		`CREATE TABLE IF NOT EXISTS media (
			id INTEGER PRIMARY KEY,
			path TEXT UNIQUE,
			name TEXT,
			description TEXT,
			type TEXT,
			size INTEGER
		) STRICT`
	).run();

	database.prepare('CREATE UNIQUE INDEX IF NOT EXISTS media_path_index ON media (path)');

	database.prepare(
		`CREATE TABLE IF NOT EXISTS media_image_variants (
			id INTEGER PRIMARY KEY,
			media INTEGER,
			path TEXT,
			type TEXT,
			size INTEGER,
			width INTEGER,
			height INTEGER
		) STRICT`
	).run();

	database.prepare('CREATE INDEX IF NOT EXISTS media_image_variants_index ON media_image_variants (media)').run();
}
