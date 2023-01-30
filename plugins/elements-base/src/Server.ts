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


/** Expose the PDFJS worker. */

// eslint-disable-next-line
// @ts-ignore
import worker from '!!file-loader!pdfjs-dist/build/pdf.worker.min.js'

auriserve.router.get('/res/elements-base/pdf_worker.js', (_, res) => {
	res.sendFile(path.join(auriserve.dataPath, '/plugins/elements-base/build/', worker));
});

auriserve.router.get('/res/elements-base/:file', (req, res) => {
	res.sendFile(path.join(auriserve.dataPath, '/plugins/elements-base/build/', req.params.file));
});
