import path from 'path';
import auriserve from 'auriserve';
import { addElement, removeElement, addStylesheet, removeStylesheet } from 'elements';
import * as Database from './Database';

import * as Elements from '../page';

import '../Style.pcss';
const styles = path.join(__dirname, 'style.css');
addStylesheet(styles);

Object.values(Elements).forEach((elem) => addElement(elem));
auriserve.once('cleanup', () => {
	Object.values(Elements).forEach((elem) => removeElement(elem.identifier));
	removeStylesheet(styles);
});

// import { readEverbook } from './Everbook';

// readEverbook('/home/auri/.minecraft/everbook/everbook-d66fb1ca-5d12-4b13-8f4d-04b952a555c8.dat');

const now = Math.floor(Date.now() / 1000);

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		tmp_image: '/media/variant/background.480.webp',
		content: '<p>Thinking about the #indieweb... So cool how I can have everything that relates to me circle back to my own site!</p>'
	}
});

Database.addPost({
	type: 'post',
	created: now,
	modified: now,
	data: {
		title: 'You ever just think about like... everything?',
		tmp_image: '/media/variant/background.480.webp',
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> <p>The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. consectetur adipiscing elit.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus.</p> <p>The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'
	},
	media: [ 1 ],
	tags: [ 'contemplative', 'external', 'vibe' ],
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		tmp_image: '/media/variant/dragon.480.webp',
		content: '<p>WIP Formatting options for Text in the GUI API! This gives modders and users more flexibility when formatting messages :}</p><p>Also WIP Chat mod!</p>'
	}
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		content: '<p>Hell yes! I got the Zepha\'s memory usage down to &lt; 400mb w/ compression and more efficient vertices.</p>'
	}
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		tmp_image: '/media/variant/tabaxi.480.webp',
		content: '<p>my substitute prof came into our lab today, and just silently responded to emails for 20 minutes. HELLO? YOU\'RE SUPPOSED TO TEACH</p>'
	}
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		content: '<p>When the Group DMs outnumber the individual DMs in Discord o___o</p>'
	}
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		content: '<p>Spending time with friends you haven\'t seen in a while is ❤️</p>'
	}
});

Database.addPost({
	type: 'post',
	created: now,
	modified: now,
	data: {
		title: 'I think about nothing.',
		tmp_image: '/media/variant/background_2.480.webp',
		content: '<p>A few months ago, I discovered a new technique to grid alignment in CSS that allowed for incredibly simple masonry layouts using only server-side Javascript. I haven\'t seen anyone else doing this yet, so I thought I\'d share.</p><p>Divide your grid up into the desired number of columns, and then set the row height to a small value, (e.g. 8px). Then, for each element you want to add to the layout, get its aspect ratio, and set its row span to the ratio divided by the row height. Finally, set the grid mode to dense. Tada, you now have a masonry layout!'
	},
	media: [ 1 ],
	tags: [ 'contemplative', 'external', 'vibe' ]
});

Database.addPost({
	type: 'art',
	created: now,
	modified: now,
	data: {
		title: 'Cat Sketch',
		tmp_image: '/media/variant/background_3.480.webp',
		shape: 'landscape',
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
	},
	media: [ 15 ],
	tags: [ 'sketch', 'snep', 'comic' ],
});

Database.addPost({
	type: 'art',
	created: now,
	modified: now,
	data: {
		title: 'Tabaxi Sorceress',
		tmp_image: '/media/variant/tabaxi.480.webp',
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
	},
	media: [ 2 ],
	tags: [ 'furry', 'sketch', 'grayscale', 'snep' ],
});

Database.addPost({
	type: 'art',
	created: now,
	modified: now,
	data: {
		title: 'Dragon',
		tmp_image: '/media/variant/dragon.480.webp',
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
	},
	media: [ 2 ],
	tags: [ 'furry', 'colored' ],
});

Database.addPost({
	type: 'art',
	created: now,
	modified: now,
	data: {
		title: 'Snow Leopard',
		tmp_image: '/media/variant/tabaxi.480.webp',
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
	},
	media: [ 2 ],
	tags: [ 'furry', 'sketch', 'grayscale', 'snep' ],
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		content: '<p>Hell yes! I got the Zepha\'s memory usage down to &lt; 400mb w/ compression and more efficient vertices. This opens the door for better shaders and render distance. Minecraft uses ~1.5gb😬</p>'
	}
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		content: '<p>my substitute prof came into our lab today, and just silently responded to emails for 20 minutes. HELLO? YOU\'RE SUPPOSED TO TEACH</p>'
	}
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		content: '<p>Spending time with friends you haven\'t seen in a while is ❤️</p>'
	}
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		content: '<p>When the Group DMs outnumber the individual DMs in Discord o___o</p>'
	}
});

Database.addPost({
	type: 'note',
	created: now,
	modified: now,
	data: {
		content: '<p>Hell yes! I got the Zepha\'s memory usage down to &lt; 400mb w/ compression and more efficient vertices.</p>'
	}
});
