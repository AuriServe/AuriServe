import { h } from 'preact';
import { merge } from 'common/util';
import { forwardRef } from 'preact/compat';
import { useRef, useState, useMemo, useEffect, useCallback } from 'preact/hooks';

import InputContainer from './InputContainer';

import { ErrorType } from './Type';
import { refs } from '../Util';

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
			class={merge('isolate', props.class)}
			style={props.style}>
			<input
				ref={refs(ref, fRef)}
				id={id}
				type='password'
				placeholder=' '
				autocomplete={props.completion}
				class={merge(
					'peer w-full px-1.5 pt-5 pb-0 rounded scroll-input',
					'!outline-none resize-none focus:shadow-md',
					'border-4 border-neutral-input dark:focus:border-neutral-700',
					'bg-neutral-100 dark:bg-neutral-input dark:focus:bg-neutral-700',
					'autofill:![box-shadow:0_0_0px_1000px_theme(colors.neutral.input)_inset]',
					'dark:focus:autofill:![box-shadow:0_0_0px_1000px_theme(colors.neutral.700)_inset]',
					'autofill:first-line:!font-sans autofill:first-line:!text-accent-100 autofill:first-line:!text-base',
					'autofill:![-webkit-text-fill-color:theme(colors.accent.100)] autofill:caret-accent-50',
					'[transition:color_75ms,border-color_75ms,background-color_75ms,box_shadow_0ms]',
					showInvalid && 'text-red-800 focus:text-neutral-900',
					showInvalid &&
						'dark:text-red-200 dark:hover:text-red-50 dark:focus:text-neutral-100'
				)}
				value={value.current}
				onInput={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
		</InputContainer>
	);
});
