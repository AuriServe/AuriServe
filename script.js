const path = require('path');
const { execSync: rawExec, execSync } = require('child_process');

const paths = [
	'.',
	'common',
	'server',
	'api',
	'webpack-gen',
	'plugins/auriserve-preact',
	'plugins/dashboard',
	'plugins/elements',
	'plugins/elements-base',
	'plugins/hydrated',
	'plugins/media',
	'plugins/pages',
	'plugins/routes',
	'plugins/tax-calculator',
	'plugins/themes',
	'plugins/users'
];

function exec(cmd, cwd = '.') {
	try { return execSync(cmd, { stdio: 'pipe', cwd }).toString().trim() }
	catch (e) { return e.output[1].toString() + e.output[2].toString().trim(); };
}

function execOut(cmd, cwd) {
	try { execSync(cmd, { stdio: 'inherit', cwd }) }
	catch(e) {}
}

function audit() {
	let vulnerabilities = 0;
	paths.map(cwd => {
		const output = exec('npm audit | grep vulnerabilities', cwd);
		if (output === 'found 0 vulnerabilities' || output === '') return;
		console.log(`${cwd.padStart(12)}: ${output}.`);
		vulnerabilities += Number.parseInt(output, 10);
	});
	console.log(`${'total'.padStart(12)}: ${vulnerabilities} vulnerabilities.\n`);
}

function clean() {
	paths.map(cwd => exec('rm -r node_modules 2> /dev/null; rm -r build 2> /dev/null', cwd));
	console.log('Cleaned packages.\n');
}

function install() {
	paths.map(cwd => {
		console.log(`${cwd}:`);
		execOut('npm install', cwd);
		if (cwd.startsWith('plugins')) exec('npm install -D webpack-gen', cwd);
	});

	console.log('Installed packages.\n');
}

function cleanInstall() {
	clean();
	install();
}

function update() {
	paths.map(cwd => exec('npm update', cwd));
}

function build() {
	paths.slice(1).map(cwd => {
		console.log(`${cwd}:`);
		execOut('npm run build', cwd);
	});

	console.log('\nBuilt packages.\n');
}

function cleanBuild() {
	cleanInstall();
	build();
}

(({
	audit,
	clean,
	install,
	cleanInstall,
	update,
	build,
	cleanBuild
})[process.argv[2]] ?? (() => console.log('Unknown action.')))();
