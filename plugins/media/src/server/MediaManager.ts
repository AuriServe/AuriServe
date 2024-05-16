import path from 'path';
import { promises as fs } from 'fs';
import auriserve, { config, dataPath, log } from 'auriserve';
import { PluginManifest } from 'auriserve/plugin';

export const MEDIA_PATH = '/media';
export const VARIANT_PATH = '/variant';

export default class MediaManager {

	/**
	 * All of the directories found by the media manager to contain media items.
	 * The keys are the 'owners' of the media paths, and the values are the paths relative to `dataPath`.
	 */

	private mediaDirectories = new Map<string, string>;

	constructor() {
		auriserve.once('loaded', () => this.initialize());
	}

	private async initialize() {
		// Create the client media directory if it doesn't exist.
		try { await fs.access(path.join(dataPath, MEDIA_PATH)); } catch (e) {
			await fs.mkdir(path.join(dataPath, MEDIA_PATH)); }

		// Find all of the media directories.
		this.mediaDirectories.set('media', MEDIA_PATH);
		for (let p of auriserve.plugins.values()) {
			let plugin: PluginManifest & { media?: string } = p;
			if (plugin.media) this.mediaDirectories.set(`plugin:${plugin.identifier}`,
				path.join('plugins', plugin.identifier, plugin.media));
		}

		// Ensure the directories exist, and create the variant directories if they don't exist.
		for (let [ owner, directory ] of this.mediaDirectories.entries()) {
			let absolutePath = path.join(dataPath, directory);

			try {
				await fs.access(absolutePath);
			}
			catch (e) {
				log.error('[Media] Media directory \'%s\' (%s) not found!', owner, absolutePath);
				this.mediaDirectories.delete(owner);
				continue;
			}

			try { await fs.access(path.join(absolutePath, VARIANT_PATH)); } catch (e) {
				await fs.mkdir(path.join(absolutePath, VARIANT_PATH)); }
		}

		// Find all of the media items in the folders, and compare them to the

		log.debug('[Media] Found %s media %s: %s',
			this.mediaDirectories.size, this.mediaDirectories.size === 1 ? 'directory' : 'directories',
			[ ...this.mediaDirectories.values() ].map(path => `'${path}'`).join(', '));



			// const allFiles = await fs.readdir(MEDIA_DIR, { withFileTypes: true });

			// // Ingest new / modified media files.

			// const toIngest = (await Promise.all(allFiles.map(async (file): Promise<[ string, boolean ]> => {
			// 	if (file.isDirectory()) return [ file.name, false ];
			// 	const filePath = path.join(MEDIA_DIR, file.name);
			// 	return [ file.name, !Database.mediaHashMatches(file.name, await fileHash(filePath)) ];
			// }))).filter(([ _, shouldIngest ]) => shouldIngest).map(([ file ]) => file);

			// console.log('Loaded!', auriserve.plugins);
	}
}
