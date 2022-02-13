import { Version } from 'common';

export interface PluginManifest {
	name?: string;
	identifier: string;
	description?: string;

	author: string;
	version: Version;
	depends: { identifier: string; version: string }[];

	entry: Record<string, string>;
	watch: string[];
}
