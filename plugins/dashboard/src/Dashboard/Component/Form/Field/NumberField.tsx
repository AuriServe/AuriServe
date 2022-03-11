import { h } from 'preact';
import { useState, useCallback, useLayoutEffect, useRef, useEffect } from 'preact/hooks';

import InputContainer from './FieldContainer';

import { useDerivedState } from '../useDerivedState';
import { ValidityError, FieldProps, errorEq } from '../Types';

import useAutoFill from '../useAutoFill';
import { tw, merge, css } from '../../../Twind';
import { elementBounds, refs } from '../../../Util';

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

function toCommaSeparatedString(value: number) {
	return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

function validate(
	value: string,
	required: boolean,
	minValue: number,
	maxValue: number,
	maxWhole: number,
	maxDecimals: number,
	prefix: string,
	suffix: string
): ValidityError | null {
	value = value.replace(/,/g, '');

	/** The index of the decimal point in the value. */
	const decimalInd = value.indexOf('.');

	/** The end index of the whole portion of the value. */
	const wholeEndInd = decimalInd === -1 ? value.length : decimalInd;

	if (required && !value.length)
		return { type: 'required', message: 'Please fill in this field.' };
	else if (wholeEndInd > maxWhole)
		return {
			type: 'maxLength',
			message: `Must have at most ${maxWhole} digits.`,
		};
	else if (decimalInd !== -1 && maxDecimals === 0) {
		return {
			type: 'maxLength',
			message: `Value may not have decimals.`,
		};
	} else if (decimalInd !== -1 && value.length - decimalInd - 1 > maxDecimals)
		return {
			type: 'maxLength',
			message: `Must have at most ${maxDecimals} decimals.`,
		};
	else if (+value < minValue)
		return {
			type: 'minValue',
			message: `Must be at least ${prefix}${minValue}${suffix}.`,
		};
	else if (+value > maxValue)
		return {
			type: 'maxValue',
			message: `Must be at most ${prefix}${maxValue}${suffix}.`,
		};

	return null;
}

export default function NumberInput(props: Props) {
	// console.log('render number');

	const minValue = props.minValue ?? 0;
	const maxValue = props.maxValue ?? 1000000000;
	const maxWhole = props.maxLength ?? 16;
	const maxDecimals =
		props.decimals !== undefined
			? typeof props.decimals === 'boolean'
				? props.decimals
					? 8
					: 0
				: props.decimals
			: 0;

	const { ctx, value, id, path, label, required, disabled, readonly } = useDerivedState<
		number | null
	>(props, 0, true);

	const textValue = useRef<string>(
		value.current
			? props.separators ?? true
				? toCommaSeparatedString(value.current)
				: value.current.toString()
			: ''
	);

	const positionRefs = useRef<{
		input: HTMLInputElement | null;
		sizer: HTMLSpanElement | null;
		prefix: HTMLPreElement | null;
		suffix: HTMLPreElement | null;
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
		wholePadding: null,
		decimalPadding: null,
		prefixStart: 0,
		valueStart: 0,
		suffixStart: 0,
	});

	const [error, setError] = useState<ValidityError | null>(null);
	const [shouldShowInvalid, setShouldShowInvalid] = useState<boolean>(false);

	const showInvalid = !!error && shouldShowInvalid;
	const [autofillRef, autofillClasses] = useAutoFill<HTMLInputElement>(showInvalid);

	/** Updates the positions of the prefix and suffix. */
	const updateElements = useCallback(() => {
		const { input, sizer, prefix, suffix } = positionRefs.current;

		const valueWithoutCommas = textValue.current.replace(/,/g, '');
		const decimalInd = valueWithoutCommas.indexOf('.');
		const wholeEndInd = decimalInd === -1 ? valueWithoutCommas.length : decimalInd;

		sizer!.innerText = textValue.current;

		// Apply decimal ghosts.
		if (maxDecimals && props.padDecimals) {
			if (decimalInd === -1)
				positionRefs.current.decimalPadding!.innerText = `${
					valueWithoutCommas.length === 0 && !props.padWhole ? '0' : ''
				}.${'0'.repeat(Math.max(maxDecimals, 0))}`;
			else {
				const decimalCount = valueWithoutCommas.length - decimalInd - 1;
				positionRefs.current.decimalPadding!.innerText = '0'.repeat(
					Math.max(maxDecimals - decimalCount, 0)
				);
			}
		}

		// Apply whole ghosts.
		if (maxWhole && props.padWhole) {
			positionRefs.current.wholePadding!.innerText = '0'.repeat(
				Math.max(maxWhole - wholeEndInd, 0)
			);
		}

		const suffixWidth = elementBounds(suffix!).width;
		const inputWidth = elementBounds(input!).width;
		const prefixWidth = elementBounds(prefix!).width;
		const sizerWidth = elementBounds(sizer!).width;

		if (props.alignRight) {
			positionRefs.current.suffixStart = inputWidth - suffixWidth - 10;
			if (suffix) suffix.style.left = `${positionRefs.current.suffixStart}px`;

			positionRefs.current.valueStart = inputWidth - suffixWidth - sizerWidth - 4 - 10;
			input!.style.paddingLeft = `${positionRefs.current.valueStart}px`;

			positionRefs.current.prefixStart =
				positionRefs.current.valueStart - prefixWidth + 4;
			if (prefix) prefix.style.left = `${positionRefs.current.prefixStart}px`;
		} else {
			positionRefs.current.valueStart = prefixWidth + 7;

			positionRefs.current.suffixStart = positionRefs.current.valueStart + sizerWidth + 5;

			input!.style.paddingLeft = `${positionRefs.current.valueStart}px`;
			if (suffix) suffix.style.left = `${positionRefs.current.suffixStart}px`;

			positionRefs.current.prefixStart = 10;
			if (prefix) prefix.style.left = `${positionRefs.current.prefixStart}px`;
		}
	}, [
		textValue,
		maxDecimals,
		props.padDecimals,
		maxWhole,
		props.padWhole,
		props.alignRight,
	]);

	useEffect(() => {
		return ctx.event.bind('refresh', () => {
			if (parseFloat(textValue.current) !== value.current) {
				textValue.current = value.current
					? document.activeElement === positionRefs.current.input
						? value.current.toString()
						: toCommaSeparatedString(value.current)
					: '';
				updateElements();
			}
		});
	}, [ctx, value, updateElements]);

	useLayoutEffect(() => updateElements(), [updateElements]);
	useEffect(() => void setTimeout(() => updateElements(), 16), [updateElements]);

	const checkValidation = useCallback(
		(value: string) =>
			validate(
				value,
				required,
				minValue,
				maxValue,
				maxWhole,
				maxDecimals,
				props.prefix ?? '',
				props.suffix ?? ''
			),
		[required, minValue, maxValue, maxWhole, maxDecimals, props.prefix, props.suffix]
	);

	const { onValidity } = props;
	useLayoutEffect(() => {
		const error = checkValidation(textValue.current);
		setError(error);
		onValidity?.(error);
	}, [checkValidation, value, onValidity]);

	const handleChange = (evt: Event) => {
		if (!(evt instanceof Event) || !(evt.target instanceof HTMLInputElement)) return;

		textValue.current = evt.target.value;
		updateElements();

		const floatValue: number | null = textValue.current.length
			? Number.parseFloat(textValue.current)
			: null;
		value.current = floatValue;

		const error = checkValidation(evt.target.value);
		setError((oldError) => (errorEq(oldError, error) ? oldError : error));
		props.onValidity?.(error);
		props.onChange?.(floatValue);
		ctx.event.emit('validity', path, error);
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
			let numericInput = (maxDecimals > 0 ? /^\d*(?:\.\d*)?/ : /^\d*/).exec(evt.data)![0];

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
				evt.target.selectionStart = selection[0] + 1;
				evt.target.selectionEnd = selection[1] + 1;
			}

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
			const value =
				Math.round(
					Math.min(
						Math.max(Number.parseFloat(textValue.current) + stepAmount, minValue ?? 0),
						maxValue ?? Infinity
					) * 10000
				) / 10000;

			// Clamp the decimal points to the max number of decimals.
			const valueStr = Number(value.toFixed(maxDecimals)).toString();

			// Update the value.
			evt.target.value = valueStr;
			textValue.current = valueStr;
			updateElements();
		}
	};

	const handleFocus = (evt: any) => {
		props.onFocus?.(evt.target);
		ctx.event.emit('focus', path, true);

		if (props.separators ?? true) {
			const selection = [evt.target.selectionStart!, evt.target.selectionEnd!];
			evt.target.selectionStart -=
				textValue.current.slice(0, selection[0] + 1).split(',').length - 1;
			evt.target.selectionEnd -=
				textValue.current.slice(0, selection[1] + 1).split(',').length - 1;

			textValue.current = value.current ? `${value.current}` : '';

			evt.target.value = textValue.current;
			evt.target.selectionStart = selection[0];
			evt.target.selectionEnd = selection[1];
			updateElements();
		}
	};

	const handleBlur = (evt: any) => {
		props.onBlur?.(evt.target);
		setShouldShowInvalid(!!error);
		ctx.event.emit('focus', path, false);

		if (props.separators ?? true) {
			textValue.current = value.current ? toCommaSeparatedString(value.current) : '';
			positionRefs.current.input!.value = textValue.current;
			updateElements();
		}
	};

	return (
		<InputContainer
			hideLabel={props.hideLabel}
			label={label}
			labelId={id}
			invalid={showInvalid}
			class={props.class}
			style={props.style}>
			<span class={tw`sr-only`}>{props.prefix}</span>
			<input
				ref={refs<HTMLInputElement>(
					autofillRef,
					(elem) => (positionRefs.current.input = elem),
					(elem) => (ctx.meta.current[path] = { elem, error })
				)}
				id={id}
				type='text'
				name={path}
				disabled={disabled}
				readonly={readonly}
				placeholder=' '
				aria-description={props.description}
				style={{ paddingLeft: `${positionRefs.current.valueStart}px` }}
				class={merge(
					tw`peer w-full px-1.5 pr-0 !outline-none rounded
						${props.hideLabel ? 'pt-[5px] pb-[3px]' : 'pt-5 pb-0'}`,
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
				ref={(elem) => (positionRefs.current.sizer = elem)}
				class={tw`absolute top-0 left-0 opacity-0 interact-none font-sans`}>
				{textValue.current}
			</span>
			<pre
				ref={(elem) => (positionRefs.current.prefix = elem)}
				class={tw`absolute interact-none font-sans
					${
						props.hideLabel
							? 'top-[9px]'
							: 'top-6 transition duration-150 input-inactive:opacity-0'
					}`}
				style={{ left: `${positionRefs.current.prefixStart}px` }}>
				<span aria-hidden={true} class={tw`text-gray-300 font-sans`}>
					{props.prefix}
				</span>
				<span
					aria-hidden={true}
					ref={(elem) => (positionRefs.current.wholePadding = elem)}
					class={tw`text-gray-400`}
				/>
			</pre>
			<pre
				ref={(elem) => (positionRefs.current.suffix = elem)}
				class={tw`absolute interact-none font-sans
					${
						props.hideLabel
							? 'top-[9px]'
							: 'top-6 transition duration-150 input-inactive:opacity-0'
					}`}
				style={{ left: `${positionRefs.current.suffixStart}px` }}>
				<span
					aria-hidden={true}
					ref={(elem) => (positionRefs.current.decimalPadding = elem)}
					class={tw`text-gray-400`}
				/>
				<span class={tw`text-gray-300 font-bold`}>{props.suffix}</span>
			</pre>
		</InputContainer>
	);
}
