import { resolve } from 'path';
import * as Webpack from 'webpack';
import { merge } from 'webpack-merge';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

export default function(_: any, argv: { mode: string }) {
	const prod = argv.mode === 'production';

	/*
	* Template Configurations
	*/

	const baseConfig: Webpack.Configuration = ({
		context: resolve(__dirname, 'src'),
		output: { path: resolve(__dirname, 'dist') },
		resolve: {
			extensions: [ '.ts', '.tsx', '.js', '.jsx' ],
			alias: {
				'react': 'preact/compat',
				'react-dom': 'preact/compat'
			}
		},
		devtool: prod ? undefined : 'source-map',
		stats: 'minimal',

		plugins: [
			new ForkTsCheckerPlugin({
				typescript: { configFile: '../tsconfig.json' },
				eslint: {
					files: './**/*.{ts,tsx}',
					options: {
						configFile: resolve(__dirname, '.eslintrc.js'),
						emitErrors: false,
						failOnHint: false,
						typeCheck: true
					}
				}
			})
		],

		module: {
			rules: [{
				test: /\.[t|j]sx?$/,
				loader: 'babel-loader',
				options: {
					babelrc: false,
					cacheDirectory: true,
					presets: [
						[ '@babel/preset-typescript', {
							isTSX: true,
							allExtensions: true,
							jsxPragma: 'h'
						} ],
						[ '@babel/preset-env', { targets: { browsers: ['Chrome 78'] } } ]
					],
					plugins: [
						[ '@babel/transform-react-jsx', { pragma: 'h', pragmaFrag: 'Fragment' } ],
						[ '@babel/plugin-proposal-class-properties', {} ]
					]
				}
			}]
		},

		optimization: {
			minimizer: [
				'...',
				new CSSMinimizerPlugin()
			]
		}
	});

	const webConfig: Webpack.Configuration = merge(baseConfig, {
		target: 'web',

		externals: {
			'preact': 'preact',
			'preact/hooks': 'preact_hooks',
			'@res': resolve(__dirname, 'res')
		},

		module: {
			rules: [{
				test: /\.sss$/,
				use: 'null-loader'
			}]
		}
	});

	/*
	* Generated Configurations
	*/

	const serverConfig: Webpack.Configuration = merge(baseConfig, {
		name: 'server',
		target: 'node',

		entry: './Server.ts',
		output: {
			filename: 'server.js',
			path: resolve(__dirname, 'dist'),
			library: 'as-plugin',
			libraryTarget: 'umd',
			libraryExport: 'default'
		},

		externals: {
			'preact': 'root _AS_.preact',
			'preact/hooks': 'root _AS_.preact_hooks'
		},

		plugins: [ new MiniCssExtractPlugin({
			filename: 'client.css'
		}) ],

		module: {
			rules: [{
				test: /\.sss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader'
				]
			}]
		}
	});

	const clientConfig: Webpack.Configuration = merge(webConfig, {
		name: 'client',
		entry: './Client.ts',
		output: { filename: 'client.js' },

		externals: {
			'editor/hooks': 'AS_EDITOR.Hooks',
			'editor/graph': 'AS_EDITOR.Graph',
			'editor/components': 'AS_EDITOR.Components'
		},

		plugins: [ new MiniCssExtractPlugin({
			filename: 'client.css'
		}) ],

		module: {
			rules: [{
				test: /\.sss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader'
				]
			}, {
			test: /\.svg$/i,
				type: 'asset/source'
			}, {
				test: /\.(png|jpg)$/i,
				type: 'asset/resource'
			}]
		}
	});

	const viewConfig: Webpack.Configuration = merge(webConfig, {
		name: 'view',
		entry: './View.ts',
		output: { filename: 'view.js' }
	});

	return [ viewConfig, clientConfig, serverConfig ];
}
