import { h } from 'preact';
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';

import InputContainer from './FieldContainer';

import type { FieldProps } from '.';
import useValidity from '../useValidity';
import useDerivedState from '../useDerivedState';

import { refs } from '../../../Util';
import useAutoFill from '../useAutoFill';
import { tw, merge } from '../../../Twind';
import { useClasses } from '../../../Hooks';
import { useRerender } from 'vibin-hooks';

type Props = FieldProps<string | null> & {
	hideLabel?: boolean;
	placeholderLabel?: boolean;
	placeholder?: string;

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
	const classes = useClasses(props.class);
	const rerender = useRerender();

	useEffect(() => {
		// Autofocus on first render if the autofocus prop is set.
		if (props.autofocus) setTimeout(() => (ref.current as HTMLInputElement)?.select(), 50);
		// This *should not* be called again if autofocus changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {
		value,
		setValue,
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

	const [ autofillRef, autofillClasses ] = useAutoFill(invalid);

	const handleChange = ({ target }: any) => {
		const newValue: string | null = required ? target.value : target.value || null;
		if (preRef.current) preRef.current.innerText = newValue ? `${newValue ?? ''}\n` : props.placeholder ?? '';
		const needsRerender = !!value.current !== !!newValue;
		setValue(newValue);
		validate(newValue);
		if (needsRerender) rerender();
	};

	const handleBlur = (evt: Event) => {
		validityOnBlur();
		stateOnBlur(evt);
	};

	const Tag = props.multiline ? 'textarea' : 'input';
	const placeholderVisible = !!(!value.current && props.placeholder);

	return (
		<InputContainer
			disabled={disabled}
			hideLabel={props.hideLabel}
			placeholderLabel={props.placeholderLabel}
			label={label}
			labelId={id}
			invalid={invalid}
			class={classes}
			populated={!!value.current || placeholderVisible}
			style={props.style}>
			<Tag
				ref={refs(autofillRef, ref, props.fieldRef, onRef)}
				id={id}
				type={props.type}
				name={path}
				disabled={disabled}
				readonly={readonly}
				placeholder={Tag === 'input' ? props.placeholder : ' '}
				autocomplete={props.completion ?? 'off'}
				aria-description={props.description}
				class={merge(
					tw`peer w-full px-1.5 !outline-none rounded
						${(props.hideLabel || props.placeholderLabel) ? 'pt-[5px] pb-[3px]' : 'pt-5 pb-0'}
						${(props.hideLabel || props.placeholderLabel) && invalid && '!text-red-300'}
						${props.multiline && `absolute top-0 left-0 w-full h-full resize-none !transition-none
							scroll-bar-(gray-500 hover-gray-400) --scroll-gutter[var(--input-background,rgb(var(--theme-gray-input)))]
							focus:--scroll-gutter[var(--input-background-focus,rgb(var(--theme-gray-700)))]
							not-focus:(!text-transparent !-webkit-text-fill-color[transparent])`}`,
					classes.get('input'),
					classes.get('text'),
					autofillClasses
				)}
				value={value.current ?? ''}
				onInput={handleChange}
				onFocus={onFocus}
				onBlur={handleBlur}
			/>
			{Tag === 'textarea' && <pre
				ref={preRef}
				aria-hidden={true}
				class={merge(
					tw`PreBaseClasses~(relative font-sans interact-none text-accent-500
						w-full overflow-auto px-1.5 whitespace-pre-line break-words z-10)
						${!placeholderVisible && 'peer-focus:opacity-0 opacity-100'}
						${(props.hideLabel || props.placeholderLabel) ? 'pt-[5px] pb-[3px]' : 'pt-5 pb-0'}`,
					autofillClasses,
					classes.get('text'),
					classes.get('pre'),
					tw`PreReset~(!bg-transparent !transition-none !box-shadow[none]
						!border-transparent !-webkit-text-fill-color[unset]`,
					placeholderVisible && merge(tw`PlaceholderReset~(!text-gray-400)`, classes.get('placeholder')),
				)}
				style={{
					minHeight: props.minRows && `${props.minRows * 1.5 + 1}rem`,
					maxHeight: props.maxRows && `${props.maxRows * 1.5 + 1}rem`,
				}}>
				{`${value.current || props.placeholder}\n`}
			</pre>}
		</InputContainer>
	);
}

export function TextField(props: Props) {
	return <RawTextInput {...props} type='text' />;
}

export function PasswordField(props: Props) {
	return <RawTextInput {...props} type='password' />;
}
