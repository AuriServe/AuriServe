import path from 'path';
import as from 'auriserve';
import { RequestHandler } from 'auriserve/router';

const { router } = as.core;

const handlers: RequestHandler[] = [];

handlers.push(
	router.get('/dashboard/res/main.js', (_, res) => {
		res.sendFile(path.join(__dirname, '..', 'dist', 'main.js'));
	})
);

handlers.push(
	router.get('/dashboard/res/main.js.map', (_, res) => {
		res.sendFile(path.join(__dirname, '..', 'dist', 'main.js.map'));
	})
);

handlers.push(
	router.post('/dashboard/res/auth', (_, res) => {
		res.send('1234fakeToken4321');
	})
);

handlers.push(
	router.get('/dashboard/res/:path', (req, res) => {
		res.sendFile(path.join(__dirname, '..', 'res', 'Dashboard', req.params.path));
	})
);

handlers.push(
	router.get(['/dashboard', '/dashboard/*'], (_, res) => {
		res.sendFile(path.join(__dirname, '..', 'res', 'Server', 'page.html'));
	})
);

// setTimeout(async () => {
// 	const route = await as.routes.getRoot();
// 	assert(route, 'No base route.');

// 	as.core.router

// 	route.add(
// 		'dashboard',
// 		new (class extends as.routes.BaseRoute {
// 			async render() {
// 				return await fs.readFile(
// 					path.join(__dirname, '..', 'res', 'Server', 'page.html'),
// 					'utf8'
// 				);
// 			}
// 		})('/dashboard')
// 	);
// }, 1000);

as.core.once('cleanup', () => handlers.forEach((handler) => router.remove(handler)));

console.log('dashboard on server!');
