import { h, Fragment } from 'preact';
import { useRerender } from 'vibin-hooks';
import { Listbox } from '@headlessui/react';
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';

import Svg from '../../Svg';
import { Transition } from '../../Transition';
import FieldContainer from './FieldContainer';

import type { FieldProps } from '.';
import useValidity from '../useValidity';
import useDerivedState from '../useDerivedState';

import { refs } from '../../../Util';
import * as Icon from '../../../Icon';
import { merge, tw } from '../../../Twind';

type Props = FieldProps<string | null> & {
	above?: boolean;

	options: Map<string | null | boolean | number, string>;

	hideLabel?: boolean;
};

export default function OptionField(props: Props) {
	const rerender = useRerender();
	// const classes = useClasses(props.class);

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
				condition: ({ value }) => required && value == null,
				message: 'Please select an option',
			},
		],
		onValidityChange: props.onValidity,
	});
	useLayoutEffect(() => void validate(value.current), [validate, value]);

	const blurTimeoutRef = useRef<number>(0);

	const ref = useRef<HTMLElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Autofocus on first render if the autofocus prop is set.
		if (props.autofocus) ref.current?.focus();
		// This *should not* be called again if autofocus changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = (newValue: string | null) => {
		setValue(newValue);
		validate(newValue);
		rerender();
	};

	const handleFocus = (evt: Event) => {
		if (blurTimeoutRef.current) {
			window.clearTimeout(blurTimeoutRef.current);
			blurTimeoutRef.current = 0;
		}
		onFocus(evt);
	};

	const handleBlur = (evt: Event) => {
		if (blurTimeoutRef.current) return;
		blurTimeoutRef.current = window.setTimeout(() => {
			validityOnBlur();
			stateOnBlur(evt);
		});
	};

	const numEntries = Object.keys(props.options).length + (required ? 0 : 1);
	const hasScrollbar = numEntries > 5;

	return (
		<Listbox
			value={value.current}
			onChange={handleChange}
			disabled={disabled || readonly}>
			{({ open }: { open: boolean }) => (
				<FieldContainer
					ref={rootRef}
					labelId={id}
					label={label}
					active={open}
					onFocusIn={handleFocus}
					onFocusOut={handleBlur}
					populated={open || props.options.get(value.current) != null}
					invalid={invalid}
					disabled={disabled}
					hideLabel={props.hideLabel}
					class={props.class}
					style={props.style}>
					<Listbox.Button
						id={id}
						aria-description={props.description}
						ref={refs(ref, props.fieldRef, onRef)}
						className={merge(
							tw`peer w-full px-2.5 pr-10 rounded
							${props.hideLabel ? 'pt-1.5 pb-1 h-10' : 'pt-6 pb-1 h-[3.25rem]'}
							text-left !outline-none resize-none transition
							bg-gray-100 dark:bg-gray-700/75 ${disabled ? 'text-gray-300' : 'dark:focus:bg-gray-700'}
							overflow-hidden truncate
							${open && '!shadow-md dark:!bg-gray-700'}
						`
							// props.inputClass
						)}>
						{props.options.get(value.current!) ?? props.options.get(null) ?? ''}
					</Listbox.Button>
					<Transition
						show={open}
						duration={150}
						invertExit
						enter={tw`transition duration-150`}
						enterFrom={tw`opacity-0 ${props.above ? '' : '-'}translate-y-2`}>
						<div
							class={tw`absolute z-50 left-0
								${props.above ? 'bottom-[calc(100%+0.5rem)]' : 'top-[calc(100%+0.5rem)]'}
								w-full py-0.5 pr-0.5 rounded shadow-md bg-gray-700 grid`}>
							<Listbox.Options
								static
								className={tw`flex-row-reverse max-h-[14rem] overflow-auto outline-none
									scroll-(gutter-gray-700 bar-(gray-400 hover-gray-300)) py-1.5 pl-2
									${hasScrollbar ? 'pr-0.5' : 'pr-2'}`}>
								{[...props.options.entries()].map(([value, label]) => (
									<Listbox.Option
										key={value}
										value={value}
										className={({ active, selected }) =>
											tw`py-2 px-2 flex rounded transition cursor-pointer duration-75 w-full
											${active ? 'bg-accent-400/10 text-accent-200' : 'text-gray-200'}
											${selected && 'font-medium !text-gray-100'}`
										}>
										{({ selected }: { selected: boolean }) => (
											<Fragment>
												<span class={tw`grow overflow-hidden truncate`}>{label}</span>
												{selected && (
													<Svg
														class={tw`shrink-0 icon-p-accent-200 icon-s-gray-500`}
														src={Icon.check}
														size={6}
													/>
												)}
											</Fragment>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</div>
					</Transition>

					<Svg
						class={tw`absolute right-2 icon-p-gray-${props.disabled ? 400 : 200} transition
						${props.hideLabel ? 'top-1.5' : 'top-3'}
						${open && 'scale-y-[-100%] translate-y-px}'}`}
						src={Icon.dropdown}
						size={7}
					/>
				</FieldContainer>
			)}
		</Listbox>
	);
}
