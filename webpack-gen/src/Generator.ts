import fs from 'fs';
import minimst from 'minimist';
import path, { resolve } from 'path';
import { merge } from 'webpack-merge';
import { load, FAILSAFE_SCHEMA } from 'js-yaml';

import type Config from './Config';

function normalizeExport(name: string, def: boolean | string | object, callingDir: string):
	Record<string, any> {
	const obj: Record<string, any> =
		(typeof def === 'object' ? def : { entry: (typeof def === 'string') ? def : undefined });
	if (!obj.entry) {
		const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
		obj.entry = fs.existsSync(path.join(callingDir, `./src/${name}/Main.ts`))
			? `./${name}/Main.ts` : `./${capitalName}.ts`;
	}
	return obj;
}

export default function generate(conf: Config, toFile?: false): Record<string, any>[];

export default function generate(conf: Config, toFile: true): string;

export default function generate(conf: Config = {}, toFile = false) {
	function runtimeImport(path: string, code = '$'): any {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		if (!toFile) return new Function('$', `return ${code}`)(require(path));
		return `<IMPORT@${path}@${code}>`;
	}

	function runtimeRegex(regex: RegExp): RegExp {
		if (!toFile) return regex;
		return `<REGEX@${regex.toString()}>` as any as RegExp;
	}

	function relativeToGen(rel: string) {
		return path.join(path.dirname(__dirname), rel);
	}

	conf.mode ??= minimst(process.argv.slice(2)).mode ?? 'development';

	const callingDir = path.resolve('./');

	conf.manifestPath ??= path.join(callingDir, 'manifest.yaml');
	conf.tsConfigPath ??= path.join(callingDir, 'tsconfig.json');
	// conf.eslintConfigPath ??= path.join(callingDir, 'eslintrc.json');

	conf.tsx ??= true;

	const manifest: any = load(fs.readFileSync(conf.manifestPath, 'utf8'), { schema: FAILSAFE_SCHEMA });
	const dependencies = Object.keys((manifest.depends as Record<string, string>) ?? {});

	conf.export ??= Object.keys(typeof manifest.entry === 'string' ? { server : true } : manifest.entry);
	if (Array.isArray(conf.export)) conf.export = Object.fromEntries(conf.export.map(key => [key, true]));


	conf.export = Object.fromEntries(Object.entries(conf.export).map(([name, def]) =>
		[name, normalizeExport(name, def, callingDir)]));

	console.log(`\x1b[92mGenerating configurations for ${Object.keys(conf.export!).join(', ')}.\n\x1b[0m`);

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

		resolveLoader: {
			modules: [ 'node_modules', path.join(path.dirname(__dirname), 'node_modules') ]
		},

		plugins: [
			runtimeImport('eslint-webpack-plugin', 'new $({})'),
			// ...(conf.postcss ? [
			// 	runtimeImport('mini-css-extract-plugin', `new $({ filename: 'style.css' })`)
			// ] : []),
		],

		module: {
			rules: [
				{
					test: conf.sourceEntryFilter ? '/(\\.%ENTRY)?\\.[t|j]sx?$/' : runtimeRegex(/\.[t|j]sx?$/),
					// resourceQuery: conf.sourceEntryFilter ? '/%ENTRY/' : undefined,
					loader: 'babel-loader',
					options: {
						babelrc: false,
						cacheDirectory: true,
						presets: [
							[
								relativeToGen('node_modules/@babel/preset-typescript'),
								{
									isTSX: conf.tsx,
									allExtensions: true,
									pragma: 'h'
								}
							],
							[
								relativeToGen('node_modules/@babel/preset-env'),
								{
									targets: {
										node: '10.20.1'
									}
								}
							]
						],
						plugins: conf.tsx ? [
							[
								relativeToGen('node_modules/@babel/plugin-transform-react-jsx'),
								{
									pragma: '__AURISERVE.h'
								}
							]
						] : []
					}
				},
				...(conf.sourceEntryFilter ? [{
					test: '/\\.(?!%ENTRY)\\w+\\.[t|j]sx?$/',
					loader: 'null-loader',
					exclude: /node_modules/
				}] : []),
				// {
				// 	test: runtimeRegex(/.[t|j]sx?/i),
				// 	resourceQuery: '/%NOT_ENTRY/',
				// 	loader: 'null-loader'
				// },
				{
					test: runtimeRegex(/\.css$/i),
					use: [
						'style-loader',
						'css-loader'
					]
				},
				...(conf.postcss ? [{
					test: runtimeRegex(/\.pcss$/),
					sideEffects: true,
					use: [
						'style-loader',
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
				}] : []),
				{
					test: runtimeRegex(/\.svg$/i),
					type: 'asset/source',
				},
				{
					test: runtimeRegex(/\.(png|jpg|gif|mp4|mp3)$/i),
					type: 'asset/resource',
				},
				{
					resourceQuery: runtimeRegex(/resource/),
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
				...Object.fromEntries(dependencies.map(dep => [ dep, `commonjs-module ${dep}` ])),
			},

			resolve: {
				alias: {
					'@res': resolve(callingDir, 'res/server')
				}
			},

			module: {
				rules: conf.postcss ? [
					{
						test: runtimeRegex(/\.pcss$/),
						sideEffects: true,
						use: [
							runtimeImport('mini-css-extract-plugin', '$.loader'),
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
					runtimeImport('mini-css-extract-plugin', `new $({ filename: 'style.css' })`)
				] : [],
				runtimeImport('fork-ts-checker-webpack-plugin',
					`new $({ typescript: { configFile: '${conf.tsConfigPath}' }})`)
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
				libraryTarget: 'window',
				publicPath: `/res/${manifest.identifier}/`
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

	if (conf.export.client_sync) {
		configs.push(merge(baseConfig, {
			name: 'client_sync',
			target: 'web',

			output: {
				filename: 'client_sync.js',
				library: `__ASP_${manifest.identifier.replace(/-/g, '_').toUpperCase()}`,
				libraryTarget: 'window',
				publicPath: `/res/${manifest.identifier}/`
			},

			resolve: {
				alias: {
					'@res': resolve(callingDir, 'res/client')
				}
			},

			externals: {
				...(conf.tsx && !conf.noPreactAlias?.includes('client_sync') ? {
					'preact': '__ASP_AURISERVE_PREACT',
					'preact/hooks': '__ASP_AURISERVE_PREACT',
					'preact/compat': '__ASP_AURISERVE_PREACT',
				} : {}),
				...Object.fromEntries(dependencies.map(dep => [ dep, `__ASP_${dep.replace(/-/g, '_').toUpperCase()}` ]))
			}
		}, conf.export.client_sync));
		delete conf.export.client_sync;
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

	configs.forEach(config => {
		config.module = { ...config.module };
		config.module.rules = [ ...config.module.rules ];
		config.module.rules.forEach((rule: { resourceQuery: string | RegExp, test: string | RegExp, exclude: string | RegExp }, i: number) => {
			rule = { ...rule };
			config.module.rules[i] = rule;
			if (typeof rule.resourceQuery === 'string') {
				rule.resourceQuery = runtimeRegex(new RegExp(rule.resourceQuery.substring(1, rule.resourceQuery.length - 1)
					.replace('%ENTRY', `(entry=(\\w+,)*${config.name}(,\\w+)*)?`)
					.replace('%NOT_ENTRY', `entry=((?!${config.name})\\w+,)*((?!${config.name})\\w+)*$`)
				));
			}

			if (typeof rule.test === 'string') {
				rule.test = runtimeRegex(new RegExp(rule.test.substring(1, rule.test.length - 1)
					.replace('%ENTRY', config.name)
				));
			}

			if (typeof rule.exclude === 'string') {
				rule.exclude = runtimeRegex(new RegExp(rule.exclude.substring(1, rule.exclude.length - 1)
					.replace('%ENTRY', config.name)
				));
			}
		})
	})

	if (toFile) {
		return `module.exports = ${
			JSON.stringify(configs, null, 2)
				.replace(/["']<IMPORT@(.+)@(.+)>["']/g, (_, path, action) => {
					action = action.replace(/\$/g, `(require('${path}'))`);
					return action;
				})
				.replace(/["']<REGEX@(.+)>["']/g, '$1').replace(/\\\\/g, '\\')}`;
	}

	return configs;
}
