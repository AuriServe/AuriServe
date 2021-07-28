// import { resolve } from 'path';
// import * as Webpack from 'webpack';

// import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin';
// import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

// export default function(_: any, argv: { mode: string }) {
// 	const prod = argv.mode === 'production';

// 	const config: Webpack.Configuration = ({
// 		target: 'node',
// 		context: resolve(__dirname, 'src'),
// 		entry: './Main.ts',
// 		experiments: {
// 			outputModule: true,
// 		},
// 		output: {
// 			path: resolve(__dirname, 'dist'),
// 			library: 'plugin-api',
// 			libraryTarget: 'module'
// 		},
// 		resolve: { extensions: [ '.ts', '.tsx', '.js', '.jsx' ] },
// 		externals: {
// 			'preact': 'preact'
// 		},
// 		devtool: prod ? undefined : 'source-map',
// 		stats: 'minimal',

// 		plugins: [
// 			new ForkTsCheckerPlugin({
// 				typescript: { configFile: '../tsconfig.json' },
// 				eslint: {
// 					files: './**/*.{ts,tsx}',
// 					options: {
// 						configFile: resolve(__dirname, '.eslintrc.js'),
// 						emitErrors: false,
// 						failOnHint: false,
// 						typeCheck: true
// 					}
// 				}
// 			})
// 		],

// 		module: {
// 			rules: [{
// 				test: /\.[t|j]sx?$/,
// 				loader: 'babel-loader',
// 				options: {
// 					babelrc: false,
// 					cacheDirectory: true,
// 					presets: [
// 						[ '@babel/preset-typescript', {
// 							isTSX: true,
// 							allExtensions: true,
// 							jsxPragma: 'h'
// 						} ],
// 						[ '@babel/preset-env', { targets: { browsers: [ 'Chrome 78' ] } } ]
// 					],
// 					plugins: [
// 						[ '@babel/transform-react-jsx', { pragma: 'h' } ],
// 						[ '@babel/plugin-proposal-class-properties', {} ]
// 					]
// 				}
// 			}, {
// 				test: /\.css$/,
// 				use: [
// 					'style-loader',
// 					'css-loader'
// 				]
// 			}]
// 		},

// 		optimization: {
// 			minimizer: [ '...', new CSSMinimizerPlugin() ]
// 		}
// 	});

// 	return config;
// }
