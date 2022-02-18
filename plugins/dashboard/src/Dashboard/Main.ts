import { h, render } from 'preact';

import App from './Component/App';

render(h(App, {}), document.getElementById('root')!);

export { Page } from './Component/Page';
export { default as Svg } from './Component/Svg';
export { default as Modal } from './Component/Modal';
export { default as Title } from './Component/Title';
export { default as Portal } from './Component/Portal';
export { default as Spinner } from './Component/Spinner';
export { Transition, TransitionGroup } from './Component/Transition';
export { default as DimensionTransition } from './Component/DimensionTransition';
export { Form, Input, Description, FloatingDescription } from './Component/Form';

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
