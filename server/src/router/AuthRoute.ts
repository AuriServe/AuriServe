import Mongoose from 'mongoose';
import * as Express from 'express';
import { RateLimiterMongo } from 'rate-limiter-flexible';

import * as Auth from '../data/Auth';

export interface AuthRouteConfig {
	attempts?: number;
	duration?: number;
}

export const delay = (d: number, s?: number) =>
	new Promise((r) => setTimeout(r, Math.max(d - (s ? Date.now() - s : 0), 0)));

export default function AuthRoute(config: AuthRouteConfig = {}): {
	rateLimit: (
		req: Express.Request,
		res: Express.Response,
		next: Express.NextFunction
	) => void;
	authRoute: (
		req: Express.Request,
		res: Express.Response,
		next: Express.NextFunction
	) => void;
} {
	const limiter = new RateLimiterMongo({
		storeClient: Mongoose.connection,
		points: config.attempts ?? 100,
		duration: config.duration ?? 10,
	});

	const rateLimit = (
		req: Express.Request,
		res: Express.Response,
		next: Express.NextFunction
	) => {
		const start = Date.now();
		limiter
			.consume(req.ip, 10)
			.then(() => next())
			.catch(async () => {
				await delay(500, start);
				await delay(Math.random() * 150);
				res.status(429).send('Too many login attempts. Please wait before trying again.');
			});
	};

	const authRoute = async (
		req: Express.Request,
		res: Express.Response,
		next: Express.NextFunction
	) => {
		limiter
			.consume(req.ip, 1)
			.then(() => Auth.testToken(req.cookies.tkn))
			.then((user) => {
				if (user) next();
				else
					limiter
						.consume(req.ip, 9)
						.then(() => res.status(403).send('You must be logged in to use this route.'))
						.catch(() =>
							res.status(403).send('Too many requests. Please wait before trying again.')
						);
			});
	};

	return { rateLimit, authRoute };
}
