// eslint-disable-next-line
// @ts-ignore
import { registerPage, registerShortcut } from 'dashboard';

import PagesPage from './PagesPage';

registerPage({
	identifier: 'page-editor:pages',
	title: 'Pages',
	path: '/pages',
	component: PagesPage,
});

registerShortcut({
	identifier: 'page-editor:pages',
	title: 'View Pages',
	aliases: ['go pages'],
	description: 'View and edit site pages.',
	// icon: icon_page,
	action: ({ navigate }: any) => navigate('/pages/'),
});
