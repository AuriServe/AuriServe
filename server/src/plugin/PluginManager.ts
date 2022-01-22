import path from 'path';
import Express from 'express';
import { Database, Statement } from '../SQLite';

import Log from '../Log';
import Plugin from './Plugin';
import RouterApi from './RouterApi';
import PluginLoader from './PluginLoader';
import pluginDependencyOrder from './pluginDependencyOrder';

export type PluginEvent = 'refresh';

/** Manages finding, toggling, and loading plugins.*/
export default class Plugins {
	/** The path to the plugins folder. */
	readonly pluginsPath: string;

	/** The core router API. */
	readonly routerApi: RouterApi;

	/** The plugin API registry. */
	readonly apiRegistry: Map<string, any> = new Map();

	/** A map of plugins indexed by their identifiers. */
	readonly plugins: Map<string, Plugin> = new Map();

	/** The plugin loader which discovers and watches the plugins. */
	private loader: PluginLoader;

	private DATABASE_ADD_PLUGIN: Statement<string> = this.database.prepare(
		'INSERT OR IGNORE INTO plugins(identifier, enabled) VALUES(?, 0)'
	);

	/** A map of callback identifiers to callbacks. */
	private callbacks: Map<PluginEvent, ((event?: any) => void)[]> = new Map();

	constructor(
		dataPath: string,
		watch: boolean,
		app: Express.Application,
		readonly database: Database
	) {
		this.pluginsPath = path.join(dataPath, 'plugins');
		this.routerApi = new RouterApi(app);
		this.loader = new PluginLoader(this, watch);
	}

	async init() {
		this.database
			.prepare(
				`CREATE TABLE IF NOT EXISTS plugins (
					identifier TEXT PRIMARY KEY,
					enabled INTEGER NOT NULL DEFAULT FALSE
				) STRICT`
			)
			.run();

		// TODO: Stupid dumb fake query
		this.database.prepare('DELETE FROM plugins').run();

		await this.loader.refresh();

		// TODO: Stupid dumb fake query
		this.database
			.prepare(
				`INSERT OR REPLACE INTO plugins(identifier, enabled) VALUES('routes', 1), ('preact', 1), ('elements', 1), ('elements-basic', 1), ('themes', 1), ('pages', 1), ('dashboard', 1)`
			)
			.run();

		const enabled = this.database
			.prepare(`SELECT identifier FROM plugins WHERE enabled = 1`)
			.pluck()
			.all();

		this.setEnabled(enabled);
	}

	addPlugin(plugin: Plugin) {
		this.plugins.set(plugin.manifest.identifier, plugin);
		this.DATABASE_ADD_PLUGIN.run(plugin.manifest.identifier);
	}

	reloadPlugin(_identifier: string) {
		this.setEnabled(this.listEnabled().map((plugin) => plugin.manifest.identifier));
	}

	/** Enables only the plugins specified. */
	async setEnabled(identifiers: string[]) {
		this.database.prepare('UPDATE plugins SET enabled = 0').run();
		if (identifiers.length)
			this.database.exec(`
				UPDATE plugins SET enabled = 1 WHERE identifier IN (${identifiers
					.map((i) => `'${i}'`)
					.join(', ')})`);

		this.plugins.set;
		const disableOrder = pluginDependencyOrder(
			[...this.plugins.values()]
				.filter((plugin) => plugin.isEnabled())
				.map((plugin) => ({
					identifier: plugin.manifest.identifier,
					version: plugin.manifest.version,
					depends: plugin.manifest.depends,
				}))
		).reverse();

		console.log('disabling', disableOrder);

		for (const plugin of disableOrder) {
			if (this.plugins.get(plugin)?.disable()) this.loader.pluginDisabled(plugin);
		}

		const enableOrder = pluginDependencyOrder(
			identifiers
				.filter((identifier) => {
					if (this.plugins.has(identifier)) return true;
					Log.error(`Enabled plugin '${identifier}' not found.`);
					return false;
				})
				.map((identifier) => this.plugins.get(identifier) as Plugin)
				.map((plugins) => ({
					identifier: plugins.manifest.identifier,
					version: plugins.manifest.version,
					depends: plugins.manifest.depends,
				}))
		);

		console.log('enabling', enableOrder);

		for (const plugin of enableOrder) {
			if (await this.plugins.get(plugin)?.enable()) this.loader.pluginEnabled(plugin);
		}
	}

	/** Gets the specified plugin. */
	get(identifier: string) {
		return this.plugins.get(identifier);
	}

	/** Gets a list of all themes. */
	listAll() {
		return [...this.plugins.values()];
	}

	/** Gets a list of enabled plugins. */
	listEnabled() {
		return this.listAll().filter((p) => p.isEnabled());
	}

	/** Synchronizes with the database and then cleans up all plugins. */
	async cleanup() {
		this.plugins.forEach((plugin) => plugin.disable(true));
		this.plugins.clear();
	}

	bind(event: PluginEvent, cb: (event?: any) => void) {
		if (!this.callbacks.has(event)) this.callbacks.set(event, []);
		this.callbacks.get(event)!.push(cb);
	}

	unbind(event: PluginEvent, cb: (event?: any) => void) {
		if (!this.callbacks.has(event)) return;
		this.callbacks.get(event)!.filter((c) => c !== cb);
	}

	emit(event: string, eventObj: any) {
		this.plugins.forEach((plugin) => {
			plugin.emit(event, eventObj);
		});
	}
}
