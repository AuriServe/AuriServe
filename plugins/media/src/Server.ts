import path from 'path';
import { assert } from 'common';
import auriserve from 'auriserve';
import { Request, Response } from 'auriserve/router';
import { promises as fs, constants as fsc } from 'fs';

auriserve.router.get('/media/:path', async (req: Request, res: Response) => {
	const file = req.params.path;
	try {
		assert(typeof file === 'string', 'Invalid path.');
		const medPath = path.join(__dirname, '../../../server/site-data/media', file);
		await fs.access(medPath, fsc.R_OK);
		res.sendFile(medPath);
	}
	catch (e) {
		res.sendStatus(500);
	}
});
