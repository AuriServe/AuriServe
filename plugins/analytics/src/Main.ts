import as from 'auriserve';
// import { lookup } from 'geoip-lite';
import { Request, Response, NextFunction } from 'auriserve/router';

const { router } = as.core;

const watchRequest = (req: Request, _: Response, next: NextFunction) => {
	const fingerprint = {
		ua: req.get('User-Agent'),
		// lang: req.get('Accept-Language'),
		file: req.get('Accept'),
		ip: req.ip,
	};
	console.log(fingerprint);
	// console.log(lookup('96.54.48.189'));
	next();
};

router.get('*', watchRequest);
as.core.on('cleanup', () => router.remove(watchRequest));

export type { default as API } from './API';
