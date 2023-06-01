import { hydrateElement } from 'hydrated';
import * as Elements from './page/_hydrated';
Object.values(Elements).forEach((elem) => hydrateElement(elem));
