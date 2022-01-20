import path from 'path';
import as from 'auriserve';
import { promises as fs } from 'fs';

import { ParsedManifest } from './Manifest';
import parseCSS from './CSSParser';
import parseHTML from './HTMLParser';
import ThemeManager from './ThemeManager';

const { log } = as.core;

export default class Theme {
	private options: any;

	constructor(private manager: ThemeManager, readonly manifest: ParsedManifest) {
		let defPreset = Object.keys(manifest.presets ?? {})[0];
		if (manifest.presets) {
			for (const [identifier, preset] of Object.entries(manifest.presets)) {
				if (preset.default) {
					defPreset = identifier;
					break;
				}
			}
		}

		this.options = {};
		if (defPreset) {
			for (const [key, value] of Object.entries(
				manifest.presets![defPreset].values ?? {}
			)) {
				let addTo = this.options;
				const keyParts = key.split('.');
				if (key.length > 1) {
					for (let i = 0; i < keyParts.length - 1; i++) {
						if (!addTo[keyParts[i]]) addTo[keyParts[i]] = {};
						addTo = addTo[keyParts[i]];
					}
				}

				const option = manifest.options!.find((option) => option.key === key)!;

				switch (option.type) {
					case 'color_swatch':
						addTo[keyParts[keyParts.length - 1]] = option.swatches[value];
						break;
					case 'number':
						addTo[keyParts[keyParts.length - 1]] = Number.parseInt(value, 10);
						break;
					case 'option':
						addTo[keyParts[keyParts.length - 1]] = value;
						break;
					default:
						log.warn('Unhandled option type:', option.type);
				}
			}
		}
	}

	async buildCSS(): Promise<string> {
		if (!this.manifest.entry.style) return '';
		return parseCSS(
			await fs.readFile(
				path.join(
					this.manager.themeDir,
					this.manifest.identifier,
					this.manifest.entry.style
				),
				'utf8'
			),
			this.options
		);
	}

	async buildHead(): Promise<string> {
		if (!this.manifest.entry.head) return '';
		return parseHTML(
			await fs.readFile(
				path.join(
					this.manager.themeDir,
					this.manifest.identifier,
					this.manifest.entry.head
				),
				'utf8'
			),
			this.options
		);
	}
}
