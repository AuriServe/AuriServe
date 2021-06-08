import * as Preact from 'preact';
import { useEffect, useRef, useContext } from 'preact/hooks';

import Button from './Button';
import { SelectGroupContext } from './SelectGroup';
import ClickHandler, { ClickHandlerCallbacks } from '../ClickHandler';

import { mergeClasses } from '../Util';

interface Props {
	ind: number;
	doubleClickSelects?: boolean;
	callbacks?: ClickHandlerCallbacks;

	style?: any;
	class?: string;
	children?: Preact.ComponentChildren;
}

export default function Selectable(props: Props) {
	const ctx = useContext(SelectGroupContext);
	const handler = useRef<ClickHandler>(new ClickHandler());

	useEffect(() => {
		let callbacks: ClickHandlerCallbacks = { ...props.callbacks };
		if (!callbacks.onClick) callbacks.onClick = () => ctx.onSelect(props.ind);
		else {
			let clickCallback = callbacks.onClick;
			callbacks.onClick = e => {
				ctx.onSelect(props.ind);
				clickCallback(e);
			};
		}
		
		if (callbacks.onDoubleClick && props.doubleClickSelects) {
			let doubleClickCallback = callbacks.onDoubleClick;
			callbacks.onDoubleClick = e => {
				ctx.onSelect(props.ind, true);
				doubleClickCallback(e);
			};
		}

		handler.current.setCallbacks(callbacks);
	}, [ props.callbacks, props.ind, props.doubleClickSelects, props.callbacks, ctx.selected, ctx.onSelect ]);

	const selected = ctx.selected.indexOf(props.ind) !== -1;

	return (
		<Button onMouseUp={handler.current.handleMouseUp} style={props.style}
			class={mergeClasses(props.class,
				selected && '!bg-blue-300/30 dark:!bg-blue-400/10 !border-blue-400 dark:!border-blue-500/75',
				selected && 'active:!border-blue-800 focus-visible:!border-blue-800',
				selected && 'dark:active:!border-blue-300 dark:focus-visible:!border-blue-300')}
			highlightClass={mergeClasses(selected && '!bg-blue-600')}>
			{props.children}
		</Button>
	);
}
