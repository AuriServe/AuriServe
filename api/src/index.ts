import type { Database } from 'better-sqlite3';

import type Log from './log';
import type YAML from './yaml';
import type Router from './router';
import type { PluginManifest } from './plugin';
import type { WatcherConstructor } from './watcher';

/** The Auriserve API. */
export interface API {

	/** Provides access to the underlying Router, for handling incoming requests. */
	router: Router;

	/** Provides access to advanced logging functionality using log4js. */
	log: Log;

	/** YAML parsing and stringifying. */
	YAML: YAML;

	/** Currently loaded plugin manifests. */
	plugins: Map<string, PluginManifest>;

	/** Watches files for changes. */
	Watcher: WatcherConstructor;

	/** Provides access to the underlying MySQL database, for high-preformance data storage. */
	database: Database;

	/** Binds a callback to an event. */
	on(event: string, cb: (event: any) => void): void;

	/** Binds a callback to an event one time. */
	once(event: string, cb: (event: any) => void): void;

	/** Unbinds a callback from an event. */
	off(event: string, cb: (event: any) => void): void;

	/** Emits an event to event listeners. */
	emit(event: string, eventObj: any): void;
}

// Actually get the API context and export it.
// eslint-disable-next-line no-underscore-dangle
const api: API = (global as any)._CONTEXT;

if (!api) {
	throw new Error(
		'Could not find AuriServe context!\n' +
			"Please make sure you are loading the 'AuriServe' module synchronously at least once " +
			'at the beginning of your plugin to catch the context.'
	);
}

/** The AuriServe API Registry. */
export default api;
