#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { merge } from 'webpack-merge';

import Config from './Config';
import generate from './Generator';
import { exec } from 'child_process';
import { MultiStats, webpack } from 'webpack';

export type { default as Config } from './Config';
export { default as generate } from './Generator';

const option = process.argv[2] ?? '';

function arrayify(val: any | any[]): any[] {
	if (!val) return val;
	return Array.isArray(val) ? val : [ val ];
}

const cliConfig = minimist(process.argv.slice((process.argv[3] ?? '').startsWith('--out') ? 4 : 3)) as Config;
cliConfig.noPreactAlias = arrayify(cliConfig.noPreactAlias);
cliConfig.export = arrayify(cliConfig.export);
delete (cliConfig as any)._;

const packageConfig = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf8')).webpackGenConfig ?? {};

const config = merge(packageConfig, cliConfig);

if (config.types !== false) config.types = config.tsConfigPath || path.resolve('tsconfig.json');

function webpackOutput(err: Error | null | undefined, stats: MultiStats | undefined) {
	const info = stats!.stats.map(stat => ({
		name: stat.compilation.name,
		duration: stat.compilation.endTime - stat.compilation.startTime,
		successful: !stat.hasErrors()
	}));

	console.log(`\x1b[92mBuilt ${info.length} configuration${info.length !== 1 ? 's' : ''}: ${
		info.map(info => `\x1b[${info.successful ? '92' : '91'}m${info.name} (${info.duration}ms)\x1b[92m`).join(', ')}.\x1b[0m`);

	stats!.stats.forEach(stat => {
		if (stat.hasErrors() || stat.hasWarnings()) console.log(stat.toString({ colors: true }));
	});

	if (err) console.error(err.message);
}

switch (option) {
	default:
	case '':
		break;
	case 'generate': {
		const outPath = path.resolve((process.argv[3] ?? '').startsWith('--out=')
			? process.argv[3].split('=')[1] : 'webpack-js');
		fs.writeFileSync(outPath, generate(config, true));
		break;
	}
	case 'dev':
		webpack(generate(config)).watch({ aggregateTimeout: 100 }, webpackOutput);
		if (config.types && fs.existsSync(config.types))
			exec(`tsc --watch --project ${config.types} --declaration --emitDeclarationOnly --outDir types`);
		break;
	case 'build':
		webpack(generate({ ...config, mode: 'production' })).run(webpackOutput);
		if (config.types && fs.existsSync(config.types))
			exec(`tsc --project ${config.types} --declaration --emitDeclarationOnly --outDir types`);
		break;
}
