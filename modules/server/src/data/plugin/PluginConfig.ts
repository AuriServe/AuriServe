export interface PluginSources {
	script?: string;
	style?: string;
}

export default interface PluginConfig {
	identifier: string;

	name: string;
	author: string;
	description: string;

	sourceRoot: string;
	sources: {
		server:  PluginSources;
		client?: PluginSources;
		editor?: PluginSources;
	};
}
