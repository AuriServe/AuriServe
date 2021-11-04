import path from 'path';
import { promises as fs, constants as fsc } from 'fs';
import { Format, assert, assertEq, isType } from 'common';

import Logger from '../Logger';
import Watcher from './Watcher';
import Elements from '../Elements';
import Properties from './model/Properties';
import PluginBindings from './PluginBindings';

/** Represents a plugin. */
export interface Plugin {
	name: string;
	author: string;
	identifier: string;
	description: string;

	sourceRoot?: string;
	sources: {
		scripts: {
			server?: string;
			client?: string;
			editor?: string;
		};
		styles: {
			client?: string;
			editor?: string;
		};
	};

	enabled: boolean;
	hasCover: boolean;
}

/** Manages finding, toggling, and loading plugins.*/
export default class Plugins {

	/** The elements registered by the currently enabled plugins. */
	readonly elements: Elements = new Elements();

	/** A map of plugins indexed by their identifiers. */
	private plugins: Map<string, Plugin> = new Map();

	/** A map of plugin bindings indexed by their identifiers. */
	private bindings: Map<string, PluginBindings> = new Map();

	/** A map of plugin source watchers indexed by their identifiers. */
	private watchers: Map<string, Watcher> = new Map();

	/** A map of callback identifiers to callbacks. */
	private callbacks: Map<string, Function[]> = new Map();

	constructor(private dataPath: string, private watch: boolean) {
		// Create plugins directory if it doesn't exist.
		fs.access(path.join(this.dataPath, 'plugins'), fsc.R_OK).catch(
			() => fs.mkdir(path.join(this.dataPath, 'plugins')));
	};

	/**
	 * If watching is enabled, enabled plugins' source files will be watched,
	 * and plugins will be reloaded when they change.
	 *
	 * @param watch - Whether watching should be enabled.
	 */

	setWatch(watch: boolean) {
		if (this.watch === watch) return;
		this.watch = watch;

		if (this.watch) {
			this.plugins.forEach(p => {	if (p.enabled) this.startWatch(p.identifier); });
		}
		else {
			for(let p of this.watchers.keys()) this.stopWatch(p);
		}
	}

	/** Enables only the plugins specified. */
	async setEnabled(identifiers: string[]) {
		this.plugins.forEach(p => {
			if (identifiers.includes(p.identifier)) this.enable(p.identifier);
			else this.disable(p.identifier);
		});
	}

	/** Enables the plugin specified. */
	async enable(identifier: string) {
		const plugin = this.plugins.get(identifier);
		if (!plugin || plugin.enabled) return;

		plugin.enabled = true;
		if (!plugin.sources.scripts?.server) return;
		const indexPath = path.join(this.dataPath, 'plugins', identifier,
			plugin.sourceRoot ?? '.', plugin.sources.scripts!.server);
		delete require.cache[indexPath];

		const bindings = new PluginBindings();
		this.bindings.set(identifier, bindings);
		require(indexPath)(bindings);
		this.elements.addList(bindings.elements);

		if (this.watch) this.startWatch(identifier);
	}

	/** Disables the plugin specified. */
	async disable(identifier: string) {
		const plugin = this.plugins.get(identifier);
		if (!plugin?.enabled) return;

		plugin.enabled = false;
		if (!plugin.sources.scripts?.server) return;
		const bindings = this.bindings.get(identifier);
		if (!bindings) return;
		this.elements.removeList(bindings.elements);
		this.bindings.delete(identifier);

		this.stopWatch(identifier);
	}

	/** Gets the specified plugin. */
	get(identifier: string) {
		return this.plugins.get(identifier);
	}

	/** Gets a list of enabled plugins. */
	listEnabled() {
		return [ ...this.plugins.values() ].filter(p => p.enabled);
	}

	/** Gets a list of all themes. */
	listAll() {
		return [ ...this.plugins.values() ];
	}

	/** Discover all plugins in the directory and updates the plugins list. */
	async refresh() {
		this.plugins.forEach(p => p.enabled = false);
		this.plugins.clear();

		const enabled = ((await Properties.findOne())?.enabled.plugins ?? []);
		const pluginDirs = await fs.readdir(path.join(this.dataPath, 'plugins'));
		await Promise.all(pluginDirs.map(async dirName => {
			try {
				const plugin = await this.parsePlugin(dirName);
				plugin.enabled = false;
				this.plugins.set(plugin.identifier, plugin);
			}
			catch (e) {
				Logger.error('Encountered an error parsing plugin %s:\n %s', dirName, e);
			}
		}));

		this.setEnabled(enabled);
	}

