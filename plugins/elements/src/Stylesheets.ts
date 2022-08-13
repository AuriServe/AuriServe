import fs from 'fs';
import { assert } from 'common';

export const stylesheets: Set<string> = new Set();

export function addStylesheet(filePath: string) {
	assert(fs.existsSync(filePath), `Stylesheet '${filePath}' not found.`);
	stylesheets.add(filePath);
}

export function removeStylesheet(filePath: string) {
	return stylesheets.delete(filePath);
}
