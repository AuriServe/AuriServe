import path from 'path';
import { assert } from 'common';
import auriserve, { router } from 'auriserve';

import { MEDIA_DIR, VARIANT_DIR, reconcileMedia } from './Ingest';

const cleanupWatcher = reconcileMedia();

const routes = [
	router.get('/media/:path', async (req, res) => {
		const file = req.params.path;
		try {
			assert(typeof file === 'string', 'Invalid path.');
			const modPath = path.join(MEDIA_DIR, file);
			res.sendFile(modPath);
		}
		catch (e) {
			res.sendStatus(500);
		}
	}),
	router.get('/media/variant/:path', async (req, res) => {
		const file = req.params.path;
		try {
			assert(typeof file === 'string', 'Invalid path.');
			const modPath = path.join(VARIANT_DIR, file);
			res.sendFile(modPath);
		}
		catch (e) {
			res.sendStatus(500);
		}
	})
];

auriserve.once('cleanup', () => {
	routes.forEach(route => router.remove(route));
	cleanupWatcher.then(c => c());
});

export * from './Database';
