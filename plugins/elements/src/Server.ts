import fs from 'fs';
import as from 'auriserve';
import { assert } from 'common';

import renderTree from './RenderTree';

as.elements = {
	renderTree,

	elements: new Map(),
	addElement(element: any) {
		as.elements.elements.set(element.identifier, element);
	},
	removeElement(identifier: string) {
		return as.elements.elements.delete(identifier);
	},

	stylesheets: new Set(),
	addStylesheet(filePath: string) {
		assert(fs.existsSync(filePath), `Stylesheet '${filePath}' not found.`);
		as.elements.stylesheets.add(filePath);
	},
	removeStylesheet(filePath: string) {
		return as.elements.stylesheets.delete(filePath);
	},
};

as.core.on('cleanup', () => as.unexport('elements'));

export type { default as API } from './API';
export type { default as Element } from './Element';
export type { default as Tree, Node } from './Tree';
