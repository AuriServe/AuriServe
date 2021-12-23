import { h, ComponentChildren } from 'preact';
import { useEffect, useRef, useContext } from 'preact/hooks';

import { UnstyledButton } from '../Button';
import { SelectGroupContext } from './SelectGroup';
import ClickHandler, { ClickHandlerCallbacks } from '../ClickHandler';

import { merge } from 'common/util';

interface Props {
	ind: number;
	doubleClickSelects?: boolean;
	callbacks?: ClickHandlerCallbacks;

	style?: any;
	selectedStyle?: any;
	class?: string;
	selectedClass?: string;
	children?: ComponentChildren | ((selected: boolean) => ComponentChildren);
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
		<UnstyledButton
			onMouseUp={handler.current.handleMouseUp}
			class={merge(props.class, selected && props.selectedClass)}
			style={selected ? { ...props.style ?? {}, ...props.selectedStyle ?? {} } : props.style}>
			{typeof props.children === 'function' ? props.children(selected) : props.children}
		</UnstyledButton>
	);
}
