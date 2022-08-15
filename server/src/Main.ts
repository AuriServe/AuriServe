import fs from 'fs';
import path from 'path';
import HTTP from 'http';
import debounce from 'debounce';
import { URLSearchParams } from 'url';
import { AssertError } from 'common';

import Express from 'express';
import minimist from 'minimist';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { server as WebSocketServer } from 'websocket';

import Log from './Log';
import { parse } from './YAML';
import connect, { Database } from './SQLite';
import PluginManager from './plugin/PluginManager';

const DEFAULT_CONF_PATH = 'site-data';
const DEFAULT_CONF_FILE = 'config.yaml';

export interface ServerConfig {
	[ key: string ]: any;

	port: number;
	dataPath: string;
	logLevel: string;
}

export default class Server {
	private express: Express.Express;
	private plugins: PluginManager;
	private database: Database;
	private conf: ServerConfig;

	private attemptedShutdown = false;

	constructor() {
		// Construct the server config.
		const args = minimist(process.argv.slice(2));

		let confPath: string | undefined = args._?.[0];
		if (!confPath) confPath = path.join(DEFAULT_CONF_PATH, DEFAULT_CONF_FILE);
		else if (!confPath.endsWith('.yaml'))
			confPath = path.join(confPath, DEFAULT_CONF_FILE);
		if (!path.isAbsolute(confPath)) confPath = path.join(__dirname, '..', confPath);

		this.conf = this.createConfig(confPath, args);

		// Apply configuration settings.
		Log.setLogLevel(this.conf.logLevel);
		Log.debug(`Initializing AuriServe with configuration file '${confPath}'.`);

		// Set up Express
		this.express = Express();
		this.express.use(compression());
		this.express.use(cookieParser());
		this.express.use(Express.json() as any);
		this.express.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

		this.express.set('query parser', (queryString: string): Record<string, string> => {
			const params: Record<string, string> = {};
			[...new URLSearchParams(queryString).entries()].forEach(
				([key, value]) => (params[key] = Array.isArray(value) ? value[0] : value)
			);
			return params;
		});

		if (this.conf.logLevel === 'trace') {
			this.express.get('*', (req, _, next) => {
				Log.trace('GET %s', req.params[0]);
				next();
			});

			this.express.post('*', (req, _, next) => {
				Log.trace('POST %s', req.params[0]);
				next();
			});
		}

		// Connect to the database.
		this.database = connect(path.join(this.conf.dataPath, 'data.sqlite'), {
			verbose: (query: string) => Log.trace(`SQL Query:\n${query}`),
		});

		// Initialize plugins.
		this.plugins = new PluginManager(
			this.conf,
			this.conf.dataPath,
			true,
			this.express,
			this.database
		);

		this.plugins.init().then(() => Log.info('Initialized AuriServe.'));

		// Initialize WebServer.
		const httpServer = HTTP.createServer(this.express);
		const wsServer = new WebSocketServer({ httpServer, autoAcceptConnections: false });

		httpServer.listen(this.conf.port, () =>
			Log.debug(`HTTP server listening on port ${this.conf.port}.`)
		);

		wsServer.on('request', (request) => {
			if (request.resourceURL.path === '/admin/watch') {
				const connection = request.accept(undefined, request.origin);
				this.plugins.bind('refresh', () => connection.send('refresh'));
			}
		});

		// Bind shutdown handler.
		this.handleShutdown = debounce(this.handleShutdown.bind(this), 50);
		process.on('SIGINT', this.handleShutdown);
		process.on('SIGTERM', this.handleShutdown);
	}

	/** Handles shutting down the server when an exit signal is recieved. */
	private async handleShutdown() {
		if (this.attemptedShutdown) {
			Log.fatal('Shutdown requested twice. Exiting immediately.');
			process.exit(1);
			return;
		}

		this.attemptedShutdown = true;
		Log.debug('Shutdown requested, cleaning up...');
		await this.plugins.cleanup();
		Log.info('Exiting Auriserve.');
		process.exit(0);
	}

	/** Creates a configuration object from a configuration path and command line arguments. */
	private createConfig(confPath: string, args: minimist.ParsedArgs): ServerConfig {
		let conf: ServerConfig;

		try {
			conf = parse(fs.readFileSync(confPath, 'utf8'));
		} catch (_) {
			throw new AssertError(`Could not read config file '${confPath}'.`);
		}

		let dataPath = conf.data_path ?? '.';
		if (!path.isAbsolute(dataPath))
			dataPath = path.join(path.dirname(confPath), dataPath);
		conf.dataPath = dataPath;

		conf.logLevel = conf.log_level || args.log_level || 'info';
		conf.port = conf.port || args.port || 80;

		return conf as ServerConfig;
	}
}

new Server();
