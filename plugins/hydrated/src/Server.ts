import path from 'path';
import as from 'auriserve';

import Static from './Static';
import hydrated from './Hydrated';

import './Style.pcss';

as.hydrated = {
	hydrated,
	Static,
};

const { addStylesheet, removeStylesheet } = as.elements;
const styles = path.join(__dirname, 'style.css');

addStylesheet(styles);
as.core.once('cleanup', () => {
	as.unexport('hydrated');
	removeStylesheet(styles);
});
