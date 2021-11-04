import HTTP from 'http';
import HTTPS from 'https';
import Express from 'express';
import { server as WebSocketServer } from 'websocket';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import fss from 'fs';
import { assert } from 'common';
import Mongoose from 'mongoose';
import { graphql } from 'graphql';

import Logger from './Logger';
import Media from './data/Media';
import Pages from './data/Pages';
import Themes from './data/Themes';
import * as Auth from './data/Auth';
import Plugins from './data/Plugins';
import Roles from './data/model/Role';
import PageBuilder from './PageBuilder';
import Properties from './data/model/Properties';
import { Schema as schema, Resolver as rootValue } from './data/Graph';

import resolvePath from './ResolvePath';
import { Config } from './ServerConfig';
import AdminRouter from './router/AdminRouter';
import PagesRouter from './router/PagesRouter';
import createUserPrompt from './CreateUserPrompt';

export default class Server {
	private app = Express();

	private adminRouter: AdminRouter;
	private pagesRouter: PagesRouter;

	private media: Media;
	private pages: Pages;
	private themes: Themes;
	private plugins: Plugins;
	private pageBuilder: PageBuilder;

	constructor(public readonly conf: Config, public readonly dataPath: string) {
		this.app.use(compression());
		this.app.use(cookieParser());
		this.app.use(Express.json() as any);
		this.app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

		assert(this.conf.db, 'Config is missing a db field.');

		this.pages = new Pages(this.dataPath);
		this.media = new Media(this.dataPath);

		this.themes = new Themes(this.dataPath, true);
		this.plugins = new Plugins(this.dataPath, true);

		this.pageBuilder = new PageBuilder(this.dataPath, this.themes, this.plugins);

		const contextValue = { plugins: this.plugins, pages: this.pages,
			themes: this.themes, media: this.media, dataPath: this.dataPath };

		const gql = (query: string, variableValues: any = undefined) => graphql({
			schema, rootValue, contextValue, variableValues, source: query });

		let awaitListen: Promise<any>;
		let wsServer: WebSocketServer;

		const httpPort: number | undefined = this.conf.port || 80;
		const httpsPort: number | undefined = this.conf.https ? this.conf.https?.port || 443 : undefined;

		if (this.conf.https) {
			assert(this.conf.https.cert && this.conf.https.key,
				'Config is missing https.cert or https.key fields.');

			let cert: string;
			let key: string;
			try {
				cert = fss.readFileSync(resolvePath(this.conf.https.cert), 'utf8').toString();
				key = fss.readFileSync(resolvePath(this.conf.https.key), 'utf8').toString();
			}
			catch (e) {
				assert(false, 'Failed to read HTTPS key/certificate files.\n ' + e);
			}

			const http = HTTP.createServer(this.forwardHttps.bind(this) as any);
			const https = HTTPS.createServer({ cert: cert, key: key }, this.app);
			wsServer = new WebSocketServer({ httpServer: https, autoAcceptConnections: false });

			awaitListen = Promise.all([
				new Promise<void>(resolve => http.listen(httpPort, resolve)),
				new Promise<void>(resolve => https.listen(httpsPort, resolve))
			]);

		}
		else {
			const http = HTTP.createServer(this.app);
			wsServer = new WebSocketServer({ httpServer: http, autoAcceptConnections: false });
			awaitListen = new Promise<void>(resolve => http.listen(httpPort, resolve));
		}

		wsServer.on('request', request => {
			if (request.resourceURL.path === '/admin/watch') {
				const connection = request.accept(undefined, request.origin);
				this.themes.bind('refresh', () => connection.send('refresh'));
				this.plugins.bind('refresh', () => connection.send('refresh'));
			}
		});

		this.pagesRouter = new PagesRouter(this.dataPath, this.app, this.plugins, this.pageBuilder);
		this.adminRouter = new AdminRouter(this.dataPath, this.app, this.plugins, this.themes, this.media, gql);

		awaitListen.then(async () => {
			Logger.debug(httpsPort
				? `HTTP/HTTPS server listening on ports ${httpPort}/${httpsPort}.`
				: `HTTP/HTTPS server listening on port ${httpPort}.`);

			await Mongoose.connect(this.conf!.db!);
			Logger.debug('Connected to MongoDB successfully.');

			if (!await Properties.findOne({})) await Properties.create({ usage: { media_allocated: 1024 * 1024 * 1024 } });
			if (!(await Auth.listUsers()).length) Logger.warn('No users are registered, run with --super to create one.');
			if (!await Roles.findOne({})) await Roles.create({
				creator: (await Auth.listUsers())[0]?.id ?? 'nobody', name: 'Administrator', abilities: [ 'ADMINISTRATOR' ] });

			process.on('SIGINT',  () => this.shutdown());
			process.on('SIGQUIT', () => this.shutdown());
			process.on('SIGTERM', () => this.shutdown());

			Logger.info('Initialized AuriServe.');
			if (conf.verbose || conf.logLevel === 'trace') this.debugRoutes();

			await this.themes.refresh();
			await this.plugins.refresh();
			await this.pageBuilder.init(gql);

			if (this.conf.super) createUserPrompt();

			this.adminRouter.init();
			this.pagesRouter.init();
		});
	}

	/**
	 * Routing function to forward HTTP traffic to HTTPS.
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
	 * Shuts down the server, saving required data.
	 */

	private async shutdown() {
		Logger.info('Shutting down AuriServe.');
		await Promise.all([
			this.plugins.cleanup(),
			this.themes.cleanup()
		]);
		process.exit();
	}
}
