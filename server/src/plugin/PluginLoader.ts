import path from 'path';
import { assert, AssertError } from 'common';
import { promises as fs, constants as fsc } from 'fs';

import Plugin from './Plugin';
import YAML from '../util/YAML';
import Logger from '../util/Log';
import Watcher from '../util/Watcher';
import PluginManager from './PluginManager';
import { ManifestSchema } from './Manifest';

/** Manages finding, toggling, and loading plugins.*/
export default class PluginLoader {
	/** A map of plugin source watchers indexed by their identifiers. */
	private watchers: Map<string, Watcher> = new Map();

	constructor(private manager: PluginManager, private watch: boolean) {
		// Create plugins directory if it doesn't exist.
		fs.access(this.manager.pluginsPath, fsc.R_OK).catch(() =>
			fs.mkdir(this.manager.pluginsPath)
		);
	}

	/**
	 * If watching is enabled, enabled plugins' source files will be watched,
	 * and plugins will be reloaded when they change.
	 *
	 * @param watch - Whether watching should be enabled.
	 */

	setWatch(watch: boolean) {
		if (this.watch === watch) return;
		this.watch = watch;

		if (this.watch)
			this.manager
				.listEnabled()
				.forEach((plugin) => this.startWatch(plugin.manifest.identifier));
		else for (const p of this.watchers.keys()) this.stopWatch(p);
	}

	/** Discover all plugins in the directory and updates the plugins list. */
	async refresh() {
		const pluginDirs = await fs.readdir(this.manager.pluginsPath);
		await Promise.all(pluginDirs.map(async (dirName) => await this.loadPlugin(dirName)));
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
			const manifestStr = (await fs
				.readFile(path.join(this.manager.pluginsPath, dirName, 'manifest.yaml'), 'utf8')
				.catch(() => assert(false, 'Missing manifest.yaml.'))) as string;

			const manifest = ManifestSchema.parse(YAML.parse(manifestStr));

			assert(
				dirName === manifest.identifier,
				`Folder name must be '${manifest.identifier}'.`
			);

			await Promise.all(
				manifest.watch.map((sourcePath: string) =>
					fs
						.access(path.join(this.manager.pluginsPath, manifest.identifier, sourcePath))
						.catch((_) =>
							assert(
								false,
								`Source/watch file '${path.join(
									'plugins',
									manifest.identifier,
									sourcePath
								)}' not found.`
							)
						)
				)
			);

			this.manager.addPlugin(new Plugin(this.manager, manifest));
		} catch (e) {
			if (e instanceof AssertError) {
				if (!e.message.includes('Missing manifest.yaml'))
					Logger.error(`Failed to load plugin '${dirName}': ${e.message}`);
			} else {
				Logger.error('Encountered an error loading plugin %s:\n %s', dirName, e);
			}
		}
	}

	/** Begins watching a plugin's source files for changes. */
	private startWatch(identifier: string) {
		this.stopWatch(identifier);
		const plugin = this.manager.get(identifier);

		assert(
			plugin !== undefined,
			`Plugin '${identifier}' cannot be watched, as it does not exist.`
		);

		if (!plugin.manifest.watch.length) return;

		const watcher = new Watcher(
			plugin.manifest.watch.map((file) =>
				path.join(this.manager.pluginsPath, identifier, file)
			)
		);

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
