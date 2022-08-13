import path from 'path';
import auriserve from 'auriserve';
import { addElement, removeElement, addStylesheet, removeStylesheet } from 'elements';

import displayElements from './display';
import layoutElements from './layout';
import structureElements from './structure';

import './Style.pcss';

const elems = [...displayElements, ...layoutElements, ...structureElements];
const styles = path.join(__dirname, 'style.css');

elems.forEach((elem) => addElement(elem));
addStylesheet(styles);

auriserve.once('cleanup', () => {
	elems.forEach((elem) => removeElement(elem.identifier));
	removeStylesheet(styles);
});
