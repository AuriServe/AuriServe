import { Version } from 'common';

export interface PluginManifest {
	name?: string;
	identifier: string;
	description?: string;
	icon?: string;

	author: string;
	version: Version;
	type?: string;

	depends: { identifier: string; version: string }[];

	entry: Record<string, string>;
	watch: string[];
}
