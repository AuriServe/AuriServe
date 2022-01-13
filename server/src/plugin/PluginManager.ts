import path from 'path';
import Express from 'express';
import { assert } from 'common';

import Plugin from './Plugin';
import RouterApi from './RouterApi';
import PluginLoader from './PluginLoader';
import Properties from '../data/model/Properties';
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

	/** A map of callback identifiers to callbacks. */
	private callbacks: Map<PluginEvent, ((event?: any) => void)[]> = new Map();

	constructor(dataPath: string, watch: boolean, app: Express.Application) {
		this.pluginsPath = path.join(dataPath, 'plugins');
		this.routerApi = new RouterApi(app);
		this.loader = new PluginLoader(this, watch);
	}

	async init() {
		const [properties] = await Promise.all([
			Properties.findOne({}),
			this.loader.refresh(),
		]);

		this.setEnabled(properties?.enabled?.plugins ?? []);
	}

	addPlugin(plugin: Plugin) {
		this.plugins.set(plugin.manifest.identifier, plugin);
	}

	reloadPlugin(_identifier: string) {
		this.setEnabled(this.listEnabled().map((plugin) => plugin.manifest.identifier));
	}

	/** Enables only the plugins specified. */
	async setEnabled(identifiers: string[]) {
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
				.map((identifier) => {
					const plugin = this.plugins.get(identifier);
					assert(plugin, `Plugin not found: '${identifier}'.`);
					return plugin;
				})
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
		await this.syncToDb();
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

	/** Saves the current list of enabled plugins to the database. */
	private async syncToDb() {
		await Properties.updateOne(
			{},
			{
				$set: { 'enabled.plugins': this.listEnabled().map((p) => p.manifest.identifier) },
			}
		);
	}
}
