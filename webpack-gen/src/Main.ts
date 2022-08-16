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

	tsx?: boolean;

	postcss?: any;

	noPreactAlias?: string[];

	base?: Record<string, any>;
	export?: Record<string, boolean | string | Record<string, any>> | string[];
}

function normalizeExport(name: string, def: boolean | string | object, callingDir: string):
	Record<string, any> {
	if (typeof def === 'object') return def;
	if (typeof def === 'string') return { entry: def };
	const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
	return { entry: fs.existsSync(path.join(callingDir, `./src/${name}/Main.ts`))
		? `./${name}/Main.ts` : `./${capitalName}.ts` };
}

export default function generate(conf: Config = {}) {
	conf.mode ??= minimst(process.argv.slice(2)).mode ?? 'development';

	const callingDir = path.dirname(callsite()[1].getFileName());

	conf.manifestPath ??= path.join(callingDir, 'manifest.yaml');
	conf.tsConfigPath ??= path.join(callingDir, 'tsconfig.json');
	// conf.eslintConfigPath ??= path.join(callingDir, 'eslintrc.json');

	conf.tsx ??= true;

	const manifest: any = load(fs.readFileSync(conf.manifestPath, 'utf8'), { schema: FAILSAFE_SCHEMA });
	const dependencies = ((manifest.depends as string[]) ?? []).map(dep => dep.split(' ')[0]);

	conf.export ??= Object.keys(typeof manifest.entry === 'string' ? { server : true } : manifest.entry);
	if (Array.isArray(conf.export)) conf.export = Object.fromEntries(conf.export.map(key => [key, true]));


	conf.export = Object.fromEntries(Object.entries(conf.export).map(([name, def]) =>
		[name, normalizeExport(name, def, callingDir)]));

	console.log(`Generating webpack configs for ${Object.keys(conf.export!).join(', ')}.\n`);

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
			alias: conf.tsx ? {
				'react': 'preact/compat',
				'react-dom': 'preact/compat'
			} : {}
		},

		plugins: [
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
	}, conf.base ?? {});

	if (conf.export.server) {
		configs.push(merge(baseConfig, {
			name: 'server',
			target: 'node',

			output: {
				filename: 'server.js',
				libraryTarget: 'commonjs-static'
			},

			externals: {
				...(conf.tsx && !conf.noPreactAlias?.includes('server') ? {
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

			plugins: [
				...conf.postcss ? [
					new MiniCSSExtractPlugin({ filename: 'style.css' })
				] : [],
				new ForkTsCheckerPlugin({ typescript: { configFile: conf.tsConfigPath } })
			]
		}, conf.export.server));
		delete conf.export.server;
	}

	if (conf.export.client) {
		configs.push(merge(baseConfig, {
			name: 'client',
			target: 'web',

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
				...(conf.tsx && !conf.noPreactAlias?.includes('client') ? {
					'preact': '__ASP_AURISERVE_PREACT',
					'preact/hooks': '__ASP_AURISERVE_PREACT',
					'preact/compat': '__ASP_AURISERVE_PREACT',
				} : {}),
				...Object.fromEntries(dependencies.map(dep => [ dep, `__ASP_${dep.replace(/-/g, '_').toUpperCase()}` ]))
			}
		}, conf.export.client));
		delete conf.export.client;
	}

	if (conf.export.dashboard) {
		configs.push(merge(baseConfig, {
			name: 'dashboard',
			target: 'web',

			output: {
				filename: 'dashboard.js',
				library: `__ASP_${manifest.identifier.replace(/-/g, '_').toUpperCase()}`,
				libraryTarget: 'window'
			},

			resolve: {
				alias: {
					'@res': resolve(callingDir, 'res/dashboard')
				}
			},

			externals: {
				...(conf.tsx && !conf.noPreactAlias?.includes('dashboard') ? {
					'preact': '__AS_PREACT',
					'preact/hooks': '__AS_PREACT_HOOKS',
					'preact/compat': '__AS_PREACT',
				} : {}),
				...Object.fromEntries(dependencies.map(dep => [ dep, `__ASP_${dep.replace(/-/g, '_').toUpperCase()}` ]))
			}
		}, conf.export.dashboard));
		delete conf.export.dashboard;
	}

	configs.push(...Object.entries(conf.export).map(([ identifier, conf ]) => {
		return merge(baseConfig, {
			name: identifier,
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
