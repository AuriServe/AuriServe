// import { addElement } from 'elements';

// import * as Elements from './editor';

// Object.values(Elements).forEach((elem) => addElement(elem));

import { registerPage, registerShortcut, Icon } from 'dashboard';

import PostsPage from './PostsPage';

registerPage({
	identifier: 'indieweb:posts',
	title: 'Posts',
	path: '/posts',
	component: PostsPage,
});

registerShortcut({
	identifier: 'indieweb:posts',
	icon: Icon.receipt,
	title: 'View Posts',
	aliases: ['go posts'],
	description: 'View and edit site posts.',
	action: ({ navigate }: any) => navigate('/posts/'),
});
