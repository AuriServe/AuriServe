import { addElement } from 'elements';

import * as Elements from './editor';

Object.values(Elements).forEach((elem) => addElement(elem));
