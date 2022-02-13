import { resolve } from 'path';

import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

export default function (_: any, argv: { mode: string }) {
	const prod = argv.mode === 'production';

	const baseConfig = {
		stats: 'errors-warnings',
		devtool: prod ? undefined : 'source-map',
		context: resolve(__dirname, 'src'),

		resolve: {
			extensions: ['.ts', '.js', '.tsx', '.jsx'],
		},

		// optimization: {
		// 	usedExports: true,
		// },
	};

	const serverConfig = {
		...baseConfig,

		name: 'server',
		target: 'node',
		entry: './Server/Main.ts',

		output: {
			path: resolve(__dirname, 'build'),
			filename: 'server.js',
		},

		plugins: [
			new ForkTsCheckerPlugin({
				typescript: { configFile: '../tsconfig.json' },
				eslint: { files: './**/*.{ts,tsx}' },
			}),
		],

		module: {
			rules: [
				{
					test: /\.[t|j]sx?$/,
					loader: 'babel-loader',
					options: {
						babelrc: false,
						cacheDirectory: true,
						presets: [
							[
								'@babel/preset-typescript',
								{
									allExtensions: true,
								},
							],
							[
								'@babel/preset-env',
								{
									targets: {
										node: '10.20.1',
									},
								},
							],
						],
					},
				},
			],
		},
	};

	const dashboardConfig = {
		...baseConfig,

		name: 'dashboard',
		entry: './Dashboard/Main.ts',

		externals: {
			'dashboard': 'Dashboard',
			'preact': '__AS_PREACT',
			'preact/hooks': '__AS_PREACT_HOOKS',
			'react': '__AS_PREACT_COMPAT',
			'react-dom': '__AS_PREACT_COMPAT',
		},

		output: {
			path: resolve(__dirname, 'build'),
			filename: 'dashboard.js',
		},

		module: {
			rules: [
				{
					test: /\.[t|j]sx?$/,
					loader: 'babel-loader',
					options: {
						babelrc: false,
						cacheDirectory: true,
						presets: [
							[
								'@babel/preset-typescript',
								{
									isTSX: true,
									allExtensions: true,
									pragma: 'h',
								},
							],
							[
								'@babel/preset-env',
								{
									targets: {
										chrome: 90,
									},
								},
							],
						],
						plugins: [['@babel/transform-react-jsx', { pragma: '__AS_PREACT.h' }]],
					},
				},
			],
		},
	};

	return [serverConfig, dashboardConfig];
}
