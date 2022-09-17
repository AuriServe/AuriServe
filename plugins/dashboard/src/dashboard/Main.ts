import './Preact';
import { h, render } from 'preact';

import App from './Component/App';

import * as Icon from './Icon';
import { registerSettings } from './Settings';
import { UserSettings, PermissionSettings, AppearanceSettings, OverviewSettings, PluginsSettings }
	from './Component/Page';

registerSettings({
	identifier: 'dashboard:overview',
	title: 'Overview',
	path: 'overview',
	icon: Icon.info,
	permissions: [],
	component: OverviewSettings,
});

registerSettings({
	identifier: 'dashboard:appearance',
	title: 'Appearance',
	path: 'appearance',
	icon: Icon.theme,
	permissions: [],
	component: AppearanceSettings,
});

registerSettings({
	identifier: 'dashboard:users',
	title: 'Users',
	path: 'users',
	icon: Icon.users,
	permissions: ['view_users'],
	component: UserSettings,
});

registerSettings({
	identifier: 'dashboard:permissions',
	title: 'Permissions',
	path: 'permissions',
	icon: Icon.role,
	permissions: ['view_permissions'],
	component: PermissionSettings,
});

registerSettings({
	identifier: 'dashboard:plugins',
	title: 'Plugins',
	path: 'plugins',
	icon: Icon.plugin,
	permissions: [],
	component: PluginsSettings,
});

export { useLocation, useNavigate } from 'react-router-dom';

export { Page } from './Component/Page';
export { default as Svg } from './Component/Svg';
export { default as Modal } from './Component/Modal';
export { default as Title } from './Component/Title';
export { SavePrompt } from './Component/SavePrompt';
export { default as Portal } from './Component/Portal';
export { default as Tooltip } from './Component/Tooltip';
export { default as Spinner } from './Component/Spinner';
export { Transition, TransitionGroup } from './Component/Transition';
export { default as Form, Field, FieldGroup } from './Component/Form';
export { default as DimensionTransition } from './Component/DimensionTransition';

export {
	default as Card,
	CardBody,
	CardHeader,
	CardFooter,
	CardToolbar,
} from './Component/Card';

export {
	default as Button,
	PrimaryButton,
	SecondaryButton,
	TertiaryButton,
	LinkButton,
} from './Component/Button';

export { default as Menu } from './Component/Menu/Menu';

export { tw, merge } from './Twind';
export { refs, elementBounds } from './Util';

export * as Icon from './Icon';
export { default as EventEmitter } from './EventEmitter';

export * as Graph from './Graph';
export { useData, executeQuery } from './Graph';
export { registerPage, unregisterPage } from './Page';
export { registerShortcut, unregisterShortcut } from './Shortcut';
export { registerSettings, unregisterSettings } from './Settings';

export { AppContext } from './Component/App';

render(h(App, {}), document.getElementById('root')!);

const DEBUG_SOCKET_ADDRESS = `ws://${location.hostname}:11148`;
const socket = new WebSocket(DEBUG_SOCKET_ADDRESS);
socket.addEventListener('open', () => {
	socket.addEventListener('close', () => {
		let attempts = 0;
		(function awaitServerAndReload() {
			const socket = new WebSocket(DEBUG_SOCKET_ADDRESS);
			socket.addEventListener('open', () => window.location.reload());
			socket.addEventListener('error', () => {
				if (++attempts < 20) setTimeout(awaitServerAndReload, 100);
			});
		})();
	});
});
