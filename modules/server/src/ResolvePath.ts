import os from 'os';
import path from 'path';

function expandHome(p: string): string {
	if (p[0] === '~') return p.replace('~', os.homedir());
	else return p;
}

export default function resolvePath(p: string) {
	let resolved = expandHome(p);
	if (!path.isAbsolute(resolved)) resolved = path.join(
		// Ascend three levels up the tree... There should be a better way to do this.
		process.cwd(), resolved);
	return path.normalize(resolved);
}
