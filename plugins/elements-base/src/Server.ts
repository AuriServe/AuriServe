import path from 'path';
import as from 'auriserve';

import displayElements from './display';
import layoutElements from './layout';
import structureElements from './structure';

import './Style.pcss';

const { addElement, removeElement, addStylesheet, removeStylesheet } = as.elements;

const elems = [...displayElements, ...layoutElements, ...structureElements];
const styles = path.join(__dirname, 'style.css');

elems.forEach((elem) => addElement(elem));
addStylesheet(styles);

as.core.once('cleanup', () => {
	elems.forEach((elem) => removeElement(elem.identifier));
	removeStylesheet(styles);
});
