import path from 'path';
import { promises as fs, constants as fsc } from 'fs';

import minimist from 'minimist';

import Server from './Server';
import Logger from './Logger';
import resolvePath from './ResolvePath';
import { Config, mergeConfig } from './ServerConfig';

const DEFAULT_DATA_DIR = 'site-data';
const DEFAULT_CONF_FILENAME = 'conf.json';

process.on('unhandledRejection', (e) => {
	Logger.error(`Unhandled process rejection:\n${(e as Error).stack ?? e}`);
	Logger.error(
		'If the stack trace references a plugin, contact the plugin developer.' +
			' Otherwise, please report this error.'
	);
});

// Start AuriServe
(async () => {
	const args = minimist(process.argv.slice(2)) as any;

	// Find the Configuration file.
	const confPath = resolvePath(
		args.conf
			? args.conf
			: args.data
			? path.join(args.data, DEFAULT_CONF_FILENAME)
			: path.join(DEFAULT_DATA_DIR, DEFAULT_CONF_FILENAME)
	);

	// Parse the config into conf.
	let conf: Config | null;

	try {
		const file = (await fs.readFile(confPath)).toString();
		conf = mergeConfig(JSON.parse(file), args);
	} catch (e) {
		Logger.setLogLevel('debug');
		Logger.fatal("Failed to parse configuration file '%s'.\n %s", confPath, e);
		process.exit(1);
	}

	Logger.setLogLevel(conf.verbose ? 'trace' : conf.logLevel ?? 'info');

	// Find the site data folder.
	const dataPath = resolvePath(conf.data ?? DEFAULT_DATA_DIR);

	Logger.debug("Initializing AuriServe with configuration file '%s'.", confPath);
	Logger.debug("Found data directory '%s'.", dataPath);

	try {
		await fs.access(dataPath, fsc.R_OK);
	} catch (e) {
		Logger.fatal("Failed to access data directory '%s'.\n %s", dataPath, e);
		process.exit(1);
	}

	// Start the Server.
	try {
		new Server(conf, dataPath);
	} catch (e) {
		Logger.fatal('Unhandled Server Exception!\n %s', e);
		process.exit(1);
	}
})();
