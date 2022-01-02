import { hydrate } from 'plugin-api';

import { client as FAQ } from './elements/FAQ';
import { client as Float } from './elements/Float';
import { client as Calendar } from './elements/Calendar';
import { client as ImageView } from './elements/ImageView';
import { client as ImageGallery } from './elements/ImageGallery';
import { client as ImageCarousel } from './elements/ImageCarousel';

(() => {
	[ FAQ,
		Float,
		Calendar,
		ImageView,
		ImageGallery,
		ImageCarousel
	].forEach(hydrate);
})();
