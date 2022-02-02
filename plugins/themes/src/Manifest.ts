type Version = any;

export interface ThemePreset {
	default?: boolean;
	name?: string;
	values?: Record<string, any>;
}

export interface Manifest {
	name?: string;
	identifier: string;
	description?: string;

	author: string;
	version: Version;

	entry:
		| string
		| {
				style: string;
				head: string;
		  };
	watch?: string[];

	options?: { [key: string]: any; key: string; label?: string; type: string }[];
	presets?: Record<string, ThemePreset>;
}

export type ParsedManifest = Omit<Manifest, 'entry' | 'watch'> & {
	entry: {
		style?: string;
		head?: string;
		// script?: string;
	};
	watch: string[];
};
