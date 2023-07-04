import { hydrateElement } from 'hydrated';

import Hex from '../page/display/Hex';
import Iota from '../page/display/Iota';
import Image from '../page/display/Image';
import Note from '../page/display/Note';

hydrateElement(Hex);
hydrateElement(Image);
hydrateElement(Iota);
hydrateElement(Note);
