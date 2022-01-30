import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useRef, useState, useMemo, useEffect, useCallback } from 'preact/hooks';

import InputContainer from './InputContainer';

import { refs } from '../Util';
import { tw, merge } from '../twind';

import { ErrorType } from './Type';

interface Props {
	id?: string;
	label: string;
	value?: string;

	completion?: string;

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
	const ref = useRef<HTMLInputElement>(null);
	const value = useRef<string>(props.value ?? '');

	const [invalid, setInvalid] = useState<boolean>(false);
	const [shouldShowInvalid, setShouldShowInvalid] = useState<boolean>(false);

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
	}, [handleValidate]);

	const handleChange = () => {
		if (!ref.current) return;
		const newValue = ref.current.value;
		value.current = newValue;
		props.onChange?.(newValue);
		handleValidate();
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

	const showInvalid = invalid && shouldShowInvalid;

	return (
		<InputContainer
			label={props.label}
			labelId={id}
			invalid={showInvalid}
			class={merge(tw`isolate`, props.class)}
			style={props.style}>
			<input
				ref={refs(ref, fRef)}
				id={id}
				type='password'
				placeholder=' '
				autocomplete={props.completion}
				class={tw`
					peer w-full px-1.5 pt-5 pb-0 rounded scroll-input !outline-none resize-none focus:shadow-md
					border-(4 gray-(input dark:focus:700)) bg-gray-(100 dark:input dark:focus:700)
					autofill:[box-shadow:0_0_0_1000px_#1D283F_inset]
					dark:focus:autofill:[box-shadow:0_0_0_1000px_#202D44_inset]
					autofill:first-line:(!font-sans !text-accent-100 !text-base)
					autofill:(![-webkit-text-fill-color:theme(colors.accent.100)] caret-accent-50)
					[transition:color_75ms,border-color_75ms,background-color_75ms,box-shadow_75ms]
					${showInvalid && 'text-red-800 focus:text-gray-900'}
					${showInvalid && 'dark:text-red-200 dark:hover:text-red-50 dark:focus:text-gray-100'}
				`}
				value={value.current}
				onInput={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
		</InputContainer>
	);
});
