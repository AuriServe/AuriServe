import { h, render } from 'preact';

import App from './App';

render(h(App, {}), document.getElementById('root')!);

export { default as Card, CardBody, CardHeader, CardFooter, CardToolbar } from './Card';
export { Form, Input, Description, FloatingDescription } from './Form';
export { DimensionTransition, Modal, Page, Portal, Spinner, Title } from './Structure';
export { Transition, TransitionGroup } from './Transition';
export {
	default as Button,
	PrimaryButton,
	SecondaryButton,
	TertiaryButton,
	LinkButton,
} from './Button';
export { default as Svg } from './Svg';

export { tw, merge } from './Twind';

export { default as EventEmitter } from './EventEmitter';

export { useData, executeQuery } from './Graph';
export { registerPage, unregisterPage } from './Page';
export { registerShortcut, unregisterShortcut } from './Shortcut';

import * as Preact from 'preact';
import * as PreactCompat from 'preact/compat';
import * as PreactHooks from 'preact/hooks';

// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT = Preact;
// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT_COMPAT = PreactCompat;
// eslint-disable-next-line
// @ts-ignore
global.__AS_PREACT_HOOKS = PreactHooks;
