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

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		banner: 19,
// 		content: '<p>Thinking about the #indieweb... So cool how I can have everything that relates to me circle back to my own site!</p>'
// 	},
// 	media: [ 19 ]
// });

// Database.addPost({
// 	type: 'blog',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Gamer time!',
// 		banner: 14,
// 		show_banner: false,
// 		content: '<p>Sometimes you just want to play video games, you know? Like sandbox games, the real sorta crazy building stuff that makes you feel like you\'ve made something. That you\'ve made something <em>real</em>, and you want everyone to see it.</p>'
// 	},
// 	media: [ 14 ],
// 	tags: [ 'contemplative', 'external', 'vibe' ],
// });

// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'How do games load SO MANY textures?',
// 		content: '<p>A crash-course in Sparse Bindless Texture Arrays, and related technologies.</p>',
// 		thumbnail: 27,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 25 ],
// 	tags: [ 'graphics', 'gamedev', 'programming' ],
// });

// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'THE RITUAL: Japanese 338 Video',
// 		content: '<p>My video project for my Intermediate Japanese course.</p>',
// 		thumbnail: 26,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 26 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });

// Database.addPost({
// 	type: 'art',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Dragon',
// 		media: 16,
// 		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
// 	},
// 	media: [ 16 ],
// 	tags: [ 'furry', 'colored' ],
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		banner: 19,
// 		content: '<p>Thinking about the #indieweb... So cool how I can have everything that relates to me circle back to my own site!</p>'
// 	},
// 	media: [ 19 ]
// });

// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Please be my friend!: Japanese 238 Video',
// 		content: '<p>My second video project for my Beginner Japanese II course.</p>',
// 		thumbnail: 30,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 30 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });

// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Imaginary Friends: Japanese 238 Video',
// 		content: '<p>My first video project for my Beginner Japanese II course.</p>',
// 		thumbnail: 29,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 29 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });

// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'My Toughest Week: Japanese 138 Video',
// 		content: '<p>My video project for my Beginner Japanese I course.</p>',
// 		thumbnail: 31,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 31 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });

// Database.addPost({
// 	type: 'blog',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'You ever just think about like... everything?',
// 		banner: 19,
// 		// show_banner: false,
// 		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> <p>The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. consectetur adipiscing elit.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus.</p> <p>The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'
// 	},
// 	media: [ 19 ],
// 	tags: [ 'contemplative', 'external', 'vibe' ],
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		media: 16,
// 		content: '<p>WIP Formatting options for Text in the GUI API! This gives modders and users more flexibility when formatting messages :}</p><p>Also WIP Chat mod!</p>'
// 	},
// 	media: [ 16 ]
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		content: '<p>Hell yes! I got the Zepha\'s memory usage down to &lt; 400mb w/ compression and more efficient vertices.</p>'
// 	}
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		media: 2,
// 		content: '<p>my substitute prof came into our lab today, and just silently responded to emails for 20 minutes. HELLO? YOU\'RE SUPPOSED TO TEACH</p>'
// 	},
// 	media: [ 2 ]
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		content: '<p>When the Group DMs outnumber the individual DMs in Discord o___o</p>'
// 	}
// });

// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'THE RITUAL: Japanese 338 Video',
// 		content: '<p>My video project for my Intermediate Japanese course.</p>',
// 		thumbnail: 42,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 26 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });

// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Imaginary Friends: Japanese 238 Video',
// 		content: '<p>My first video project for my Beginner Japanese II course.</p>',
// 		thumbnail: 43,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 29 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		content: '<p>Spending time with friends you haven\'t seen in a while is ❤️</p>'
// 	}
// });

