import { hydrateElement } from 'hydrated';

import Grid from './page/layout/Grid';
import Image from './page/display/Image';
import Carousel from './page/layout/Carousel';

hydrateElement(Carousel);
hydrateElement(Image);
hydrateElement(Grid);

