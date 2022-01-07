import path from 'path';
import { assert, assertSchema } from 'common';
import { promises as fs, constants as fsc } from 'fs';

import yaml from 'js-yaml';

import Plugin from './Plugin';
import Logger from '../Logger';
import Manifest from './Manifest';
import Watcher from '../data/Watcher';
import PluginManager from './PluginManager';

/** Manages finding, toggling, and loading plugins.*/
export default class PluginLoader {

	/** A map of plugin source watchers indexed by their identifiers. */
	private watchers: Map<string, Watcher> = new Map();

	constructor(private manager: PluginManager, private watch: boolean) {
		// Create plugins directory if it doesn't exist.
		fs.access(this.manager.pluginsPath, fsc.R_OK).catch(() => fs.mkdir(this.manager.pluginsPath));
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

		if (this.watch) this.manager.listEnabled().forEach(plugin => this.startWatch(plugin.identifier));
		else for(let p of this.watchers.keys()) this.stopWatch(p);
	}

	/** Discover all plugins in the directory and updates the plugins list. */
	async refresh() {
		const pluginDirs = await fs.readdir(this.manager.pluginsPath);
		await Promise.all(pluginDirs.map(async dirName => await this.loadPlugin(dirName)));
	}

	pluginEnabled(identifier: string) {
		this.startWatch(identifier);
	}

	pluginDisabled(identifier: string) {
		this.stopWatch(identifier);
	}

	/** Reads a plugin directory and returns a Plugin. Throws if the plugin is invalid. */
	private async loadPlugin(dirName: string) {
		try {
			let manifestStr = await fs.readFile(path.join(this.manager.pluginsPath, dirName, 'manifest.yaml'), 'utf8')
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

			assert(dirName === manifest.identifier, `Folder name must be '${manifest.identifier}'.`);

			let sourcePaths = Object.values(manifest.entry).reduce<string[]>((paths, entry) => {
				if (typeof entry === 'string') paths.push(path.join(this.manager.pluginsPath, dirName, entry));
				else paths.push(...(Object.values(entry) as string[]).map(sourcePath =>
					path.join(this.manager.pluginsPath, dirName, sourcePath)));
				return paths;
			}, []);

			await Promise.all(sourcePaths.map(async (sourcePath: string) =>
				await fs.access(sourcePath).catch(_ => assert(false, `Source file '${sourcePath}' not found.`))));

			this.manager.addPlugin(new Plugin(this.manager, manifest));
		}
		catch (e) {
			Logger.error('Encountered an error parsing plugin %s:\n %s', dirName, e);
		}
	}

	/** Begins watching a plugin's source files for changes. */
	private startWatch(identifier: string) {
		this.stopWatch(identifier);
		const plugin = this.manager.get(identifier);
		assert(plugin !== undefined, `Plugin '${identifier}' cannot be watched, as it does not exist.`);
		assert(plugin.manifest.watch && plugin.manifest.watch.length > 0,
			`Plugin '${identifier}' has no sources to watch.`);

		const watcher = new Watcher(plugin.manifest.watch
			.map(file => path.join(this.manager.pluginsPath, identifier, file)));

		watcher.bind(async () => {
			Logger.debug(`Plugin '${identifier}' source files changed, reloading.`);
			this.manager.reloadPlugin(identifier);
		});

		this.watchers.set(identifier, watcher);
	}

	/** Stops watching a plugin's source files for changes. */
	private stopWatch(identifier: string) {
		const watcher = this.watchers.get(identifier);
		if (!watcher) return;

		watcher.stop();
		this.watchers.delete(identifier);
	}
}
