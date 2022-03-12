import { h, render } from 'preact';

import App from './Component/App';

import * as Icon from './Icon';
import { registerSettings } from './Settings';
import {
	OverviewSettings,
	UserSettings /*, PermissionSettings*/,
} from './Component/Page';

registerSettings({
	identifier: 'dashboard:overview',
	title: 'Overview',
	path: 'overview',
	icon: Icon.home,
	component: OverviewSettings,
});

registerSettings({
	identifier: 'dashboard:users',
	title: 'Users',
	path: 'users',
	icon: Icon.users,
	permissions: ['view_users'],
	component: UserSettings,
});

// registerSettings({
// 	identifier: 'dashboard:permissions',
// 	title: 'Permissions',
// 	path: 'permissions',
// 	icon: Icon.role,
// 	permissions: ['view_permissions'],
// 	component: PermissionSettings,
// });

render(h(App, {}), document.getElementById('root')!);

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

export { useData, executeQuery } from './Graph';
export { registerPage, unregisterPage } from './Page';
export { registerShortcut, unregisterShortcut } from './Shortcut';
export { registerSettings, unregisterSettings } from './Settings';

import * as Preact from 'preact';
// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT = Preact;

import * as PreactCompat from 'preact/compat';
// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT_COMPAT = PreactCompat;

import * as PreactHooks from 'preact/hooks';
// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT_HOOKS = PreactHooks;
