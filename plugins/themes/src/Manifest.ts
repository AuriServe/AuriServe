type Version = any;

export interface ThemePreset {
	default?: boolean;
	name?: string;
	values?: Record<string, any>;
}

export default interface Manifest {
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
