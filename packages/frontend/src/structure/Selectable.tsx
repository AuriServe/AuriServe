import * as Preact from 'preact';
import { useEffect, useRef, useContext } from 'preact/hooks';

import ClickHandler, { ClickHandlerCallbacks } from '../ClickHandler';
import { SelectGroupContext } from './SelectGroup';

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
		<button
			style={props.style}
			class={('Selectable ' + (props.class ?? '') + (selected ? ' Selected' : '')).trim()}
			onMouseUp={handler.current.handleMouseUp}>
			{props.children}
		</button>
	);
}
