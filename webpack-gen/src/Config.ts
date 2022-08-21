export default interface Config {
	mode?: 'development' | 'production';
	manifestPath?: string;
	tsConfigPath?: string;

	types?: boolean | string;

	tsx?: boolean;

	postcss?: any;

	noPreactAlias?: string[];

	base?: Record<string, any>;
	export?: Record<string, boolean | string | Record<string, any>> | string[];
}
