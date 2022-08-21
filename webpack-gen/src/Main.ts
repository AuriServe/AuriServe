#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { merge } from 'webpack-merge';

import Config from './Config';
import generate from './Generator';
import { webpack } from 'webpack';
import { exec } from 'child_process';

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

switch (option) {
	default:
		console.error(`Unknown action '${option}'`);
		break;
	case '':
		break;
	case 'generate': {
		const outPath = path.resolve((process.argv[3] ?? '').startsWith('--out=')
			? process.argv[3].split('=')[1] : 'webpack-js');
		fs.writeFileSync(outPath, generate(config, true));
		break;
	}
	case 'dev':
		webpack(generate(config)).watch({ aggregateTimeout: 100 }, (err) => { if (err) console.error(err.message); });
		if (config.types && fs.existsSync(config.types))
			exec(`tsc --watch --project ${config.tsTypesConfigPath} --declaration --emitDeclarationOnly --outDir types`);
		break;
	case 'build':
		webpack(generate({ ...config, mode: 'production' })).run((err) => { if (err) console.error(err.message); });
		if (config.types && fs.existsSync(config.types))
			exec(`tsc --project ${config.tsTypesConfigPath} --declaration --emitDeclarationOnly --outDir types`);
		break;
}
