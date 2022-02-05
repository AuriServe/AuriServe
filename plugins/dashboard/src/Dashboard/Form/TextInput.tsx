import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useRef, useState, useMemo, useEffect, useCallback } from 'preact/hooks';

import InputContainer from './InputContainer';

import { refs } from '../Util';
import { ErrorType } from './Type';
import { tw, merge } from '../Twind';
import useAutoFill from './useAutoFill';

interface Props {
	id?: string;
	label: string;
	value?: string;

	completion?: string;
	multiline?: boolean;
	maxHeight?: number;

	optional?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	patternHint?: string;

	onChange?: (value: string) => void;
	onValidity?: (error: ErrorType | null, message: string | null) => void;
	onFocus?: (elem: HTMLElement) => void;
	onBlur?: (elem: HTMLElement) => void;

	style?: any;
	class?: string;
}

export default forwardRef<HTMLElement, Props>(function TextInput(props, fRef) {
	const ref = useRef<HTMLElement>(null);
	const value = useRef<string>(props.value ?? '');

	const [invalid, setInvalid] = useState<boolean>(false);
	const [shouldShowInvalid, setShouldShowInvalid] = useState<boolean>(false);

	const showInvalid = invalid && shouldShowInvalid;
	const [autofillRef, autofillClasses] = useAutoFill(showInvalid);

	const Tag = props.multiline ? 'textarea' : 'input';
	const id = useMemo(
		() => props.id ?? `no-form-${Math.random().toString(36).substring(2, 7)}`,
		[props.id]
	);

	const { optional, maxLength, minLength, pattern, patternHint, onValidity } = props;
	const handleValidate = useCallback(() => {
		let error: ErrorType | null = null;
		let errorMessage: string | null = null;

		if (!optional && value.current.length === 0) {
			error = 'required';
			errorMessage = 'Please fill in this field.';
		} else if (maxLength && value.current.length > maxLength) {
			error = 'maxLength';
			errorMessage = `Must be at most ${maxLength} characters.`;
		} else if (minLength && value.current.length < minLength) {
			error = 'minLength';
			errorMessage = `Must be at least ${minLength} characters.`;
		} else if (pattern && !pattern.test(value.current)) {
			error = 'pattern';
			errorMessage = patternHint ?? 'Please match the pattern provided';
		}

		setInvalid(error !== null);
		onValidity?.(error, errorMessage);
	}, [optional, maxLength, minLength, pattern, patternHint, onValidity]);

	useEffect(() => {
		if (!ref.current) return;
		handleValidate();
		if (props.multiline) {
			ref.current.style.minHeight = '';
			ref.current.style.minHeight = `${Math.min(
				ref.current.scrollHeight,
				props.maxHeight ?? 200
			)}px`;
		}
	}, [handleValidate, props.multiline, props.maxHeight]);

	const handleChange = () => {
		if (!ref.current) return;
		const newValue =
			Tag === 'input' ? (ref.current as HTMLInputElement).value : ref.current.innerText;
		value.current = newValue;
		props.onChange?.(newValue);
		handleValidate();
		if (props.multiline) {
			ref.current.style.minHeight = '';
			ref.current.style.minHeight = `${Math.min(
				ref.current.scrollHeight,
				props.maxHeight ?? 200
			)}px`;
		}
	};

	const handleFocus = () => {
		if (!ref.current) return;
		props.onFocus?.(ref.current);
	};

	const handleBlur = () => {
		if (!ref.current) return;
		props.onBlur?.(ref.current);
		setShouldShowInvalid(invalid);
	};

	return (
		<InputContainer
			label={props.label}
			labelId={id}
			invalid={showInvalid}
			class={props.class}
			style={props.style}>
			<Tag
				ref={refs(ref, fRef, autofillRef)}
				id={id}
				type='text'
				placeholder=' '
				autocomplete={props.completion}
				rows={1}
				class={merge(
					tw`peer w-full px-1.5 pt-5 pb-0 rounded scroll-input !outline-none resize-none`,
					autofillClasses
				)}
				value={Tag === 'input' ? value.current : undefined}
				onInput={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}>
				{Tag === 'textarea' ? value.current : undefined}
			</Tag>

			{props.multiline && (
				<div
					class={tw`absolute top-0 w-[calc(100%-16px)] h-6 rounded-tl
					transition bg-gray-input dark:peer-focus:bg-gray-700 interact-none`}
				/>
			)}
		</InputContainer>
	);
});
