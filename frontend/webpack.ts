import { resolve } from 'path';
import * as Webpack from 'webpack';
import { merge } from 'webpack-merge';

const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CSSMinimizerPlugin   = require('css-minimizer-webpack-plugin');
const LiveReloadPlugin     = require('webpack-livereload-plugin');
const ForkTsCheckerPlugin  = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export default function(_: {}, argv: { mode: string, analyze: boolean }) {
	const mode: 'production' | 'development' = argv.mode as any ?? 'development';
	const analyze = argv.analyze;

	process.env.NODE_ENV = mode ?? 'development';

	let baseConfig: Webpack.Configuration = {
		mode,
		devtool: mode === 'production' ? undefined : 'source-map',
		stats: 'errors-warnings',

		context: resolve(__dirname, 'src'),
		resolve: {
			extensions: [ '.ts', '.tsx', '.js', '.jsx' ]
		},
		output: {
			path: resolve(__dirname, './dist')
		},

		externals: {
			'preact': 'preact',
			'preact/hooks': 'preact_hooks'
		},
		plugins: [
			new ForkTsCheckerPlugin({
				typescript: {
					configFile: resolve(__dirname, 'tsconfig.json'),
				},
				eslint: {
					files: './**/*.{ts,tsx}',
					options: {
						configFile: resolve(__dirname, '.eslintrc.js'),
						emitErrors: true,
						failOnHint: true,
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
						['@babel/preset-typescript', {
							isTSX: true,
							allExtensions: true,
							jsxPragma: 'Preact.h'
						}],
						[ '@babel/preset-env', {
							targets: { browsers: ['Chrome 78']},
						}]
					],
					plugins: [
						['@babel/transform-react-jsx', { pragma: 'Preact.h' }],
						['@babel/plugin-proposal-class-properties', { loose: true }],
						['@babel/plugin-proposal-private-methods', { loose: true }]
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
	}

	if (mode === 'development') baseConfig = merge(baseConfig, {
		plugins: [ new LiveReloadPlugin({ delay: 500 }) ]
	});

	if (analyze) baseConfig = merge(baseConfig, {
		plugins: [ new BundleAnalyzerPlugin() ]
	});

	const interfaceConfig: Webpack.Configuration = merge(baseConfig, {
		name: 'as_interface',
		context: resolve(__dirname, 'src'),
		resolve: {
			alias: {
				'react': 'preact/compat',
				'react-dom': 'preact/compat'
			}
		},

		entry: { main: './Main.ts' },
		output: {
			library: 'AS_EDITOR'
		},

		plugins: [
			new MiniCSSExtractPlugin()
		],

		module: {
			rules: [{
				test: /\.s[c|a]ss$/,
				use: [
					'null-loader'
				]
			}, {
				test: /\.tw$/,
				use: [
					MiniCSSExtractPlugin.loader,
					{ loader: 'css-loader', options: { url: false, importLoaders: 1 } },
					'postcss-loader'
				]
			}, {
				test: /\.sss$/,
				use: [
					MiniCSSExtractPlugin.loader,
					{ loader: 'css-loader', options: { url: false, importLoaders: 1, modules: {
						localIdentName: mode === 'development' ? '[local]_[hash:base64:4]' : '[hash:base64:8]'
					} } },
					'postcss-loader'
				]
			}]
		}
	});

	const clientConfig: Webpack.Configuration = merge(baseConfig, {
		name: 'as_client',
		context: resolve(__dirname, 'src'),
		resolve: {
			alias: {
				'react': 'preact/compat',
				'react-dom': 'preact/compat'
			}
		},

		entry: { client: './Client.ts' },

		module: {
			rules: [{
				test: /\.sss$/,
				use: [
					'style-loader',
					{ loader: 'css-loader', options: { url: false, importLoaders: 1, modules: {
						localIdentName: mode === 'development' ? '[local]_[hash:base64:4]' : '[hash:base64:8]'
					} } },
					'postcss-loader'
				]
			}]
		}
	});

	return [ interfaceConfig, clientConfig ];
}
