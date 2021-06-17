import { hydrate } from './Hydration';

import { client as Float } from './elements/Float';
import { client as Calendar } from './elements/Calendar';
import { client as ImageView } from './elements/ImageView';
import { client as ImageGallery } from './elements/ImageGallery';

(() => {
	[ Float,
		Calendar,
		ImageView,
		ImageGallery
	].forEach(hydrate);
})();