	/** Synchronizes with the database and then cleans up all plugins. */
	async cleanup() {
		await this.syncToDb();
		this.plugins.forEach(p => this.disable(p.identifier));
		this.plugins.clear();
	}

	bind(event: string, cb: Function) {
		if (!this.callbacks.has(event)) this.callbacks.set(event, []);
		this.callbacks.get(event)!.push(cb);
	}

	unbind(event: string, cb: Function) {
		if (!this.callbacks.has(event)) return;
		this.callbacks.get(event)!.filter(c => c !== cb);
	}

	/** Saves the current list of enabled plugins to the database. */
	private async syncToDb() {
		await Properties.updateOne({}, { $set: { 'enabled.plugins':
			[ ...this.plugins.values() ].filter(p => p.enabled).map(p => p.identifier) } });
	}

	/** Reads a plugin directory and returns a Plugin. Throws if the plugin is invalid. */
	private async parsePlugin(identifier: string): Promise<Plugin> {
		const confPath = path.join(this.dataPath, 'plugins', identifier, 'plugin.json');
		const plugin: Plugin = JSON.parse((await fs.readFile(confPath)).toString());

		assert(isType('string', plugin.identifier, plugin.name, plugin.author, plugin.description),
			'Plugin is missing metadata (identifier, name, author, description).');

		assertEq(identifier, plugin.identifier, 'Plugin identifier does not match directory name.');

		assert(Format.sanitize(plugin.identifier) === plugin.identifier && plugin.identifier.length >= 3,
			'Plugin identifier must be lowercase alphanumeric and at least 3 characters.');

		assert(isType('object', plugin.sources), 'Plugin must contain a sources object.');

		// Assert that all plugin sources exist.
		const pluginRoot = path.join(path.dirname(confPath), plugin.sourceRoot ?? '.');
		await Promise.all(Object.keys(plugin.sources).map(async (sourceKey: string) => {
			assert(sourceKey === 'scripts' || sourceKey === 'styles',
				'Plugin contains invalid key in sources: \'' + sourceKey + '\'.');

			await Promise.all(Object.entries((plugin.sources as any)[sourceKey] as Record<string, string>)
				.map(async ([ source, sourcePath ]) =>
					await fs.access(path.join(pluginRoot, sourcePath!)).catch(_ =>
						assert(false, `Source file \'${sourcePath}\' not found for source \'${sourceKey}.${source}\'.`))));
		}));

		return plugin;
	}

	/** Begins watching a plugin's source files for changes. */
	private startWatch(identifier: string) {
		this.stopWatch(identifier);
		const plugin = this.plugins.get(identifier);
		assert(plugin !== undefined, `Plugin '${identifier}' cannot be watched, as it does not exist.`);

		const paths = Object.values(plugin.sources).reduce<string[]>((paths, source) => {
			paths.push(...(Object.values(source) as string[]).map(sourcePath =>
				path.join(this.dataPath, 'plugins', identifier, plugin.sourceRoot ?? '.', sourcePath)));
			return paths;
		}, []);

		assert(paths.length > 0, `Plugin '${identifier}' has no sources to watch.`);

		const watcher = new Watcher(paths);
		watcher.bind(() => this.watchCallback(identifier));
		this.watchers.set(identifier, watcher);
	}

	/** Stops watching a plugin's source files for changes. */
	private stopWatch(identifier: string) {
		const watcher = this.watchers.get(identifier);
		if (!watcher) return;

		watcher.stop();
		this.watchers.delete(identifier);
	}

	/** Triggers a plugin to reload when it changes. */
	private async watchCallback(identifier: string) {
		Logger.debug(`Plugin '${identifier}' source files changed, reloading.`);

		const plugin = this.plugins.get(identifier);
		assert(plugin && plugin.enabled, 'Shouldn\'t happen! [1]');

		if (plugin.sources.scripts?.server) {
			const indexPath = await fs.realpath(path.resolve(this.dataPath, 'plugins', identifier,
				plugin.sourceRoot ?? '.', plugin.sources.scripts!.server));
			assert(require.cache[indexPath], 'Shouldn\'t happen! [2]');
			delete require.cache[indexPath];

			let bindings = this.bindings.get(identifier);
			assert(bindings !== undefined, 'Shouldn\'t happen! [3]');
			this.elements.removeList(bindings.elements);
			this.bindings.delete(identifier);

			bindings = new PluginBindings();
			this.bindings.set(identifier, bindings);
			require(indexPath)(bindings);
			this.elements.addList(bindings.elements);
			this.callbacks.get('refresh')?.forEach(cb => cb());
		}
	}
}
