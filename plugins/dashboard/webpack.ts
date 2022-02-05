/* eslint-disable */

import { resolve } from 'path';

const LiveReloadPlugin = require('webpack-livereload-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export default function (_: {}, argv: { mode: string; analyze: boolean }) {
	const mode: 'production' | 'development' = (argv.mode as any) ?? 'development';
	const analyze = argv.analyze;

	process.env.NODE_ENV = mode ?? 'development';

	const server = {
		mode,
		stats: 'errors-warnings',
		devtool: mode === 'production' ? undefined : 'source-map',

		name: 'server',
		target: 'node',
		context: resolve(__dirname, 'src'),
		entry: './Server/Main.ts',

		externals: {
			'preact': '__AS_PREACT',
			'preact/hooks': '__AS_PREACT_HOOKS',
			'preact/compat': '__AS_PREACT_COMPAT',
		},

		output: {
			path: resolve(__dirname, 'dist'),
			filename: 'server.js',
		},

		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
							'@babel/preset-typescript',
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

		optimization: {
			usedExports: true,
		},
	};

	const dashboard = {
		mode,
		stats: 'errors-warnings',
		devtool: mode === 'production' ? undefined : 'source-map',

		name: 'dashboard',
		context: resolve(__dirname, 'src'),
		entry: './Dashboard/Main.tsx',

		output: {
			path: resolve(__dirname, './dist'),
			filename: 'main.js',
		},

		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
			alias: {
				'@res': resolve(__dirname, 'res', 'Dashboard'),
				'react': 'preact/compat',
				'react-dom': 'preact/compat',
			},
		},

		plugins: [
			new ForkTsCheckerPlugin({
				typescript: {
					configFile: resolve(__dirname, 'tsconfig.json'),
				},
				eslint: {
					files: './**/*.{ts,tsx}',
				},
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
									isTSX: true,
									allExtensions: true,
									jsxPragma: 'h',
								},
							],
							// [
							// 	'@babel/preset-env',
							// 	{
							// 		modules: false,
							// 		useBuiltIns: false,
							// 		targets: {
							// 			browsers: [
							// 				'Chrome >= 60',
							// 				'Safari >= 10.1',
							// 				'iOS >= 10.3',
							// 				'Firefox >= 54',
							// 				'Edge >= 15',
							// 			],
							// 		},
							// 	},
							// ],
							[
								'@babel/preset-env',
								{
									targets: { browsers: ['Chrome 96'] },
								},
							],
						],
						plugins: [
							['@babel/transform-react-jsx', { pragma: 'h' }],
							// '@babel/plugin-proposal-class-properties',
							// '@babel/plugin-proposal-private-methods',
						],
					},
				},
				{
					test: /\.svg$/i,
					type: 'asset/source',
				},
				{
					test: /\.(png|jpg)$/i,
					type: 'asset/resource',
				},
			],
		},
	};

	if (mode === 'development') dashboard.plugins.push(new LiveReloadPlugin({ delay: 0 }));
	if (analyze) dashboard.plugins.push(new BundleAnalyzerPlugin());

	if (analyze) return dashboard;
	return [server, dashboard];
}
