import HTTP from 'http';
import HTTPS from 'https';
import Express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import Mongoose from 'mongoose';
import { promises as fs } from 'fs';

import Logger from './Logger';
import Media from './data/Media';
import Elements from './Elements';
import * as Auth from './data/Auth';
import Plugins from './data/Plugins';
import Roles from './data/model/Role';
import PagesManager from './PagesManager';
import Properties from './data/model/Properties';

import resolvePath from './ResolvePath';
import { Config } from './ServerConfig';
import AdminRouter from './router/AdminRouter';
import PagesRouter from './router/PagesRouter';

export default class Server {
	private app = Express();
	private adminRouter: AdminRouter;
	private pagesRouter: PagesRouter;

	private media: Media;
	private plugins: Plugins;
	private elements: Elements;
	private pages: PagesManager;

	constructor(public readonly conf: Config, public readonly dataPath: string) {
		this.app.use(compression());
		this.app.use(cookieParser());
		this.app.use(bodyParser.json());
		this.app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

		this.elements = new Elements();
		this.media = new Media(this.dataPath);
		this.plugins = new Plugins(this.dataPath, this.elements);
		this.pages = new PagesManager(this.dataPath, this.plugins, this.elements, this.media);

		this.pagesRouter = new PagesRouter(this.dataPath, this.app, this.pages, this.plugins);
		this.adminRouter = new AdminRouter(this.dataPath, this.app, this.pages, this.plugins, this.media);

		this.init().then(async () => {
			if (conf.verbose || conf.logLevel === 'trace') this.debugRoutes();

			await this.pages.init();
			await this.plugins.init();

			// if (this.conf.super)
			//	 new SuperUserPrompt(this.db);

			await this.adminRouter.init();
			await this.pagesRouter.init();
		});
	}


	/**
	 * Initializes the server.
	 * Throws if there are configuration or database errors.
	 */

	private async init() {
		// Initialize HTTP / HTTPS server(s).

		await new Promise<void>(async (resolve) => {
			try {
				if (this.conf.https) {
					if (!this.conf.https.cert || !this.conf.https.key)
						throw 'Config is missing https.cert or https.key fields.';

					let cert: string, key: string;
					try {
						cert = await fs.readFile(resolvePath(this.conf.https.cert), 'utf8');
						key = await fs.readFile(resolvePath(this.conf.https.key), 'utf8');
					}
					catch (e) {
						throw 'Failed to parse HTTPS key / certificate files.\n ' + e;
					}

					const http = HTTP.createServer(this.forwardHttps.bind(this) as any);
					const https = HTTPS.createServer({ cert: cert, key: key }, this.app);

					http.listen(this.conf.port || 80, () => {
						Logger.debug('Redirect server listening on port %s.', this.conf.port || 80);
						https.listen(this.conf.https!.port || 443, () => {
							Logger.debug('HTTPS Server listening on port %s.', this.conf.https!.port || 443);
							resolve();
						});
					});
				}
				else {
					const http = HTTP.createServer(this.app);
					http.listen(this.conf.port || 80, () => {
						Logger.debug('HTTP Server listening on port %s.', this.conf.port || 80);
						resolve();
					});
				}
			}
			catch (e) {
				Logger.fatal(e);
				process.exit(1);
			}
		});

		if (!this.conf.db) {
			Logger.fatal('Config is missing a db field.');
			process.exit(1);
		}

		Mongoose.set('useFindAndModify', false);
		await Mongoose.connect(this.conf.db, { useNewUrlParser: true, useUnifiedTopology: true });
		Logger.debug('Connected to Mongoose successfully.');

		if (!await Properties.findOne({})) await Properties.create({ usage: { media_allocated: 1024 * 1024 * 1024 } });

		await Roles.deleteMany({});

		if (!(await Roles.findOne({}))) await Auth.addUser('Auri', 'password');

		if (!await Roles.findOne({})) await Roles.create({
			creator: (await Auth.listUsers())[0].id, name: 'Administrator', abilities: [ 'ADMINISTRATOR' ] });

		// await Promise.all((await Auth.listUsers()).map(u => Auth.removeUser(u._id)));

		// (await this.media.listMedia()).forEach(m => this.media.removeMedia(m._id));

		process.on('SIGINT',  () => this.shutdown());
		process.on('SIGQUIT', () => this.shutdown());
		process.on('SIGTERM', () => this.shutdown());

		Logger.info('Initialized AuriServe.');
	}


	/**
	 * Routing function to forward HTTP traffic to HTTPS.
	 *
	 * @param {Express.Request} req - The request object.
	 * @param {Express.Response} res - The response object.
	 */

	private forwardHttps(req: Express.Request, res: Express.Response) {
		const host = req.headers.host;
		if (!host) {
			res.status(403);
			return;
		}

		const loc = 'https://' + host.replace((this.conf.port || 80).toString(), (this.conf.https!.port || 443).toString()) + req.url;
		res.writeHead(301, { Location: loc });
		res.end();
	}


	/**
	 * Initializes middleware to debug network traffic.
	 */

	private debugRoutes() {
		this.app.get('*', (req, _, next) => {
			Logger.trace('GET %s', req.params[0]);
			next();
		});

		this.app.post('*', (req, _, next) => {
			Logger.trace('POST %s', req.params[0]);
			next();
		});
	}


	/**
	 * Calls a GraphQL query on the server schema and resolver.
	 */

	// private gql = (q: string) => graphql(Schema, q, Resolver,
	// 	{ themes: this.pages.themes, plugins: this.plugins, media: this.media }) as any;


	/**
	 * Shuts down the server, saving required data.
	 */

	private async shutdown() {
		Logger.info('Shutting down AuriServe.');
		await Promise.all([
			this.plugins.cleanup(),
			this.pages.themes.cleanup()
		]);
		process.exit();
	}
}
