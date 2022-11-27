import path from 'path';
import auriserve from 'auriserve';
import { addElement, removeElement, addStylesheet, removeStylesheet } from 'elements';

import * as Elements from './page';

import './Style.pcss';
const styles = path.join(__dirname, 'style.css');
addStylesheet(styles);

Object.values(Elements).forEach((elem) => addElement(elem));
auriserve.once('cleanup', () => {
	Object.values(Elements).forEach((elem) => removeElement(elem.identifier));
	removeStylesheet(styles);
});

// import { readEverbook } from './Everbook';

// readEverbook('/home/auri/.minecraft/everbook/everbook-d66fb1ca-5d12-4b13-8f4d-04b952a555c8.dat');
