import path from 'path';
import { Format } from 'common';
import { promises as fs, constants as fsc } from 'fs';

import Logger from '../Logger';
import Elements from '../Elements';
import Properties from './model/Properties';
import PluginBindings from './PluginBindings';

/** Represents one plugin. */
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

/** Manages finding, toggling, and building plugins.*/
export default class Plugins {
	readonly elements: Elements = new Elements();
	private plugins: Map<string, Plugin> = new Map();
	private bindings: Map<string, PluginBindings> = new Map();

	constructor(private dataPath: string) {
		// Create plugins directory if it doesn't exist.
		fs.access(path.join(this.dataPath, 'plugins'), fsc.R_OK).catch(
			() => fs.mkdir(path.join(this.dataPath, 'plugins')));
	};

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

	/** Saves the current list of enabled plugins to the database. */
	private async syncToDb() {
		await Properties.updateOne({}, { $set: { 'enabled.plugins':
			[ ...this.plugins.values() ].filter(p => p.enabled).map(p => p.identifier) } });
	}

	/** Reads a plugin directory and returns a Plugin. Throws if the plugin is invalid. */
	private async parsePlugin(identifier: string): Promise<Plugin> {
		const confPath = path.join(this.dataPath, 'plugins', identifier, 'plugin.json');
		const plugin: Plugin = JSON.parse((await fs.readFile(confPath)).toString());

		// Ensure that the plugin has the basic metadata.
		if (typeof plugin.identifier !== 'string' || typeof plugin.name !== 'string' ||
		typeof plugin.author !== 'string' || typeof plugin.author !== 'string')
			throw 'Theme is missing metadata. (identifier, name, author, description)';

		// Ensure that the folder name matches the plugin identifier.
		if (identifier !== plugin.identifier) throw 'Plugin directory name must match plugin identifier.';

		// Ensure that the identifier is formatted properly.
		if (Format.sanitize(plugin.identifier) !== plugin.identifier && plugin.identifier.length >= 3)
			throw 'Plugin identifier must be lowercase alphanumeric, and >= 3 characters.';

		// Assert that the plugin has a sources object.
		if (!plugin.sources || typeof plugin.sources !== 'object')
			throw 'Plugin must contain a sources object.';

		// Assert that all plugin sources exist.
		const pluginRoot = path.join(path.dirname(confPath), plugin.sourceRoot ?? '.');
		await Promise.all(Object.keys(plugin.sources).map(async (sourceKey: string) => {
			if (sourceKey !== 'scripts' && sourceKey !== 'styles')
				throw 'Plugin contains invalid key in sources, \'' + sourceKey + '\'.';

			await Promise.all(Object.entries((plugin.sources as any)[sourceKey] as Record<string, string>)
				.map(async ([ source, sourcePath ]) => {
					try { await fs.access(path.join(pluginRoot, sourcePath!)); }
					catch (e) { throw `Source file \'${sourcePath}\' not found for source \'${sourceKey}.${source}\'.`; };
				})
			);
		}));

		return plugin;
	}
}
