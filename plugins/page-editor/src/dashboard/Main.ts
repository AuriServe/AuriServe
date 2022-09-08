import { registerPage, registerShortcut, Icon } from 'dashboard';

import RoutesPage from './RoutesPage';
import PageEditor from './PageEditor';

registerPage({
	identifier: 'page-editor:routes',
	title: 'Routes',
	path: '/routes',
	component: RoutesPage,
});

registerShortcut({
	identifier: 'page-editor:routes',
	icon: Icon.file,
	title: 'View Routes',
	aliases: ['go pages'],
	description: 'View and edit site routes.',
	action: ({ navigate }: any) => navigate('/routes/'),
});

registerPage({
	identifier: 'page-editor:page_editor_contents',
	title: 'Page Editor Contents',
	path: '/page_editor_contents',
	component: PageEditor
});

export { default as Overlay } from './Overlay';
export { default as SnapPoint } from './SnapPoint';
export { useEditor } from './Editor';
export { useElement } from './Element';
