import { h } from 'preact';
import { useState, useCallback, useLayoutEffect } from 'preact/hooks';

import InputContainer from './FieldContainer';

import { useDerivedState } from '../useDerivedState';
import { ValidityError, FieldProps } from '../Types';

import { refs } from '../../../Util';
import useAutoFill from '../useAutoFill';
import { tw, merge } from '../../../Twind';

type Props = FieldProps<string | undefined> & {
	hideLabel?: boolean;

	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	patternHint?: string;

	completion?: string;
};

function validate(
	value: string | undefined,
	required: boolean,
	minLength?: number,
	maxLength?: number,
	pattern?: RegExp,
	patternHint?: string
): ValidityError | null {
	if (required && !value?.length) {
		return { type: 'required', message: 'Please fill in this field.' };
	} else if (value && value.length > (maxLength ?? Infinity)) {
		return {
			type: 'maxLength',
			message: `Must be at most ${maxLength} characters.`,
		};
	} else if (value && value.length < (minLength ?? 0)) {
		return {
			type: 'minLength',
			message: `Must be at least ${minLength} characters.`,
		};
	} else if (value && pattern?.test(value)) {
		return {
			type: 'pattern',
			message: patternHint ?? 'Please match the pattern provided',
		};
	}
	return null;
}

function RawTextInput(props: Props & { type: 'text' | 'password' }) {
	console.log('render field');
	const { ctx, value, id, label, required, disabled, readonly } = useDerivedState<
		string | undefined
	>(props, '');

	const [invalid, setInvalid] = useState<boolean>(false);
	const [shouldShowInvalid, setShouldShowInvalid] = useState<boolean>(false);

	const showInvalid = invalid && shouldShowInvalid;
	const [autofillRef, autofillClasses] = useAutoFill(showInvalid);

	const checkValidation = useCallback(
		(value: string | undefined) =>
			validate(
				value,
				required,
				props.minLength,
				props.maxLength,
				props.pattern,
				props.patternHint
			),
		[required, props.minLength, props.maxLength, props.pattern, props.patternHint]
	);
	useLayoutEffect(() => void checkValidation(value.current), [checkValidation, value]);

	const handleChange = ({ target }: any) => {
		const newValue: string | undefined = required
			? (target.value as string)
			: target.value === ''
			? undefined
			: (target.value as string);

		value.current = newValue;
		const error = checkValidation(newValue);

		props.onValidity?.(error);
		setInvalid(error !== null);
		props.onChange?.(newValue);
		ctx.event.emit('change', props.path!, newValue);
	};

	const handleFocus = (evt: any) => {
		props.onFocus?.(evt.target);
		ctx.event.emit('focus', props.path!);
	};

	const handleBlur = (evt: any) => {
		props.onBlur?.(evt.target);
		setShouldShowInvalid(invalid);
		ctx.event.emit('focus', null);
	};

	return (
		<InputContainer
			hideLabel={props.hideLabel}
			label={label}
			labelId={id}
			invalid={showInvalid}
			class={props.class}
			style={props.style}>
			<input
				ref={refs(
					autofillRef,
					(ref) => (ctx.refs.current[props.path!] = ref ?? undefined)
				)}
				id={id}
				type={props.type}
				name={props.path}
				disabled={disabled}
				readonly={readonly}
				placeholder=' '
				autocomplete={props.completion}
				aria-description={props.description}
				class={merge(
					tw`peer w-full px-1.5 !outline-none rounded
						${props.hideLabel ? 'pt-[5px] pb-[3px]' : 'pt-5 pb-0'}`,
					autofillClasses
				)}
				value={value.current}
				onInput={handleChange}
				onFocus={handleFocus}
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
