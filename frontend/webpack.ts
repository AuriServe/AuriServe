/* eslint-disable */

import { resolve } from 'path';
import * as Webpack from 'webpack';
import { merge } from 'webpack-merge';

const LiveReloadPlugin = require('webpack-livereload-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export default function (_: {}, argv: { mode: string; analyze: boolean }) {
	const mode: 'production' | 'development' = (argv.mode as any) ?? 'development';
	const analyze = argv.analyze;

	process.env.NODE_ENV = mode ?? 'development';

	let baseConfig: Webpack.Configuration = {
		mode,
		devtool: mode === 'production' ? undefined : 'source-map',
		stats: 'errors-warnings',

		context: resolve(__dirname, 'src'),
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
		},
		output: {
			path: resolve(__dirname, './dist'),
		},

		externals: {
			'preact': 'preact',
			'preact/hooks': 'preact_hooks',
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
							[
								'@babel/preset-env',
								{
									targets: { browsers: ['Chrome 90'] },
								},
							],
						],
						plugins: [
							['@babel/transform-react-jsx', { pragma: 'h' }],
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-proposal-private-methods',
						],
					},
				},
			],
		},
	};

	if (mode === 'development') {
		baseConfig = merge(baseConfig, {
			plugins: [new LiveReloadPlugin({ delay: 300 })],
		});
	}

	if (analyze) {
		baseConfig = merge(baseConfig, {
			plugins: [new BundleAnalyzerPlugin()],
		});
	}

	const interfaceConfig: Webpack.Configuration = merge(baseConfig, {
		name: 'as_interface',
		context: resolve(__dirname, 'src'),
		resolve: {
			alias: {
				'@res': resolve(__dirname, 'res'),
				'react': 'preact/compat',
				'react-dom': 'preact/compat',
			},
		},

		entry: { main: './Main.tsx' },
		output: {
			library: 'AS_EDITOR',
		},

		module: {
			rules: [
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
	});

	const clientConfig: Webpack.Configuration = merge(baseConfig, {
		name: 'as_client',
		context: resolve(__dirname, 'src'),
		resolve: {
			alias: {
				'react': 'preact/compat',
				'react-dom': 'preact/compat',
			},
		},

		entry: { client: './Client.ts' },
	});

	return [interfaceConfig, clientConfig];
}
