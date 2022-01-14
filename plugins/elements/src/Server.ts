import fs from 'fs';
import path from 'path';
import as from 'auriserve';

import Page from './Page';
import PreactRoute from './PreactRoute';
import PageRenderer from './PageRenderer';

as.elements = {
	PreactRoute,

	renderPage(page: Page) {
		return new PageRenderer(as.elements.registeredElements).render(page as any, {});
	},

	registeredLayouts: new Map(),
	registerLayout(layout: any) {
		as.elements.registeredLayouts.set(layout.identifier, layout);
	},
	unregisterLayout(identifier: string) {
		as.elements.registeredLayouts.delete(identifier);
	},

	registeredElements: new Map(),
	registerElement(element: any) {
		as.elements.registeredElements.set(element.identifier, element);
	},
	unregisterElement(identifier: string) {
		as.elements.registeredElements.delete(identifier);
	},
};

const pagePath = path.resolve(path.join(__dirname, '..', 'res', 'contact.json'));
as.routes.setRoot(
	new PreactRoute('/', JSON.parse(fs.readFileSync(pagePath, 'utf8'))) as any
);

as.core.on('cleanup', () => as.unexport('preactRoutes'));

export type { default as Element } from './Element';
export type { default as API } from './API';
export type { default as Layout } from './Layout';
export type { default as Page } from './Page';
export type { default as PreactRoute } from './PreactRoute';
