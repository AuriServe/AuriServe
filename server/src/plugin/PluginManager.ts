import path from 'path';
import Express from 'express';

import Log from '../util/Log';
import Plugin from './Plugin';
import RouterApi from './RouterApi';
import { Manifest } from './Manifest';
import { Database } from '../util/SQLite';
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
	readonly apiRegistry: Map<string, Record<string, any>> = new Map();

	/** A map of plugins indexed by their identifiers. */
	readonly plugins: Map<string, Plugin> = new Map();

	/** A map of plugin manifests indexed by their identifiers. */
	readonly manifests: Map<string, Manifest> = new Map();

	/** The plugin loader which discovers and watches the plugins. */
	private loader: PluginLoader;

	/** A map of callback identifiers to callbacks. */
	private callbacks: Map<PluginEvent, ((event?: any) => void)[]> = new Map();

	constructor(
		readonly config: Record<string, any>,
		readonly dataPath: string,
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
				)`
			)
			.run();

		// TODO: Stupid dumb fake query
		// this.database.prepare('DELETE FROM plugins').run();

		await this.loader.refresh();

		// TODO: Stupid dumb fake query
		// this.database
		// 	.prepare(
		// 		`INSERT OR REPLACE INTO plugins(identifier, enabled) VALUES('routes', 1), ('preact', 1), ('elements', 1), ('elements-base', 1), ('themes', 0), ('pages', 0), ('dashboard', 1), ('hydrated', 1), ('page-editor', 0),
		// 		('analytics', 0), ('users', 1), ('tax_calculator', 1)`
		// 	)
		// 	.run();

		const enabled = this.database
			.prepare(`SELECT identifier FROM plugins WHERE enabled = 1`)
			.pluck()
			.all();

		this.setEnabled(enabled);
	}

	addPlugin(plugin: Plugin) {
		this.plugins.set(plugin.manifest.identifier, plugin);

		this.database
			.prepare('INSERT OR IGNORE INTO plugins(identifier, enabled) VALUES(?, 0)')
			.run(plugin.manifest.identifier);
	}

	reloadPlugin(_identifier: string) {
		this.setEnabled(this.listEnabled().map((plugin) => plugin.manifest.identifier));
	}

	/** Enables only the plugins specified. */
	async setEnabled(identifiers: string[], sync = true) {
		if (sync) {
			this.database.prepare('UPDATE plugins SET enabled = 0').run();
			if (identifiers.length)
				this.database.exec(`
				UPDATE plugins SET enabled = 1 WHERE identifier IN (${identifiers
					.map((i) => `'${i}'`)
					.join(', ')})`);
		}

		const disableOrder = pluginDependencyOrder(
			[...this.plugins.values()]
				.filter((plugin) => plugin.isEnabled())
				.map((plugin) => ({
					identifier: plugin.manifest.identifier,
					version: plugin.manifest.version,
					depends: plugin.manifest.depends,
				}))
		).reverse();

		if (disableOrder.length) {
			Log.debug(
				`Plugins: Disabling ${disableOrder.map((str) => `'${str}'`).join(', ')}.`
			);

			for (const plugin of disableOrder) {
				if (this.plugins.get(plugin)?.disable()) this.loader.pluginDisabled(plugin);
			}
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

		if (enableOrder.length) {
			Log.debug(`Plugins: Enabling ${enableOrder.map((str) => `'${str}'`).join(', ')}.`);

			for (const plugin of enableOrder) {
				if (await this.plugins.get(plugin)?.enable()) this.loader.pluginEnabled(plugin);
			}
		}

		for (const plugin of enableOrder) {
			this.plugins.get(plugin)?.emit('loaded', {});
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

	async cleanup() {
		await this.setEnabled([], false);
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
