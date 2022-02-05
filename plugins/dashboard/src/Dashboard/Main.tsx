import { h, render } from 'preact';

import App from './App';

render(<App />, document.getElementById('root')!);

export { default as Card, CardBody, CardHeader, CardFooter, CardToolbar } from './Card';
export { Form, Input, Description, FloatingDescription } from './Form';
export { DimensionTransition, Modal, Page, Portal, Spinner, Title } from './structure';
export { Transition, TransitionGroup } from './Transition';
export {
	default as Button,
	PrimaryButton,
	SecondaryButton,
	TertiaryButton,
	LinkButton,
} from './Button';
export { default as Svg } from './Svg';

export { useData, executeQuery } from './Graph';
export { tw, merge } from './Twind';

export { default as EventEmitter } from './EventEmitter';
