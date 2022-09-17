import { Version } from 'common';

export interface EntryTree {
	[entry: string]: string | EntryTree;
}

export interface Manifest {
	name?: string;
	identifier: string;
	description?: string;
	icon?: string;

	author: string;
	version: string;
	depends: Record<string, string>;

	entry: string | EntryTree;
	watch?: string[];
}

export type ParsedManifest = Omit<Manifest, 'entry' | 'watch' | 'version'> & {
	version: Version;

	entry: Record<string, string>;
	watch: string[];
};
