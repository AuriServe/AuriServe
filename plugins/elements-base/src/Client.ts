import { hydrateElement } from 'hydrated';

import Grid from './page/layout/Grid';
import Image from './page/display/Image';
import Carousel from './page/layout/Carousel';
import Float from './page/structure/Float';
import PDF from './page/display/PDF';

hydrateElement(Carousel);
hydrateElement(Image);
hydrateElement(Grid);
hydrateElement(PDF);
hydrateElement(Float);

