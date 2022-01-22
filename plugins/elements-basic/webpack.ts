import { resolve } from 'path';

import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

export default function (_: any, argv: { mode: string }) {
	const prod = argv.mode === 'production';

	return {
		name: 'server',
		target: 'node',
		context: resolve(__dirname, 'src'),
		entry: './Server.ts',

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
		devtool: prod ? undefined : 'source-map',
		stats: 'minimal',

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
									isTSX: true,
									allExtensions: true,
									pragma: 'h',
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
						plugins: [['@babel/transform-react-jsx', { pragma: '__AS_PREACT.h' }]],
					},
				},
			],
		},

		optimization: {
			usedExports: true,
		},
	};
}
