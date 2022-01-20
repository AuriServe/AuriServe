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

	version: Version;
	author: string;
	entry?:
		| { client?: string | { style?: string; script?: string }; layout?: string }
		| string;

	options?: { [key: string]: any; key: string; label?: string; type: string }[];
	presets?: Record<string, ThemePreset>;
}

export type ParsedManifest = Omit<Manifest, 'entry'> & {
	entry: {
		style?: string;
		head?: string;
		script?: string;
	};
};
