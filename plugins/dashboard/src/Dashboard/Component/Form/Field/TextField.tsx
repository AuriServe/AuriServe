import { h } from 'preact';
import { useState, useCallback, useLayoutEffect } from 'preact/hooks';

import InputContainer from './FieldContainer';

import { useDerivedState } from '../useDerivedState';
import { ValidityError, FieldProps, errorEq } from '../Types';

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

function validate(
	value: string | null,
	required: boolean,
	minLength?: number,
	maxLength?: number,
	pattern?: RegExp,
	patternHint?: string
): ValidityError | null {
	if (required && !value?.length)
		return { type: 'required', message: 'Please fill in this field.' };
	else if (value && value.length > (maxLength ?? Infinity))
		return {
			type: 'maxLength',
			message: `Must be at most ${maxLength} characters.`,
		};
	else if (value && value.length < (minLength ?? 0))
		return {
			type: 'minLength',
			message: `Must be at least ${minLength} characters.`,
		};
	else if (value && pattern && !pattern.test(value))
		return {
			type: 'pattern',
			message: patternHint ?? 'Please match the pattern provided',
		};
	return null;
}

function RawTextInput(props: Props & { type: 'text' | 'password' }) {
	// console.log('render field');
	const { ctx, value, id, path, label, required, disabled, readonly } = useDerivedState<
		string | null
	>(props, '', true);

	const [error, setError] = useState<ValidityError | null>(null);
	const [shouldShowInvalid, setShouldShowInvalid] = useState<boolean>(false);

	const showInvalid = !!error && shouldShowInvalid;
	const [autofillRef, autofillClasses] = useAutoFill(showInvalid);

	const checkValidation = useCallback(
		(value: string | null) =>
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

	const { onValidity } = props;
	useLayoutEffect(() => {
		const error = checkValidation(value.current);
		setError(error);
		onValidity?.(error);
	}, [checkValidation, value, onValidity]);

	const handleChange = ({ target }: any) => {
		const newValue: string | null = required
			? (target.value as string)
			: target.value === ''
			? null
			: (target.value as string);

		value.current = newValue;
		const error = checkValidation(newValue);

		setError((oldError) => (errorEq(oldError, error) ? oldError : error));
		props.onValidity?.(error);
		props.onChange?.(newValue);
		ctx.event.emit('validity', path, error);
		ctx.event.emit('change', path, newValue);
	};

	const handleFocus = (evt: any) => {
		props.onFocus?.(evt.target);
		ctx.event.emit('focus', path, true);
	};

	const handleBlur = (evt: any) => {
		props.onBlur?.(evt.target);
		setShouldShowInvalid(!!error);
		ctx.event.emit('focus', path, false);
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
				ref={refs(autofillRef, (elem) => (ctx.meta.current[path] = { elem, error }))}
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
						${props.hideLabel ? 'pt-[5px] pb-[3px]' : 'pt-5 pb-0'}`,
					autofillClasses
				)}
				value={value.current ?? ''}
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
