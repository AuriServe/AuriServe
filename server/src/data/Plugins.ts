import path from 'path';
import { assert, assertSchema } from 'common';
import { promises as fs, constants as fsc } from 'fs';

import yaml from 'js-yaml';

import Logger from '../Logger';
import Watcher from './Watcher';
import Elements from '../Elements';
import Properties from './model/Properties';
import PluginBindings from './PluginBindings';

interface Manifest {
	identifier: string;
	name?: string;
	description?: string;
	author: string;
	version: string;

	entry: {
		server?: string | { script?: string };
		client?: string | { script?: string; style?: string };
	};

	watch?: string[];
}

/** Represents a plugin. */
export interface Plugin {
	identifier: string;
	name?: string;
	description?: string;
	author: string;

	version: string;

	entry: {
		server?: {
			script?: string;
		};
		client?: {
			script?: string;
			style?: string;
		};
	};

	watch: string[];
	enabled: boolean;
}

/** Manages finding, toggling, and loading plugins.*/
export default class Plugins {

	/** The elements registered by the currently enabled plugins. */
	readonly elements: Elements = new Elements();

	private pluginsPath: string;

	/** A map of plugins indexed by their identifiers. */
	private plugins: Map<string, Plugin> = new Map();

	/** A map of plugin bindings indexed by their identifiers. */
	private bindings: Map<string, PluginBindings> = new Map();

	/** A map of plugin source watchers indexed by their identifiers. */
	private watchers: Map<string, Watcher> = new Map();

	/** A map of callback identifiers to callbacks. */
	private callbacks: Map<string, Function[]> = new Map();

	constructor(dataPath: string, private watch: boolean) {
		this.pluginsPath = path.join(dataPath, 'plugins');

		// Create plugins directory if it doesn't exist.
		fs.access(this.pluginsPath, fsc.R_OK).catch(() => fs.mkdir(this.pluginsPath));
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
		if (!plugin.entry.server?.script) return;
		const indexPath = path.join(this.pluginsPath, identifier, plugin.entry.server.script);
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
		if (!plugin.entry.server?.script) return;
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
		const pluginDirs = await fs.readdir(path.join(this.pluginsPath));
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
		let manifestStr = await fs.readFile(path.join(this.pluginsPath, identifier, 'manifest.yaml'), 'utf8')
			.catch(() => assert(false, 'Missing manifest.yaml.')) as string;

		let manifest: Manifest;
		try {
			manifest = yaml.load(manifestStr, { schema: yaml.FAILSAFE_SCHEMA }) as Manifest;
		}
		catch (e) {
			assert(e instanceof yaml.YAMLException, `YAML parsing error: ${e}`);
			assert(false, `Invalid manifest.yaml: ${e.reason} at ${e.mark.line}:${e.mark.column}`);
		}


		assertSchema<Manifest>(manifest, {
			identifier: 'string',
			name: 'string',
			description: 'string',
			version: 'string',
			author: 'string',
			entry: {
				server: [ 'undefined', 'string', { script: [ 'undefined', 'string' ] } ],
				client: [ 'undefined', 'string', { script: [ 'undefined', 'string' ], style: [ 'undefined', 'string' ] } ]
			},
			watch: [ 'undefined', 'string[]' ]
		}, 'Invalid manifest.yaml');
		assert(identifier === manifest.identifier, `Folder name must be '${manifest.identifier}'.`)

		let sourcePaths = Object.values(manifest.entry).reduce<string[]>((paths, entry) => {
			if (typeof entry === 'string') paths.push(path.join(this.pluginsPath, identifier, entry));
			else paths.push(...(Object.values(entry) as string[]).map(sourcePath =>
				path.join(this.pluginsPath, identifier, sourcePath)));
			return paths;
		}, []);

		await Promise.all(sourcePaths.map(async (sourcePath: string) =>
			await fs.access(sourcePath).catch(_ => assert(false, `Source file '${sourcePath}' not found.`))));

		let plugin: Plugin = {
			identifier: manifest.identifier,
			name: manifest.name,
			description: manifest.description,
			version: manifest.version,
			author: manifest.author,
			entry: Object.fromEntries(Object.entries(manifest.entry ?? []).map(([ entry, val ]) =>
				[ entry, typeof val === 'string' ? { script: val } : val ])),
			enabled: false,
			watch: manifest.watch ? manifest.watch.map(end => path.join(this.pluginsPath, identifier, end)) : sourcePaths
		};

		return plugin;
	}

	/** Begins watching a plugin's source files for changes. */
	private startWatch(identifier: string) {
		this.stopWatch(identifier);
		const plugin = this.plugins.get(identifier);
		assert(plugin !== undefined, `Plugin '${identifier}' cannot be watched, as it does not exist.`);
		assert(plugin.watch.length > 0, `Plugin '${identifier}' has no sources to watch.`);

		const watcher = new Watcher(plugin.watch);
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

		if (plugin.entry.server?.script) {
			const indexPath = await fs.realpath(path.resolve(this.pluginsPath, identifier, plugin.entry.server.script));
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
