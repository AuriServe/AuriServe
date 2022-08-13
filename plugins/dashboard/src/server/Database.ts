import auriserve from 'auriserve';
const { database: db } = auriserve;

interface SiteInfo {
	name: string;
	domain: string;
	description: string;
}

db.prepare(
	'CREATE TABLE IF NOT EXISTS site_info (id INTEGER PRIMARY KEY, domain TEXT, name TEXT, description TEXT)'
).run();

db.prepare(
	'INSERT OR IGNORE INTO site_info (id, domain, name, description) VALUES (0, ?, ?, ?)'
).run('www.example.com', 'Example', 'An example website.');

export function getSiteInfo(): SiteInfo {
	return db.prepare('SELECT * FROM site_info').get() as SiteInfo;
}

export function setCalculator(info: SiteInfo): boolean {
	return (
		db
			.prepare('UPDATE site_info SET domain = ?, name = ?, description = ? WHERE id = 0')
			.run(info.domain, info.name, info.description).changes > 0
	);
}
