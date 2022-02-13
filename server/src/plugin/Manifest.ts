import { Version } from 'common';

export interface EntryTree {
	[entry: string]: string | EntryTree;
}

export interface Manifest {
	name?: string;
	identifier: string;
	description?: string;

	author: string;
	version: string;
	depends?: string[];

	entry: string | EntryTree;
	watch?: string[];
}

export type Dependency = { identifier: string; version: string };

export type ParsedManifest = Omit<Manifest, 'entry' | 'watch' | 'depends' | 'version'> & {
	version: Version;

	depends: Dependency[];

	entry: Record<string, string>;
	watch: string[];
};
