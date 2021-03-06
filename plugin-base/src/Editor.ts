import { admin  as ColumnLayout } from './elements/edit/ColumnLayout';
import { server as LinearLayout } from './elements/LinearLayout';
import { server as GridLayout } from './elements/GridLayout';

import { admin  as Float } from './elements/Float';
import { server as Section } from './elements/Section';
import { server as Container } from './elements/Container';

import { server as Button } from './elements/Button';
import { server as HTMLView } from './elements/HTMLView';
import { admin  as TextView } from './elements/edit/TextView';
import { admin  as ImageView } from './elements/edit/ImageView';
import { server as Navigation } from './elements/Navigation';
import { server as MarkdownView } from './elements/MarkdownView';

import { admin as Calendar } from './elements/edit/Calendar';
import { admin as ImageGallery } from './elements/edit/ImageGallery';

declare let serve: any;

(() => {
	[ ColumnLayout,
		LinearLayout,
		GridLayout,

		Float,
		Section,
		Container,

		Button,
		HTMLView,
		TextView,
		ImageView,
		Navigation,
		MarkdownView,

		Calendar,
		ImageGallery
	].forEach(serve.registerElement);
})();
