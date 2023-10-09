import { h } from 'preact';
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';

import InputContainer from './FieldContainer';

import type { FieldProps } from '.';
import useValidity from '../useValidity';
import useDerivedState from '../useDerivedState';

import { refs } from '../../../Util';
import useAutoFill from '../useAutoFill';
import { tw, merge } from '../../../Twind';

type Props = FieldProps<string | null> & {
	hideLabel?: boolean;
	placeholderLabel?: boolean;

	multiline?: boolean;
	minRows?: number;
	maxRows?: number;

	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	patternHint?: string;

	completion?: string;
};

function RawTextInput(props: Props & { type: 'text' | 'password' }) {
	const ref = useRef<HTMLElement>(null);
	const preRef = useRef<HTMLPreElement>(null);

	useEffect(() => {
		// Autofocus on first render if the autofocus prop is set.
		if (props.autofocus) setTimeout(() => ref.current?.focus(), 50);
		// This *should not* be called again if autofocus changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {
		ctx,
		value,
		id,
		path,
		label,
		required,
		disabled,
		readonly,
		onFocus,
		onBlur: stateOnBlur,
		onRef
	} = useDerivedState<string | null>(props, '', true);

	const {
		validate,
		onBlur: validityOnBlur,
		invalid,
	} = useValidity<string | null>({
		path,
		context: {},
		checks: [
			{
				condition: ({ value }) => required && !value?.length,
				message: 'Please fill in this field.',
			},
			{
				condition: ({ value }) => value && value.length > (props.maxLength ?? Infinity),
				message: `Must be at most ${props.maxLength} characters.`,
				severity: 'change',
			},
			{
				condition: ({ value }) => value && value.length < (props.minLength ?? 0),
				message: `Must be at least ${props.minLength} characters.`,
			},
			{
				condition: ({ value }) => value && props.pattern && !props.pattern.test(value),
				message: props.patternHint ?? 'Please match the pattern provided',
			},
		],
		onValidityChange: props.onValidity,
	});

	useLayoutEffect(() => void validate(value.current), [validate, value]);

	const [autofillRef, autofillClasses] = useAutoFill(invalid);

	const handleChange = ({ target }: any) => {
		const newValue: string | null = required ? target.value : target.value || null;
		if (preRef.current) preRef.current.innerText = `${newValue ?? ''}\n`;
		value.current = newValue;
		validate(newValue);
		props.onChange?.(newValue);
		ctx.event.emit('change', path, newValue);
	};

	const handleBlur = (evt: Event) => {
		validityOnBlur();
		stateOnBlur(evt);
	};

	const Tag = props.multiline ? 'textarea' : 'input';

	return (
		<InputContainer
			disabled={disabled}
			hideLabel={props.hideLabel}
			placeholderLabel={props.placeholderLabel}
			label={label}
			labelId={id}
			invalid={invalid}
			class={props.class}
			style={props.style}>
			{Tag === 'textarea' && <pre aria-hidden={true} ref={preRef}
				class={merge(tw`relative font-sans !opacity-0 interact-none text-accent-500
					w-full overflow-auto px-1.5 whitespace-pre-line break-words
					${(props.hideLabel || props.placeholderLabel) ? 'pt-[5px] pb-[3px]' : 'pt-5 pb-0'}`,
					autofillClasses)}
				style={{
					minHeight: props.minRows && `${props.minRows * 1.5 + 1}rem`,
					maxHeight: props.maxRows && `${props.maxRows * 1.5 + 1}rem`,
				}}>
				{`${value.current}\n`}
			</pre>}
			<Tag
				ref={refs(autofillRef, ref, props.fieldRef, onRef)}
				id={id}
				type={props.type}
				name={path}
				disabled={disabled}
				readonly={readonly}
				placeholder=' '
				autocomplete={props.completion ?? 'off'}
				aria-description={props.description}
				class={merge(
					tw`peer w-full px-1.5 !outline-none rounded
						${(props.hideLabel || props.placeholderLabel) ? 'pt-[5px] pb-[3px]' : 'pt-5 pb-0'}
						${(props.hideLabel || props.placeholderLabel) && invalid && '!text-red-300'}
						${props.multiline && `absolute top-0 left-0 w-full h-full resize-none !transition-none
							scroll-bar-gray-500 scroll-bar-hover-gray-400 scroll-gutter-gray-input focus:scroll-gutter-gray-700`}`,
					autofillClasses
				)}
				value={value.current ?? ''}
				onInput={handleChange}
				onFocus={onFocus}
				onBlur={handleBlur}
			/>
		</InputContainer>
	);
}

export function TextField(props: Props) {
	return <RawTextInput {...props} type='text' />;
}

export function PasswordField(props: Props) {
	return <RawTextInput {...props} type='password' />;
}
