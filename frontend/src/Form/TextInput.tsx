import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { merge } from 'common/util';
import { useRef, useState, useMemo, useEffect } from 'preact/hooks';

import InputContainer from './InputContainer';

import { ErrorType } from './Type';

interface Props {
	id?: string;
	label: string;
	value?: string;

	optional?: boolean;
	minLength?: number;
	maxLength?: number;
	multiline?: boolean;
	maxHeight?: number;
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
	const value = useRef<string>(props.value);

	const [ invalid, setInvalid ] = useState<boolean>(false);
	const [ shouldShowInvalid, setShouldShowInvalid ] = useState<boolean>(false);

	const Tag = props.multiline ? 'textarea' : 'input';
	const id = useMemo(() => props.id ?? 'no-form-' + Math.random().toString(36).substr(2, 9), [ props.id ]);

	const handleRef = (elem: any) => {
		ref.current = elem;
		if (fRef) fRef.current = elem;
	};

	const handleValidate = () => {
		let error: ErrorType | null = null;
		let errorMessage: string | null = null;

		if (!props.optional && value.current.length === 0) {
			error = 'required';
			errorMessage = 'Please fill in this field.';
		}
		else if (props.maxLength && value.current.length > props.maxLength) {
			error = 'maxLength';
			errorMessage = `Must be at most ${props.maxLength} characters.`;
		}
		else if (props.minLength && value.current.length < props.minLength) {
			error = 'minLength';
			errorMessage = `Must be at least ${props.minLength} characters.`;
		}
		else if (props.pattern && !props.pattern.test(value.current)) {
			error = 'pattern';
			errorMessage = props.patternHint ?? 'Please match the pattern provided';
		}

		setInvalid(error !== null);
		props.onValidity?.(error, errorMessage);
	};

	useEffect(() => {
		handleValidate();
		if (props.multiline) {
			ref.current.style.height = '';
			ref.current.style.height = Math.min(ref.current.scrollHeight, props.maxHeight ?? 200) + 'px';
		}
	}, []);

	const handleChange = () => {
		const newValue = Tag === 'input' ? (ref.current as HTMLInputElement).value : ref.current.innerText;
		value.current = newValue;
		props.onChange?.(newValue);
		handleValidate();
		if (props.multiline) {
			ref.current.style.height = '';
			ref.current.style.height = Math.min(ref.current.scrollHeight, props.maxHeight ?? 200) + 'px';
		}
	};

	const handleFocus = () => {
		props.onFocus?.(ref.current);
	};

	const handleBlur = () => {
		props.onBlur?.(ref.current);
		setShouldShowInvalid(invalid);
	};

	const showInvalid = invalid && shouldShowInvalid;

	return (
		<InputContainer
			label={props.label} labelId={id}
			class={merge('isolate', props.class)}
			invalid={showInvalid}
			style={props.style}>
			<Tag
				id={id} type='text' placeholder=' '
				ref={handleRef} rows={1}
				class={merge('peer w-full px-2.5 pt-6 pb-1 rounded scroll-input',
					'!outline-none resize-none transition focus:shadow-md',
					'bg-neutral-100 dark:bg-neutral-input dark:focus:bg-neutral-700',
					showInvalid && 'text-red-800 focus:text-neutral-900',
					showInvalid && 'dark:text-red-200 dark:hover:text-red-50 dark:focus:text-neutral-100')}
				value={Tag === 'input' ? value.current : undefined}
				onInput={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
			>
				{Tag === 'textarea' ? value.current : undefined}
			</Tag>

			{props.multiline && <div class='absolute top-0 w-[calc(100%-16px)] h-6 rounded-tl
				transition bg-neutral-input dark:peer-focus:bg-neutral-700 interact-none'/>}
		</InputContainer>
	);
});
