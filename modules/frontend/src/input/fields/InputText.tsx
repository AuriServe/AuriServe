import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { useRef, useLayoutEffect } from 'preact/hooks';

import './InputText.sass';

import { WidgetProps } from '../Input';

/**
 * Automatically scales a HTML TextArea element to the height of its content,
 * or the specified max-height, whichever is smaller. Returns a ref to attach to
 * the TextArea which should be scaled.
 *
 * @param {number} maxHeight - An optional maximum height, defaults to Infinity.
 * @param {any[]} dependents - A list of dependent variables for the TextArea's content.
 * @return {RefObject} - A RefObject to attach to the targeted TextArea.
 */

function useAutoTextArea(maxHeight?: number, dependents?: any[]): Preact.RefObject<HTMLTextAreaElement> {
	const ref = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;
		ref.current.style.height = '';
		ref.current.style.height = Math.min(ref.current.scrollHeight + 2, maxHeight ?? Infinity) + 'px';
	}, [ ref.current, ...dependents || [] ]);

	return ref;
}

interface Props extends WidgetProps {
	long?: boolean;
	code?: boolean;
	maxHeight?: number;

	min?: number;
	max?: number;
}

/**
 * A line text input widget, either a single-line input form
 * or an autoscaling textarea depending on a prop.
 */

const InputText = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>((props, fRef) => {
	const ref = useAutoTextArea(props.maxHeight ?? 420, [ props.value ]);
	
	const cb = (evt: any) => props.setValue(evt.target.value);
	const sharedProps = {
		value: props.value,
		onInput: cb,
		onChange: cb,
		onFocus: props.onFocusChange ? () => props.onFocusChange!(true) : undefined,
		onBlur: props.onFocusChange ? () => props.onFocusChange!(false) : undefined,
		minLength: props.min,
		maxLength: props.max,
		disabled: props.disabled,
		placeholder: props.placeholder,
		style: props.style
	};

	return (
		props.long ?
			<textarea
				{...sharedProps}
				class={('InputText Long ' + (props.class ?? '') + (props.code ? ' Code' : '')).trim()}

				rows={1}
				ref={(newRef) => {
					ref.current = newRef;
					if (fRef) fRef.current = newRef as any;
				}} />
			:
			<input
				{...sharedProps}
				class={('InputText Short ' + (props.class ?? '') + (props.code ? ' Code' : '')).trim()}

				type='text'
				ref={fRef as any} />
	);
});

export default InputText;
