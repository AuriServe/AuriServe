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

	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	patternHint?: string;

	completion?: string;
};

function RawTextInput(props: Props & { type: 'text' | 'password' }) {
	const ref = useRef<HTMLElement>(null);

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
		value.current = newValue;
		validate(newValue);
		props.onChange?.(newValue);
		ctx.event.emit('change', path, newValue);
	};

	const handleBlur = (evt: Event) => {
		validityOnBlur();
		stateOnBlur(evt);
	};

	return (
		<InputContainer
			hideLabel={props.hideLabel}
			label={label}
			labelId={id}
			invalid={invalid}
			class={props.class}
			style={props.style}>
			<input
				ref={refs(autofillRef, ref, (elem) => ctx.setFieldRef(path, elem))}
				id={id}
				type={props.type}
				name={path}
				disabled={disabled}
				readonly={readonly}
				placeholder=' '
				autocomplete={props.completion}
				aria-description={props.description}
				class={merge(
					tw`peer w-full px-1.5 !outline-none rounded
						${props.hideLabel ? 'pt-[5px] pb-[3px]' : 'pt-5 pb-0'}
						${props.hideLabel && invalid && '!text-red-300'}`,
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
