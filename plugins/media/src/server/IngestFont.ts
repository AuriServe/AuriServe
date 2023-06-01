import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';

import { MEDIA_DIR, VARIANT_DIR, fileHash } from './Ingest';
import * as Database from './Database';

const INLINE_LAYOUT_FEATURES = '--layout-features+="lnum,tnum" --layout-features-="cswh" ';
const INLINE_LAYOUT_UNICODES = '--unicodes="U+0020-007F" ';

export function execPyFtSubset(input: string, output: string, options: string) {
	return new Promise<string>((resolve, reject) => {
		fs.unlink(output).catch(() => { /* we don't care if the file exists. */ }).finally(() =>
			exec(`pyftsubset "${input.replace(/\\/, '\\\\').replace(/"/g, '\\"')}"\
				--output-file="${output.replace(/\\/, '\\\\').replace(/"/g, '\\"')}"\
				--flavor=woff2 ${options}`, (err) => {
				if (err) reject(err);
				else resolve(output);
			})
		);
	});
}

export async function ingestFont(media: Database.Media, canonical: Database.MediaVariant) {
	const filePath = path.join(MEDIA_DIR, canonical.path);
	const parsedPath = path.parse(filePath);

	let outPath = path.resolve(VARIANT_DIR, `${parsedPath.name}.woff2`);
	await execPyFtSubset(filePath, outPath, '--layout-features=* --unicodes=*');
	let [ hash, stat ] = await Promise.all([ fileHash(outPath), fs.stat(outPath) ]);
	Database.addMediaVariant({ mid: media.id, hash, path: path.relative(MEDIA_DIR, outPath),
		type: 'font_optimized', prop: 0, size: stat.size });

	outPath = path.resolve(VARIANT_DIR, `${parsedPath.name}.inl.woff2`);
	await execPyFtSubset(filePath, outPath, [ INLINE_LAYOUT_FEATURES, INLINE_LAYOUT_UNICODES ].join(' '));
	[ hash, stat ] = await Promise.all([ fileHash(outPath), fs.stat(outPath) ]);
	Database.addMediaVariant({ mid: media.id, hash, path: path.relative(MEDIA_DIR, outPath),
		type: 'font_inline', prop: 0, size: stat.size });
}
