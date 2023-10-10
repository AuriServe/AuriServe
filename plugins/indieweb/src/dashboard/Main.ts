// import { addElement } from 'elements';

// import * as Elements from './editor';

// Object.values(Elements).forEach((elem) => addElement(elem));

import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import './styles.pcss';

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
