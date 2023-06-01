import type { Database } from 'better-sqlite3';

import type Log from './log';
import type Yaml from './yaml';
import type Router from './router';
import type * as Util from './util';
import type { PluginManifest } from './plugin';
import type { WatcherConstructor } from './watcher';

/** The Auriserve API. */
export interface API {

	/** Provides access to the underlying Router, for handling incoming requests. */
	router: Router;

	/** Provides access to advanced logging functionality using log4js. */
	log: Log;

	/** YAML parsing and stringifying. */
	YAML: Yaml;

	/** Currently loaded plugin manifests. */
	plugins: Map<string, PluginManifest>;

	/** Watches files for changes. */
	Watcher: WatcherConstructor;

	/** Provides access to the underlying MySQL database, for high-preformance data storage. */
	database: Database;

	/** The auriserve config file. */
	config: Record<string, any>;

	/** The path to the site-data folder. */
	dataPath: string;

	/** Merges string CSS classes. Anything falsey will be ignored. */
	merge: typeof Util.merge;

	/** Asserts a condition, throwing an ensure error if the condition is false. */
	ensure: typeof Util.ensure;

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

export default api;

export const router = api.router;

export const log = api.log;

export const YAML: Yaml = api.YAML;

export const plugins = api.plugins;

export const Watcher = api.Watcher;

export const database: Database = api.database;

export const config = api.config;

export const dataPath = api.dataPath;

export const merge = api.merge;

export const ensure = api.ensure;

export const on = api.on;

export const once = api.once;

export const off = api.off;

export const emit = api.emit;
