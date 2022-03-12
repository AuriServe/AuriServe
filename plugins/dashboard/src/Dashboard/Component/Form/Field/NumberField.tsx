import { h } from 'preact';
import { useCallback, useLayoutEffect, useRef, useEffect } from 'preact/hooks';

import InputContainer from './FieldContainer';

import { FieldProps } from '../Types';
import useAutoFill from '../useAutoFill';
import useValidity from '../useValidity';
import useDerivedState from '../useDerivedState';

import { tw, merge, css } from '../../../Twind';
import { elementBounds, refs as bindRefs } from '../../../Util';
import { sign } from 'common';

type Props = FieldProps<number | null> & {
	hideLabel?: boolean;

	/** The minimum valid value. */
	minValue?: number;

	/** The maximum valid value. */
	maxValue?: number;

	/** The maximum length of the whole portion of the number. Defaults to 16. */
	maxLength?: number;

	/** The maximum number of decimals, if true it is 8, if false it is 0. */
	decimals?: number | boolean;

	/** Allow negative numbers, minValue will be set to -maxValue if not defined. */
	negative?: boolean;

	/** The step to increment the number by, if the up and down arrow keys are pressed. */
	step?: number;

	/** A prefix to display to the left of the number. */
	prefix?: string;

	/** A suffix to display to the right of the number. */
	suffix?: string;

	/** If true, ghost zeroes will pad out the unfilled decimal digits. */
	padDecimals?: boolean;

	/** If true, ghost zeroes will pad out the unfilled whole digits. */
	padWhole?: boolean;

	/** If true, value will be comma-separated. Defaults to true. */
	separators?: boolean;

	/** If true, the value will be right-aligned. */
	alignRight?: boolean;
};

/**
 * Convert a number into a comma separated string.
 * Can't use Intl.NumberFormat because it *always rounds* for some dumbass reason,
 * resulting in decimal values magically losing precision on blur. Hah.
 */

function addStringSeparators(value: number, separator: string) {
	return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, separator);
}

