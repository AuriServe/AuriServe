import fss from 'fs';
import path from 'path';
import HTTP from 'http';
import HTTPS from 'https';
import { assert } from 'common';
import { URLSearchParams } from 'url';

import Express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { server as WebSocketServer } from 'websocket';

import Logger from './Log';
import { Config } from './ServerConfig';
import connect, { Database } from './SQLite';
import PluginManager from './plugin/PluginManager';

export default class Server {
	private app = Express();
	private plugins: PluginManager;
	private database: Database;

	constructor(public readonly conf: Config, public readonly dataPath: string) {
		this.app.use(compression());
		this.app.use(cookieParser());
		this.app.use(Express.json() as any);
		this.app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

		this.app.set('query parser', (queryString: string): Record<string, string> => {
			return Object.fromEntries(
				[...new URLSearchParams(queryString).entries()].map(([key, value]) => [
					key,
					Array.isArray(value) ? value[0] : value,
				])
			);
		});

		this.database = connect(path.join(this.dataPath, 'data.sqlite'), {
			verbose: (query: string) => Logger.trace(`SQL Query:\n${query}`),
		});

		this.plugins = new PluginManager(this.dataPath, true, this.app, this.database);

		let awaitListen: Promise<any>;
		let wsServer: WebSocketServer;

		const httpPort: number | undefined = this.conf.port || 80;
		const httpsPort: number | undefined = this.conf.https
			? this.conf.https?.port || 443
			: undefined;

		if (this.conf.https) {
			assert(
				this.conf.https.cert && this.conf.https.key,
				'Config is missing https.cert or https.key fields.'
			);

			let cert: string;
			let key: string;
			try {
				cert = fss
					.readFileSync(path.join(__dirname, '../', this.conf.https.cert), 'utf8')
					.toString();
				key = fss
					.readFileSync(path.join(__dirname, '../', this.conf.https.key), 'utf8')
					.toString();
			} catch (e) {
				assert(false, `Failed to read HTTPS key/certificate files.\n ${e}`);
			}

			const http = HTTP.createServer(this.forwardHttps.bind(this) as any);
			const https = HTTPS.createServer({ cert, key }, this.app);
			wsServer = new WebSocketServer({ httpServer: https, autoAcceptConnections: false });

			awaitListen = Promise.all([
				new Promise<void>((resolve) => http.listen(httpPort, resolve)),
				new Promise<void>((resolve) => https.listen(httpsPort, resolve)),
			]);
		} else {
			const http = HTTP.createServer(this.app);
			wsServer = new WebSocketServer({ httpServer: http, autoAcceptConnections: false });
			awaitListen = new Promise<void>((resolve) => http.listen(httpPort, resolve));
		}

		wsServer.on('request', (request) => {
			if (request.resourceURL.path === '/admin/watch') {
				const connection = request.accept(undefined, request.origin);
				this.plugins.bind('refresh', () => connection.send('refresh'));
			}
		});

		awaitListen.then(async () => {
			Logger.debug(
				httpsPort
					? `HTTP/HTTPS server listening on ports ${httpPort}/${httpsPort}.`
					: `HTTP server listening on port ${httpPort}.`
			);

			process.on('SIGINT', () => this.shutdown());
			process.on('SIGQUIT', () => this.shutdown());
			process.on('SIGTERM', () => this.shutdown());

			Logger.info('Initialized AuriServe.');
			if (conf.verbose || conf.logLevel === 'trace') this.debugRoutes();

			await this.plugins.init();
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

		const loc = `https://${host.replace(
			(this.conf.port || 80).toString(),
			(this.conf.https!.port || 443).toString()
		)}${req.url}`;
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
		await Promise.all([this.plugins.cleanup() /*, this.themes.cleanup()*/]);
		process.exit();
	}
}
