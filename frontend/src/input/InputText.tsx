/* eslint-disable */

import { h, RefObject } from 'preact';
import { forwardRef } from 'preact/compat';
import { useRef, useLayoutEffect } from 'preact/hooks';

import { InputProps, FocusableInputProps, TextInputProps } from './index';

import { merge } from 'common/util';

import style from './Input.sss';

/**
 * Automatically scales an HTML TextArea element to the height of its content,
 * or the specified max-height, whichever is smaller. Returns a ref to attach to
 * the TextArea which should be scaled.
 *
 * @param maxHeight - An optional maximum height, defaults to Infinity.
 * @param dependents - A list of dependent variables for the TextArea's content.
 * @returns a RefObject to attach to the targeted TextArea.
 */

function useAutoTextArea(maxHeight?: number, dependents?: any[]): RefObject<HTMLTextAreaElement> {
	const ref = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;
		ref.current.style.height = '';
		ref.current.style.height = Math.min(ref.current.scrollHeight + 2, maxHeight ?? Infinity) + 'px';
	}, [ref.current, ...(dependents || [])]);

	return ref;
}

/** Props for the text input element. */
interface Props extends InputProps, FocusableInputProps, TextInputProps {
	/** Whether or not the text should wrap. */
	multiline?: boolean;

	/** The maximum height of a multiline element, defaults to 420. */
	maxHeight?: number;

	/** Whether or not to use a monospace font. */
	mono?: boolean;

	/** Whether or not to obscure the entered text. */
	obscure?: boolean;
}

/**
 * A text input element, that is either a
 * single line field or an autoscaling textarea,
 * depending on the multiline prop.
 */

export default forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(function InputText(props: Props, fRef) {
	const ref = useAutoTextArea(props.maxHeight ?? 420, [props.value]);

	const onValue = (evt: any) => props.onValue?.(evt.target.value);
	const classes = merge(style.Input, props.mono && style.Mono, props.class);

	const fieldProps = {
		value: props.value,
		onInput: onValue,
		onChange: onValue,
		onFocus: props.onFocus,
		onBlur: props.onBlur,

		minLength: props.minLength,
		maxLength: props.maxLength,
		placeholder: props.placeholder,
		disabled: !(props.enabled ?? true),
		autoComplete: props.completion,

		style: props.style,
		class: classes,
	};

	return props.multiline ? (
		<textarea
			ref={(newRef) => {
				ref.current = newRef;
				if (fRef) fRef.current = newRef as any;
			}}
			rows={1}
			{...fieldProps}
		/>
	) : (
		<input ref={fRef as any} type={props.obscure ? 'password' : 'text'} {...fieldProps} />
	);
});