export default function NumberInput(props: Props) {
	// console.log('render number');

	// eslint-disable-next-line
	// const separator = ' '; // hair space
	const separator = ' '; // thin space

	const maxValue = props.maxValue ?? 100000000000;
	const minValue = props.minValue ?? (props.negative ? -maxValue : 0);
	const maxWhole = props.maxLength ?? 12;
	const maxDecimals =
		props.decimals !== undefined
			? typeof props.decimals === 'boolean'
				? props.decimals
					? 8
					: 0
				: props.decimals
			: 0;

	const { ctx, value, id, path, label, required, disabled, readonly, onFocus, onBlur } = useDerivedState<
		number | null
	>(props, 0, true);

	const textValue = useRef<string>(
		value.current
			? props.separators ?? true
				? addStringSeparators(Math.abs(value.current), separator)
				: Math.abs(value.current).toString()
			: ''
	);

	const signValue = useRef<1 | -1>(sign(value.current ?? 0) || 1);

	const { validate, invalid } = useValidity<number | null>({
		path,
		context: {},
		checks: [
			{
				condition: ({ value }) => required && !value,
				message: 'Please fill in this field.',
			},
			{
				condition: () => {
					const decimalInd = textValue.current.indexOf('.');
					const wholeEndInd = decimalInd === -1 ? textValue.current.length : decimalInd;
					return wholeEndInd > maxWhole;
				},
				message: 'Must have at most ${maxWhole} digits.',
				severity: 'change',
			},
			{
				condition: () => textValue.current.indexOf('.') !== -1 && maxDecimals === 0,
				message: 'Value may not have decimals.',
				severity: 'change',
			},
			{
				condition: () =>
					textValue.current.indexOf('.') !== -1 &&
					textValue.current.length - textValue.current.indexOf('.') - 1 > maxDecimals,
				message: `Must have at most ${maxDecimals} decimals.`,
				severity: 'change',
			},
			{
				condition: ({ value }) => value !== null && value < minValue,
				message: `Must be at least ${props.prefix}${minValue}${props.suffix}.`,
			},
			{
				condition: ({ value }) => value !== null && value > maxValue,
				message: `Must be at most ${props.prefix}${maxValue}${props.suffix}.`,
			},
		],
		onValidityChange: props.onValidity,
	});

	useLayoutEffect(() => void validate(value.current), [validate, value]);

	const refs = useRef<{
		input: HTMLInputElement | null;
		sizer: HTMLSpanElement | null;
		prefix: HTMLPreElement | null;
		suffix: HTMLPreElement | null;
		negativeSign: HTMLSpanElement | null;
		wholePadding: HTMLSpanElement | null;
		decimalPadding: HTMLSpanElement | null;
		prefixStart: number;
		valueStart: number;
		suffixStart: number;
	}>({
		input: null,
		sizer: null,
		prefix: null,
		suffix: null,
		negativeSign: null,
		wholePadding: null,
		decimalPadding: null,
		prefixStart: 0,
		valueStart: 0,
		suffixStart: 0,
	});

	const [autofillRef, autofillClasses] = useAutoFill<HTMLInputElement>(invalid);

	/** Updates the positions of the prefix and suffix. */
	const updateElements = useCallback(() => {
		const { input, sizer, prefix, suffix } = refs.current;

		const valueWithoutCommas = textValue.current.replace(
			new RegExp(`/${separator}/g`),
			''
		);
		const decimalInd = valueWithoutCommas.indexOf('.');
		const wholeEndInd = decimalInd === -1 ? valueWithoutCommas.length : decimalInd;

		sizer!.innerText = textValue.current;
		refs.current.negativeSign!.innerHTML = signValue.current === -1 ? '-' : '';

		// Apply decimal ghosts.
		if (maxDecimals && props.padDecimals) {
			if (decimalInd === -1)
				refs.current.decimalPadding!.innerText = `${
					valueWithoutCommas.length === 0 && !props.padWhole ? '0' : ''
				}.${'0'.repeat(Math.max(maxDecimals, 0))}`;
			else {
				const decimalCount = valueWithoutCommas.length - decimalInd - 1;
				refs.current.decimalPadding!.innerText = '0'.repeat(
					Math.max(maxDecimals - decimalCount, 0)
				);
			}
		}

		// Apply whole ghosts.
		if (maxWhole && props.padWhole) {
			refs.current.wholePadding!.innerText = '0'.repeat(
				Math.max(maxWhole - wholeEndInd, 0)
			);
		}

		const suffixWidth = elementBounds(suffix!).width;
		const inputWidth = elementBounds(input!).width;
		const prefixWidth = elementBounds(prefix!).width;
		const sizerWidth = elementBounds(sizer!).width;

		if (props.alignRight) {
			refs.current.suffixStart = inputWidth - suffixWidth - 10;
			if (suffix) suffix.style.left = `${refs.current.suffixStart}px`;

			refs.current.valueStart = inputWidth - suffixWidth - sizerWidth - 4 - 10;
			input!.style.paddingLeft = `${refs.current.valueStart}px`;

			refs.current.prefixStart = refs.current.valueStart - prefixWidth + 4;
			if (prefix) prefix.style.left = `${refs.current.prefixStart}px`;
		} else {
			refs.current.valueStart = prefixWidth + 7;

			refs.current.suffixStart = refs.current.valueStart + sizerWidth + 5;

			input!.style.paddingLeft = `${refs.current.valueStart}px`;
			if (suffix) suffix.style.left = `${refs.current.suffixStart}px`;

			refs.current.prefixStart = 10;
			if (prefix) prefix.style.left = `${refs.current.prefixStart}px`;
		}
	}, [
		signValue,
		textValue,
		separator,
		maxDecimals,
		props.padDecimals,
		maxWhole,
		props.padWhole,
		props.alignRight,
	]);

	useEffect(() => {
		return ctx.event.bind('refresh', () => {
			if (parseFloat(textValue.current) * sign(value.current ?? 0) !== value.current) {
				textValue.current = value.current
					? document.activeElement === refs.current.input
						? Math.abs(value.current).toString()
						: addStringSeparators(Math.abs(value.current), separator)
					: '';
				signValue.current = sign(value.current ?? 0) || 1;
				updateElements();
			}
		});
	}, [ctx, value, separator, updateElements]);

	useLayoutEffect(() => updateElements(), [updateElements]);
	useEffect(() => void setTimeout(() => updateElements(), 16), [updateElements]);

	const handleChange = (evt: Event) => {
		if (!(evt instanceof Event) || !(evt.target instanceof HTMLInputElement)) return;

		if (evt.target.value === '') signValue.current = 1;
		textValue.current = evt.target.value;
		updateElements();

		const floatValue: number | null = textValue.current.length
			? Number.parseFloat(textValue.current) * signValue.current
			: null;
		value.current = floatValue;

		validate(floatValue);
		props.onChange?.(floatValue);
		ctx.event.emit('change', path, floatValue);
	};

	/** Prevent invalid inputs and attempt to contain the value to the specified lengths. */
	const handleBeforeInput = (evt: Event) => {
		if (
			!(evt instanceof InputEvent) ||
			!evt.data ||
			!(evt.target instanceof HTMLInputElement)
		)
			return;

		/** The user's selection range. */
		const selection = [evt.target.selectionStart!, evt.target.selectionEnd!];

		/** The length of the user's selection. */
		const selectionLen = selection[1] - selection[0];

		/** The index of the decimal point in the value. */
		const decimalInd = textValue.current.indexOf('.');

		/** The end index of the whole portion of the value. */
		const wholeEndInd = decimalInd === -1 ? textValue.current.length : decimalInd;

		/** True if the input contains a decimal point that will not be overwritten by this event. */
		const willHaveDecimal =
			decimalInd !== -1 && !(selection[0] <= decimalInd && selection[1] > decimalInd);

		// If the user is pasting from their clipboard, we need to sanitize the input.
		if (evt.data.length > 1) {
			let numericInput = (maxDecimals > 0 ? /^-?(\d*(?:\.\d*)?)/ : /^-?(\d*)/).exec(
				evt.data
			)![1];

			// If the clipboard contains a decimal point, and the value already has a decimal point, we need to truncate it.
			if (willHaveDecimal && numericInput.indexOf('.') !== -1)
				numericInput = numericInput.slice(0, numericInput.indexOf('.'));

			// Insert the sanitized input. This may cause the input to be too long,
			// but we will handle that in the validation step.
			evt.target.value = `${evt.target.value.slice(
				0,
				selection[0]
			)}${numericInput}${evt.target.value.slice(selection[1])}`;
			evt.target.selectionStart = selection[0] + numericInput.length;
			evt.target.selectionEnd = selection[0] + numericInput.length;

			// Update the sign if the user pastes a negative value, or the paste is at the start of the input.
			signValue.current = evt.data.startsWith('-')
				? -1
				: selection[0] === 0
				? 1
				: signValue.current;

			handleChange(evt);
			evt.preventDefault();
			return;
		}

		// Allow numbers through, unless they are invalid.
		if (/[0-9]/.test(evt.data)) {
			// If the user has selected a range and is pressing a number, let it through unconditionally
			// and catch it in validation, as it's hard to tell as a user why input is getting blocked otherwise.
			if (selectionLen > 0) return;

			// If the user is only inputting 1 number and said number would make the
			// whole portion of the value longer than allowed, block the input.
			if (selection[0] <= wholeEndInd && wholeEndInd >= maxWhole) evt.preventDefault();

			// If the user is only inputting 1 number and said number would make the
			// decimal portion of the value longer than allowed, block the input.
			if (
				decimalInd >= 0 &&
				selection[0] > decimalInd &&
				textValue.current.length - decimalInd > maxDecimals
			)
				evt.preventDefault();

			return;
		}

		// Allow a decimal character to be entered if decimals are allowed there isn't one already.
		else if (evt.data === '.') {
			// Block entering a decimal if decimals are not allowed.
			if (maxDecimals <= 0) {
				evt.preventDefault();
				return;
			}

			// Block entering a decimal if there is already a decimal,
			// and the user is not about to replace it.
			if (decimalInd !== -1) {
				if (!(selection[0] <= decimalInd && selection[1] > decimalInd)) {
					evt.preventDefault();
					return;
				}
			}

			// Add a 0 to the front of the value if the user is entering
			// a decimal point at the beginning of the value.
			if (selection[0] === 0) {
				evt.target.value = `0${evt.target.value}`;
				handleChange(evt);
				evt.target.selectionStart = selection[0] + 1;
				evt.target.selectionEnd = selection[1] + 1;
			}

			return;
		}

		// Negate the value if - or + is pressed.
		else if (evt.data === '-' || evt.data === '+') {
			if (value.current && minValue < 0) signValue.current *= -1;
			handleChange(evt);
			evt.preventDefault();
			return;
		}

		// Block all other character entries.

		evt.preventDefault();
		return;
	};

	/** Handle stepping and negation. */
	const handleKeyDown = (evt: Event) => {
		if (
			!(evt instanceof KeyboardEvent) ||
			!evt.key ||
			!(evt.target instanceof HTMLInputElement)
		)
			return;

		// Step through the value with the up and down arrow keys.
		if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
			// Find the amount to step, where the base step size is the one specified in props,
			// and the Ctrl modifier multiplies it by 10, the Shift modifier multiplies it by 5,
			// and the Alt modifier multiplies it by 0.1. The value is then multiplied by the sign that should be stepped.
			const stepAmount =
				(props.step ?? 1) *
				(evt.ctrlKey ? 10 : 1) *
				(evt.shiftKey ? 5 : 1) *
				(evt.altKey ? 0.1 : 1) *
				(evt.key === 'ArrowUp' ? 1 : -1);

			// Step the value, clamping it to the min and max values of the field.
			const newValue =
				Math.round(
					Math.min(
						Math.max(
							(value.current ?? Math.max(0, minValue)) + stepAmount,
							minValue ?? 0
						),
						maxValue ?? Infinity
					) * 10000
				) / 10000;

			// Clamp the decimal points to the max number of decimals.
			const valueStr = Number(Math.abs(newValue).toFixed(maxDecimals)).toString();

			// Update the value.
			evt.target.value = valueStr;
			value.current = newValue;
			signValue.current = sign(newValue) || 1;
			handleChange(evt);
		}
	};

	const handleFocus = (evt: any) => {
		onFocus(evt);
		if (props.separators ?? true) {
			const selection = [evt.target.selectionStart!, evt.target.selectionEnd!];
			evt.target.selectionStart -=
				textValue.current.slice(0, selection[0] + 1).split(separator).length - 1;
			evt.target.selectionEnd -=
				textValue.current.slice(0, selection[1] + 1).split(separator).length - 1;

			textValue.current = value.current ? `${Math.abs(value.current)}` : '';
			evt.target.value = textValue.current;
			evt.target.selectionStart = selection[0];
			evt.target.selectionEnd = selection[1];
			updateElements();
		}
	};

	const handleBlur = (evt: any) => {
		onBlur(evt);
		if (props.separators ?? true) {
			textValue.current = value.current
				? addStringSeparators(Math.abs(value.current), separator)
				: '';
			refs.current.input!.value = textValue.current;
			updateElements();
		}
	};

	return (
		<InputContainer
			hideLabel={props.hideLabel}
			label={label}
			labelId={id}
			invalid={invalid}
			class={props.class}
			style={props.style}>
			<span class={tw`sr-only`}>{props.prefix}</span>
			<input
				ref={bindRefs<HTMLInputElement>(
					autofillRef,
					(elem) => (refs.current.input = elem),
					(elem) => ctx.setFieldRef(path, elem)
				)}
				id={id}
				type='text'
				name={path}
				disabled={disabled}
				readonly={readonly}
				placeholder=' '
				aria-description={props.description}
				style={{ paddingLeft: `${refs.current.valueStart}px` }}
				class={merge(
					tw`peer w-full px-1.5 pr-0 !outline-none rounded
						${props.hideLabel ? 'pt-[5px] pb-[3px]' : 'pt-5 pb-0'}
						${props.hideLabel && invalid && '!text-red-300'}`,
					tw`${css`
						&,
						&:hover,
						&:focus {
							-moz-appearance: textfield;
						}
						&::-webkit-outer-spin-button,
						&::-webkit-inner-spin-button {
							-webkit-appearance: none;
							margin: 0;
						}
					`}`,
					autofillClasses
				)}
				value={textValue.current}
				onBeforeInput={handleBeforeInput}
				onKeyDown={handleKeyDown}
				onInput={handleChange}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
			<span
				aria-hidden={true}
				ref={(elem) => (refs.current.sizer = elem)}
				class={tw`absolute top-0 left-0 opacity-0 interact-none font-sans`}>
				{textValue.current}
			</span>
			<pre
				ref={(elem) => (refs.current.prefix = elem)}
				class={tw`absolute interact-none font-sans transition duration-75
					${
						props.hideLabel && invalid
							? 'text-red-300/60 peer-focus:text-gray-300'
							: 'text-gray-300'
					}
					${
						props.hideLabel
							? 'top-[9px]'
							: 'top-6 transition duration-150 input-inactive:opacity-0'
					}`}
				style={{ left: `${refs.current.prefixStart}px` }}>
				<span
					ref={(elem) => (refs.current.negativeSign = elem)}
					class={tw`font-sans absolute right-full`}
				/>
				<span aria-hidden={true} class={tw`font-sans`}>
					{props.prefix}
				</span>
				<span
					aria-hidden={true}
					class={tw`opacity-90`}
					ref={(elem) => (refs.current.wholePadding = elem)}
				/>
			</pre>
			<pre
				ref={(elem) => (refs.current.suffix = elem)}
				class={tw`absolute interact-none font-sans transition duration-75
					${
						props.hideLabel && invalid
							? 'text-red-300/60 peer-focus:text-gray-300'
							: 'text-gray-300'
					}
					${
						props.hideLabel
							? 'top-[9px]'
							: 'top-6 transition duration-150 input-inactive:opacity-0'
					}`}
				style={{ left: `${refs.current.suffixStart}px` }}>
				<span
					aria-hidden={true}
					ref={(elem) => (refs.current.decimalPadding = elem)}
					class={tw`opacity-90`}
				/>
				<span class={tw`font-bold`}>{props.suffix}</span>
			</pre>
		</InputContainer>
	);
}
