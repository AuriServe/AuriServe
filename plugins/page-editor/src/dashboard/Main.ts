import { registerPage, registerShortcut, Icon } from 'dashboard';

import PagesPage from './PagesPage';

fetch('/dashboard/res/theme.css').then(r => r.text()).then(css => {
	const style = document.createElement('style');
	style.innerHTML = css;
	document.head.appendChild(style);
});

registerPage({
	identifier: 'page-editor:pages',
	title: 'Pages',
	path: '/pages',
	component: PagesPage,
});

registerShortcut({
	identifier: 'page-editor:pages',
	icon: Icon.file,
	title: 'View Pages',
	aliases: ['go pages'],
	description: 'View and edit site pages.',
	action: ({ navigate }: any) => navigate('/pages/'),
});
