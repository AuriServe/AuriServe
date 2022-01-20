import as from 'auriserve';

import renderTree from './RenderTree';

as.elements = {
	renderTree,

	registeredElements: new Map(),
	registerElement(element: any) {
		as.elements.registeredElements.set(element.identifier, element);
	},
	unregisterElement(identifier: string) {
		return as.elements.registeredElements.delete(identifier);
	},
};

as.core.on('cleanup', () => as.unexport('elements'));

export type { default as API } from './API';
export type { default as Element } from './Element';
export type { default as Tree, Node } from './Tree';
