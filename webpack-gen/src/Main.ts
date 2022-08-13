import fs from 'fs';
import path, { resolve } from 'path';
import minimst from 'minimist';
import callsite from 'callsite';
import { merge } from 'webpack-merge';
import { load, FAILSAFE_SCHEMA } from 'js-yaml';

import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

export interface Config {
	mode?: 'development' | 'production';
	manifestPath?: string;
	tsConfigPath?: string;
	// eslintConfigPath?: string;

	tsx?: boolean;

	postcss?: any;

	noServerPreactAlias?: boolean;
	noClientPreactAlias?: boolean;

	baseConfig?: Record<string, any>;
	exportConfigs?: Record<string, boolean | string | Record<string, any>>;
}

export default function generate(conf: Config = {}) {
	conf.mode ??= minimst(process.argv.slice(2)).mode ?? 'development';

	conf.exportConfigs ??= { server: true };

	const callingDir = path.dirname(callsite()[1].getFileName());

	conf.manifestPath ??= path.join(callingDir, 'manifest.yaml');
	conf.tsConfigPath ??= path.join(callingDir, 'tsconfig.json');
	// conf.eslintConfigPath ??= path.join(callingDir, 'eslintrc.json');

	conf.tsx ??= true;

	const manifest: any = load(fs.readFileSync(conf.manifestPath, 'utf8'), { schema: FAILSAFE_SCHEMA });
	const dependencies = ((manifest.depends as string[]) ?? []).map(dep => dep.split(' ')[0]);

	const configs = [];

	const baseConfig = merge({
		mode: conf.mode,
		stats: 'errors-warnings',
		devtool: conf.mode === 'production' ? undefined : 'source-map',

		context: path.join(callingDir, 'src'),

		output: {
			path: path.join(callingDir, 'build')
		},

		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
		},

		plugins: [
			new ForkTsCheckerPlugin({
				typescript: { configFile: conf.tsConfigPath },
				// eslint: { files: './**/*.{ts,tsx}' }
				// eslint: { files: './**/*.{ts,tsx}' }
			}),
			new ESLintWebpackPlugin({})
		],

		module: {
			rules: [
				{
					test: conf.tsx ? /\.[t|j]sx?$/ : /\.[t|j]s$/,
					loader: 'babel-loader',
					options: {
						babelrc: false,
						cacheDirectory: true,
						presets: [
							[
								'@babel/preset-typescript',
								{
									isTSX: conf.tsx,
									allExtensions: true,
									pragma: 'h'
								}
							],
							[
								'@babel/preset-env',
								{
									targets: {
										node: '10.20.1'
									}
								}
							]
						],
						plugins: conf.tsx ? [
							[
								'@babel/plugin-transform-react-jsx',
								{
									pragma: '__AURISERVE.h'
								}
							]
						] : []
					}
				},
				{
					test: /\.svg$/i,
					type: 'asset/source',
				},
				{
					test: /\.(png|jpg|gif|mp4|mp3)$/i,
					type: 'asset/resource',
				},
				{
					resourceQuery: /resource/,
					type: 'asset/resource',
				}
			]
		},

		optimization: {
			usedExports: true,
		}
	}, conf.baseConfig ?? {});

	if (conf.exportConfigs.server) {
		if (typeof conf.exportConfigs.server === 'string')
			conf.exportConfigs.server = { entry: conf.exportConfigs.server };

		configs.push(merge(baseConfig, {
			name: 'server',
			target: 'node',
			entry: './server/Main.ts',

			output: {
				filename: 'server.js',
				libraryTarget: 'commonjs-static'
			},

			externals: {
				...(conf.tsx && !conf.noServerPreactAlias ? {
					'preact': 'commonjs-module auriserve-preact',
					'preact/hooks': 'commonjs-module auriserve-preact',
					'preact/compat': 'commonjs-module auriserve-preact',
				} : {}),
				...Object.fromEntries(dependencies.map(dep => [ dep, `commonjs-module ${dep}` ]))
			},

			resolve: {
				alias: {
					'@res': resolve(callingDir, 'res/server')
				}
			},

			module: {
				rules: conf.postcss ? [
					{
						test: /\.pcss$/,
						sideEffects: true,
						use: [
							MiniCSSExtractPlugin.loader,
							'css-loader',
							{
								loader: 'postcss-loader',
								options: {
									postcssOptions: typeof conf.postcss === 'boolean' ? {
										plugins: [ 'postcss-nested', 'postcss-minify' ]
									} : conf.postcss
								}
							}
						],
					}
				] : []
			},

			plugins: conf.postcss ? [
				new MiniCSSExtractPlugin({ filename: 'style.css' })
			] : []
		}, typeof conf.exportConfigs.server === 'object' ? conf.exportConfigs.server : {}));
		delete conf.exportConfigs.server;
	}

	if (conf.exportConfigs.client) {
		if (typeof conf.exportConfigs.client === 'string')
			conf.exportConfigs.client = { entry: conf.exportConfigs.client };

		configs.push(merge(baseConfig, {
			name: 'client',
			target: 'web',
			entry: './client/Main.ts',

			output: {
				filename: 'client.js',
				library: `__ASP_${manifest.identifier.replace(/-/g, '_').toUpperCase()}`,
				libraryTarget: 'window'
			},

			resolve: {
				alias: {
					'@res': resolve(callingDir, 'res/client')
				}
			},

			externals: {
				...(conf.tsx && !conf.noClientPreactAlias ? {
					'preact': '__ASP_AURISERVE_PREACT',
					'preact/hooks': '__ASP_AURISERVE_PREACT',
					'preact/compat': '__ASP_AURISERVE_PREACT',
				} : {}),
				...Object.fromEntries(dependencies.map(dep => [ dep, `__ASP_${dep.replace(/-/g, '_').toUpperCase()}` ]))
			}
		}, typeof conf.exportConfigs.client === 'object' ? conf.exportConfigs.client : {}));
		delete conf.exportConfigs.client;
	}

	if (conf.exportConfigs.dashboard) {
		if (typeof conf.exportConfigs.dashboard === 'string')
			conf.exportConfigs.dashboard = { entry: conf.exportConfigs.dashboard };

		configs.push(merge(baseConfig, {
			name: 'dashboard',
			target: 'web',
			entry: './dashboard/Main.ts',

			output: {
				filename: 'dashboard.js'
			},

			resolve: {
				alias: {
					'@res': resolve(callingDir, 'res/dashboard')
				}
			},

			externals: {
				'dashboard': 'Dashboard',
				// TODO: Improve this
				'preact': '__AS_PREACT',
				'preact/hooks': '__AS_PREACT_HOOKS',
				'react': '__AS_PREACT_COMPAT',
				'react-dom': '__AS_PREACT_COMPAT',
			}
		}, typeof conf.exportConfigs.dashboard === 'object' ? conf.exportConfigs.dashboard : {}));
		delete conf.exportConfigs.dashboard;
	}

	configs.push(...Object.entries(conf.exportConfigs).map(([ identifier, conf ]) => {
		if (typeof conf === 'boolean') throw new Error(`Cannot boolean-export unknown config '${identifier}'.`);

		return merge(baseConfig, {
			name: identifier,
			entry: `./${identifier}/Main.ts`,
			output: {
				filename: `${identifier}.js`
			},
			resolve: {
				alias: {
					'@res': resolve(callingDir, `res/${identifier}`)
				}
			}
		}, conf);
	}));

	return configs;
}