// Database.addPost({
// 	type: 'blog',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'I think about nothing.',
// 		banner: 44,
// 		// show_banner: false,
// 		content: '<p>A few months ago, I discovered a new technique to grid alignment in CSS that allowed for incredibly simple masonry layouts using only server-side Javascript. I haven\'t seen anyone else doing this yet, so I thought I\'d share.</p><p>Divide your grid up into the desired number of columns, and then set the row height to a small value, (e.g. 8px). Then, for each element you want to add to the layout, get its aspect ratio, and set its row span to the ratio divided by the row height. Finally, set the grid mode to dense. Tada, you now have a masonry layout!'
// 	},
// 	media: [ 36 ],
// 	tags: [ 'contemplative', 'external', 'vibe' ]
// });

// Database.addPost({
// 	type: 'blog',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'I think about nothing.',
// 		banner: 45,
// 		// show_banner: false,
// 		content: '<p>A few months ago, I discovered a new technique to grid alignment in CSS that allowed for incredibly simple masonry layouts using only server-side Javascript. I haven\'t seen anyone else doing this yet, so I thought I\'d share.</p><p>Divide your grid up into the desired number of columns, and then set the row height to a small value, (e.g. 8px). Then, for each element you want to add to the layout, get its aspect ratio, and set its row span to the ratio divided by the row height. Finally, set the grid mode to dense. Tada, you now have a masonry layout!'
// 	},
// 	media: [ 17 ],
// 	tags: [ 'contemplative', 'external', 'vibe' ]
// });
// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'THE RITUAL: Japanese 338 Video',
// 		content: '<p>My video project for my Intermediate Japanese course.</p>',
// 		thumbnail: 44,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 26 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });

// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Imaginary Friends: Japanese 238 Video',
// 		content: '<p>My first video project for my Beginner Japanese II course.</p>',
// 		thumbnail: 29,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 29 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });


// Database.addPost({
// 	type: 'art',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Cat Sketch',
// 		media: 13,
// 		shape: 'portrait',
// 		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
// 	},
// 	media: [ 13 ],
// 	tags: [ 'sketch', 'snep', 'comic' ],
// });


// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'THE RITUAL: Japanese 338 Video',
// 		content: '<p>My video project for my Intermediate Japanese course.</p>',
// 		thumbnail: 26,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 26 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });

// Database.addPost({
// 	type: 'video',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Imaginary Friends: Japanese 238 Video',
// 		content: '<p>My first video project for my Beginner Japanese II course.</p>',
// 		thumbnail: 29,
// 		url: 'https://www.youtube.com/watch?v=YTfdBSjitd8',
// 	},
// 	media: [ 29 ],
// 	tags: [ 'japanese', 'skit', 'school' ],
// });


// Database.addPost({
// 	type: 'art',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Tabaxi Sorceress',
// 		media: 12,
// 		shape: 'square',
// 		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
// 	},
// 	media: [ 12 ],
// 	tags: [ 'furry', 'sketch', 'grayscale', 'snep' ],
// });

// Database.addPost({
// 	type: 'art',
// 	created: now,
// 	modified: now,
// 	data: {
// 		title: 'Snow Leopard',
// 		media: 2,
// 		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
// 	},
// 	media: [ 2 ],
// 	tags: [ 'furry', 'sketch', 'grayscale', 'snep' ],
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		content: '<p>Hell yes! I got the Zepha\'s memory usage down to &lt; 400mb w/ compression and more efficient vertices. This opens the door for better shaders and render distance. Minecraft uses ~1.5gb😬</p>'
// 	}
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		content: '<p>my substitute prof came into our lab today, and just silently responded to emails for 20 minutes. HELLO? YOU\'RE SUPPOSED TO TEACH</p>'
// 	}
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		content: '<p>Spending time with friends you haven\'t seen in a while is ❤️</p>'
// 	}
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		content: '<p>When the Group DMs outnumber the individual DMs in Discord o___o</p>'
// 	}
// });

// Database.addPost({
// 	type: 'note',
// 	created: now,
// 	modified: now,
// 	data: {
// 		content: '<p>Hell yes! I got the Zepha\'s memory usage down to &lt; 400mb w/ compression and more efficient vertices.</p>'
// 	}
// });
