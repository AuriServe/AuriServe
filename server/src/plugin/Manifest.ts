export interface Manifest {
	name?: string;
	identifier: string;
	description?: string;

	author: string;
	version: string;
	depends?: string[];

	entry: {
		server?: string | { script?: string };
		client?: string | { script?: string; style?: string };
	};
	watch?: string[];
}

export type Dependency = { identifier: string; version: string };

export type ParsedManifest = Omit<Manifest, 'entry' | 'watch' | 'depends'> & {
	depends: Dependency[];

	entry: {
		server: { script?: string };
		client: { script?: string; style?: string };
	};

	watch: string[];
};
