import path from 'path';
import as from 'auriserve';
import { assert } from 'common';
import { promises as fs } from 'fs';

setTimeout(async () => {
	const route = await as.routes.getRoot();
	assert(route, 'No base route.');
	route.add(
		'dashboard',
		new (class extends as.routes.BaseRoute {
			async render() {
				return await fs.readFile(
					path.join(__dirname, '..', 'res', 'Server', 'page.html'),
					'utf8'
				);
			}
		})('/dashboard')
	);
}, 1000);

console.log('dashboard on server!');
