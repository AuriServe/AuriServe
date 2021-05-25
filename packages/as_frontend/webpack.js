"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const webpack_merge_1 = require("webpack-merge");
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
function default_1(_, argv) {
    var _a;
    const prod = argv.mode === 'production';
    const analyze = argv.analyze;
    let baseConfig = {
        mode: (_a = argv.mode) !== null && _a !== void 0 ? _a : 'development',
        devtool: prod ? undefined : 'source-map',
        stats: 'errors-warnings',
        context: path_1.resolve(__dirname, 'src'),
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        output: {
            path: path_1.resolve(__dirname, './dist')
        },
        externals: {
            "preact": "preact",
            'preact/hooks': 'preact_hooks'
        },
        plugins: [
            new ForkTsCheckerPlugin({
                typescript: {
                    configFile: path_1.resolve(__dirname, 'tsconfig.json'),
                },
                eslint: {
                    files: './**/*.{ts,tsx}',
                    options: {
                        configFile: path_1.resolve(__dirname, '.eslintrc.js'),
                        emitErrors: true,
                        failOnHint: true,
                        typeCheck: true
                    }
                }
            }),
            new MomentLocalesPlugin()
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
                            ['@babel/preset-env', {
                                    targets: { browsers: ['Chrome 78'] },
                                }]
                        ],
                        plugins: [
                            ["@babel/transform-react-jsx", {
                                    pragma: "Preact.h"
                                }],
                            ['@babel/plugin-proposal-class-properties', {
                                    loose: true
                                }]
                        ]
                    }
                }]
        }
    };
    if (!prod)
        baseConfig = webpack_merge_1.merge(baseConfig, {
            plugins: [new LiveReloadPlugin()]
        });
    if (analyze)
        baseConfig = webpack_merge_1.merge(baseConfig, {
            plugins: [new BundleAnalyzerPlugin()]
        });
    const interfaceConfig = webpack_merge_1.merge(baseConfig, {
        name: 'as_interface',
        context: path_1.resolve(__dirname, 'src'),
        resolve: {
            alias: {
                "react": "preact/compat",
                "react-dom": "preact/compat"
            }
        },
        entry: { main: './Main.ts' },
        output: {
            library: 'ASEditor'
        },
        plugins: [
            new MiniCSSExtractPlugin()
        ],
        module: {
            rules: [{
                    test: /\.s[c|a]ss$/,
                    use: [
                        MiniCSSExtractPlugin.loader,
                        { loader: 'css-loader', options: { url: false } },
                        'sass-loader'
                    ]
                }]
        }
    });
    const clientConfig = webpack_merge_1.merge(baseConfig, {
        name: 'as_client',
        context: path_1.resolve(__dirname, 'src'),
        resolve: {
            alias: {
                "react": "preact/compat",
                "react-dom": "preact/compat"
            }
        },
        entry: { client: './Client.ts' },
        module: {
            rules: [{
                    test: /\.s[c|a]ss$/,
                    use: [
                        'style-loader',
                        { loader: 'css-loader', options: { url: false } },
                        'sass-loader'
                    ]
                }]
        }
    });
    return [interfaceConfig, clientConfig];
}
exports.default = default_1;
