import path from 'path';
import { setRoot } from 'routes';
import auriserve from 'auriserve';
import { promises as fs } from 'fs';

import PageRoute from './PageRoute';
import { addInjector } from './Injectors';

const { log, database: db } = auriserve;

db.exec('DROP TABLE IF EXISTS pages');
db.exec('DROP TABLE IF EXISTS includes');

db.prepare(
	'CREATE TABLE IF NOT EXISTS pages (content TEXT, includes TEXT)'
).run();

db.prepare(
	'CREATE TABLE IF NOT EXISTS includes (content TEXT, includes TEXT)'
).run();

export { default as PageRoute } from './PageRoute';
export { registeredLayouts, registerLayout, unregisterLayout } from './Layouts';
export { registeredInjectors, addInjector, removeInjector } from './Injectors';
export { buildPage, populateLayout } from './PageBuilder';

// TEMP DEVELOPMENT CODE

(async () => {
	const home = await fs.readFile(path.join(__dirname, '..', 'home.json'), 'utf8');
	const unsubscribe = await fs.readFile(path.join(__dirname, '..', 'unsubscribe.json'), 'utf8');

	db.prepare('DELETE FROM pages').run();
	db.prepare('DELETE FROM includes').run();

	const { lastInsertRowid: homeID } = db.prepare<string>(
		'INSERT INTO pages (content, includes) VALUES (?, \'[]\')'
	).run(home);

	const { lastInsertRowid: unsubscribeID } = db.prepare<string>(
		'INSERT INTO pages (content, includes) VALUES (?, \'[]\')'
	).run(unsubscribe);

	const root = new PageRoute('/', homeID as number);
	root.add('unsubscribe', new PageRoute('/unsubscribe', unsubscribeID as number));
	setRoot(root);
})();

const buildPath = path.join(__dirname, '../../../server/site-data/plugins/client.js');

// TODO: An event should exist for all plugins loaded.
setTimeout(async () => {
	const paths = [ ...auriserve.plugins.values()].filter(plugin => plugin.entry.client)
		.map(plugin => `${plugin.identifier}/${plugin.entry.client}`);

	log.info(`Found client plugins: ${paths.map(path => `'${path}'`).join(', ')}`);

	await fs.writeFile(buildPath,
		(await Promise.all(paths.map(pluginPath => fs.readFile(path.join(__dirname, '../../', pluginPath), 'utf8'))))
			.join('\n'));
}, 500);

auriserve.router.get('/client.js', async (_, res) => {
	res.send(await fs.readFile(buildPath, 'utf8'));
});

addInjector('head', () => `<script defer src='/client.js'></script>`);

// END TEMP DEVELOPMENT CODE
