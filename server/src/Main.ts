import fs from 'fs';
import path from 'path';
import HTTP from 'http';
import debounce from 'debounce';
import { URLSearchParams } from 'url';

import Express from 'express';
import minimist from 'minimist';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { server as WebSocketServer } from 'websocket';

import Log from './util/Log';
import connect from './util/SQLite';
import { parse } from './util/YAML';
import { ConfigSchema } from './Config';
import PluginManager from './plugin/PluginManager';

const DEFAULT_CONF_PATH = 'site-data';
const DEFAULT_CONF_FILE = 'config.yaml';

try {
	// Construct the server config.
	const args = minimist(process.argv.slice(2));

	let confPath: string | undefined = args._?.[0];
	if (!confPath) confPath = path.join(DEFAULT_CONF_PATH, DEFAULT_CONF_FILE);
	else if (!confPath.endsWith('.yaml')) confPath = path.join(confPath, DEFAULT_CONF_FILE);
	if (!path.isAbsolute(confPath)) confPath = path.join(process.cwd(), confPath);

	let confFile: Record<string, string>;
	try { confFile = parse<Record<string, string>>(fs.readFileSync(confPath, 'utf8')); }
	catch (e) { throw new Error(`Failed to parse config file '${confPath}'.`); }

	const conf = ConfigSchema.parse({ ...confFile, ...args })

	if (!path.isAbsolute(conf.dataPath)) conf.dataPath = path.join(path.dirname(confPath), conf.dataPath);

	// Apply configuration settings.
	Log.setLogLevel(conf.logLevel);
	Log.debug(`Initializing AuriServe with configuration file '${confPath}'.`);

	// Set up Express
	const express = Express();
	express.use(compression());
	express.use(cookieParser());
	express.use(Express.urlencoded({ extended: true, limit: "10mb" }) as any);
	express.use(Express.json({ limit: "10mb" }) as any);
	express.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

	express.set('query parser', (queryString: string): Record<string, string> => {
		const params: Record<string, string> = {};
		[...new URLSearchParams(queryString).entries()].forEach(
			([key, value]) => (params[key] = Array.isArray(value) ? value[0] : value)
		);
		return params;
	});

	if (conf.logLevel === 'trace') {
		express.get('*', (req, _, next) => {
			Log.trace('GET %s', req.params[0]);
			next();
		});

		express.post('*', (req, _, next) => {
			Log.trace('POST %s', req.params[0]);
			next();
		});
	}

	// Connect to the database.
	const database = connect(path.join(conf.dataPath, 'data.sqlite'), {
		verbose: (query: string) => Log.trace(`SQL Query:\n${query}`),
	});

	// Initialize plugins.
	const plugins = new PluginManager(
		conf,
		conf.dataPath,
		true,
		express,
		database
	);

	plugins.init().then(() => Log.info('Initialized AuriServe.'));

	// Initialize WebServer.
	const httpServer = HTTP.createServer(express);
	const wsServer = new WebSocketServer({ httpServer, autoAcceptConnections: false });

	httpServer.listen(conf.port, () =>
		Log.debug(`HTTP server listening on port ${conf.port}.`)
	);

	wsServer.on('request', (request) => {
		console.log('SOMETHING HAPENED');
		if (request.resourceURL.path === '/admin/watch') {
			const connection = request.accept(undefined, request.origin);
			plugins.bind('refresh', () => connection.send('refresh'));
		}
	});

	// Bind shutdown handler.
	let attemptedShutdown = false;

	const handleShutdown = debounce(async () => {
		if (attemptedShutdown) {
			Log.fatal('Shutdown requested twice. Exiting immediately.');
			process.exit(1);
			return;
		}

		attemptedShutdown = true;
		Log.debug('Shutdown requested, cleaning up...');
		await plugins.cleanup();
		Log.info('Exiting Auriserve.');
		process.exit(0);
	});

	process.on('SIGINT', handleShutdown);
	process.on('SIGTERM', handleShutdown);
}
catch (e) {
	Log.fatal('Failed to initialize AuriServe:\n%s', e);
	process.exit(1);
}
