export type ThemePreprocessor = 'sass' | '';

export default interface ThemeConfig {
	identifier: string;

	name: string;
	author: string;
	description: string;

	preprocessor: ThemePreprocessor;
}
