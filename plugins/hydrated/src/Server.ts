import path from 'path';
import auriserve from 'auriserve';
import type { FunctionalComponent } from 'preact';
import { addStylesheet, removeStylesheet } from 'elements';

import './Style.pcss';

const styles = path.join(__dirname, 'style.css');
addStylesheet(styles);
auriserve.once('cleanup', () => removeStylesheet(styles));

export { default as Static } from './Static';
export { default as hydrate } from './Hydrate';

export function hydrateElement(_element: { identifier: string, component: FunctionalComponent }) {
	/* Placeholder for client function. */
}
