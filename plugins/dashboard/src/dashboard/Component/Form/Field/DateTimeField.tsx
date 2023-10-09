import { h } from 'preact';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';

import Transition from '../../Transition';
import InputContainer from './FieldContainer';
import CalendarSelector from './CalendarSelector/CalendarSelector';

import type { FieldProps } from '.';
import useValidity from '../useValidity';
import { useRerender } from 'vibin-hooks';
import useDerivedState from '../useDerivedState';

import { refs } from '../../../Util';
import { tw, merge } from '../../../Twind';

type Props = FieldProps<Date | number | null> & {
	hideLabel?: boolean;
	placeholderLabel?: boolean;

	minValue?: number;
	maxValue?: number;

	defaultTime?: 'start' | 'end';
};

function toDate(value: number | Date | null): Date | null;
function toDate(value: number | Date | undefined): Date | undefined;

function toDate(value: number | Date | null | undefined): Date | null | undefined {
	return value == null ? null : typeof value === 'number' ? new Date(value) : value;
}

export default function DateTimeField(props: Props) {
	const rerender = useRerender();
	const ref = useRef<HTMLElement>(null);

	const [ focused, setFocused ] = useState<boolean>(false);

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
		// onFocus: stateOnFocus,
		// onBlur: stateOnBlur,
	} = useDerivedState<Date | number | null>(props, null, true);


	useEffect(() => {
		function handleInteract(evt: Event) {
			if (!ref.current) return;

			let elem = evt.target as HTMLElement;
			let isChildOfCal = false;
			while (elem.parentElement) {
				if (elem === ref.current) {
					isChildOfCal = true;
					break;
				}

				if (elem.parentElement) elem = elem.parentElement;
				else break;
			}

			if (!isChildOfCal) {
				setFocused(false);
			}
		}

		window.addEventListener('mousedown', handleInteract);
		window.addEventListener('focusin', handleInteract);

		return () => {
			window.removeEventListener('mousedown', handleInteract);
			window.removeEventListener('focusin', handleInteract);
		}
	}, []);

	const {
		validate,
		// onBlur: validityOnBlur,
		invalid,
	} = useValidity<Date | null>({
		path,
		context: {},
		checks: [
			{
				condition: ({ value }) => required && value == null,
				message: 'Please fill in this field.',
			},
			{
				condition: ({ value }) => value && props.minValue && +value < +props.minValue,
				message: `Must be after ${new Date(props.minValue!).toUTCString()}.`,
				severity: 'change',
			},
			{
				condition: ({ value }) => value && props.maxValue && +value > +props.maxValue,
				message: `Must be before ${new Date(props.maxValue!).toUTCString()}.`,
				severity: 'change'
			}
		],
		onValidityChange: props.onValidity,
	});

	useLayoutEffect(() => void validate(toDate(value.current)), [validate, value]);

	const handleChange = (newValue: Date | null) => {
		let formattedVal: Date | number | null = newValue;
		if (typeof value.current === 'number' && formattedVal != null) formattedVal = +formattedVal;

		validate(newValue);
		value.current = formattedVal;
		props.onChange?.(formattedVal);
		ctx.event.emit('change', path, formattedVal);
		rerender();
	};

	// const handleFocus = (evt: Event) => {
	// 	stateOnFocus(evt);
	// }

	// const handleBlur = (evt: Event) => {
	// 	validityOnBlur();
	// 	stateOnBlur(evt);
	// };


	const dateVal = toDate(value.current);

	const omitTime =
		props.defaultTime === 'start' ? (dateVal?.getHours() === 0 && dateVal?.getMinutes() === 0) :
		props.defaultTime === 'end' ? (dateVal?.getHours() === 23 && dateVal?.getMinutes() === 59) : false;

	return (
		<InputContainer
			disabled={disabled}
			hideLabel={props.hideLabel}
			placeholderLabel={props.placeholderLabel}
			active={focused}
			label={label}
			labelId={id}
			invalid={invalid}
			class={props.class}
			style={props.style}
			ref={refs(ref, props.fieldRef, (elem) => ctx.setFieldRef(path, elem))}
		>
			<button
				type='button'
				id={id}
				name={path}
				disabled={disabled}
				readonly={readonly}
				placeholder=' '
				aria-description={props.description}
				onClick={() => setFocused(!focused)}
				class={merge(tw`peer w-full px-2.5 !outline-none rounded text-left text-sm flex justify-between font-medium
					${focused ? 'bg-gray-700' : 'bg-gray-input focus:bg-gray-700'}
					${(props.hideLabel || props.placeholderLabel) ? 'pt-[11px] pb-[9px]' : 'pt-5 pb-0'}
					${(props.hideLabel || props.placeholderLabel) && invalid && '!text-red-300'}`)}
			>
				<div class={tw`${!dateVal && 'text-gray-400'}`}>
					<span>{(dateVal?.getDate() ?? 0).toString().padStart(2, '0')}</span>
					<span class={tw`text-gray-${dateVal ? '300' : '500'} px-px font-bold`}>/</span>
					<span>{((dateVal?.getMonth() ?? 0) + 1).toString().padStart(2, '0')}</span>
					<span class={tw`text-gray-${dateVal ? '300' : '500'} px-px font-bold`}>/</span>
					<span>{(dateVal?.getFullYear() ?? 0).toString().padStart(4, '0')}{' '}</span>
				</div>
				{dateVal && !omitTime && <div>
					<span>{((dateVal.getHours() ?? 12) % 12 || 12)}</span>
					<span class={tw`text-gray-300 px-px`}>:</span>
					<span>{dateVal?.getMinutes().toString().padStart(2, '0')}</span>
					<span class={tw`text-gray-300 pl-0.5`}>{dateVal.getHours() >= 12 ? 'pm' : 'am'}</span>
				</div>}
			</button>
			<Transition show={focused}
				class={tw`transition duration-150 origin-bottom-left`}
				enterFrom={tw`scale-95 opacity-0`} duration={150} invertExit>
				<div class={tw`absolute z-30 top-[calc(100%-128px)] shadow-lg left-0`}>
					<CalendarSelector
						selected={dateVal}
						onSelect={handleChange}
						min={toDate(props.minValue)}
						max={toDate(props.maxValue)}
						defaultTime={props.defaultTime}
					/>
				</div>
			</Transition>
		</InputContainer>
	);
}
