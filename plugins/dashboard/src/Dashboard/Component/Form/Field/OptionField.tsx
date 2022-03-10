import { h, Fragment } from 'preact';
import { useRerender } from 'vibin-hooks';
import { Listbox } from '@headlessui/react';
import { useCallback, useLayoutEffect, useRef, useState } from 'preact/hooks';

import Svg from '../../Svg';
import { Transition } from '../../Transition';
import FieldContainer from './FieldContainer';

import { refs } from '../../../Util';
import * as Icon from '../../../Icon';
import { merge, tw } from '../../../Twind';
import { useDerivedState } from '../useDerivedState';
import { ValidityError, FieldProps } from '../Types';

type Props = FieldProps<string | null> & {
	options: Record<string, string>;

	hideLabel?: boolean;
};

function validate(value: string | null, required: boolean): ValidityError | null {
	if (required && !value) {
		return { type: 'required', message: 'Please select an option.' };
	}
	return null;
}

export default function OptionField(props: Props) {
	console.log('render option');
	const rerender = useRerender();
	const { ctx, value, id, path, label, required, disabled, readonly } = useDerivedState<
		string | null
	>(props, '', true);

	const blurTimeoutRef = useRef<number>(0);
	const [error, setError] = useState<ValidityError | null>(null);
	const [shouldShowInvalid, setShouldShowInvalid] = useState<boolean>(false);

	const ref = useRef<HTMLElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	const checkValidation = useCallback(
		(value: string | null) => validate(value, required),
		[required]
	);
	const { onValidity } = props;
	useLayoutEffect(() => {
		const error = checkValidation(value.current);
		setError(error);
		onValidity?.(error);
	}, [checkValidation, value, onValidity]);

	const handleChange = (newValue: string | null) => {
		value.current = newValue;
		const error = checkValidation(newValue);

		setError(error);
		props.onValidity?.(error);
		props.onChange?.(newValue);
		ctx.event.emit('validity', path, error);
		ctx.event.emit('change', path, newValue);
		rerender();
	};

	const handleFocus = ({ target }: any) => {
		if (blurTimeoutRef.current) {
			window.clearTimeout(blurTimeoutRef.current);
			blurTimeoutRef.current = 0;
		}
		props.onFocus?.(target);
		ctx.event.emit('focus', path, true);
	};

	const handleBlur = ({ target }: any) => {
		if (blurTimeoutRef.current) return;
		blurTimeoutRef.current = window.setTimeout(() => {
			props.onBlur?.(target);
			ctx.event.emit('focus', path, false);
			setShouldShowInvalid(error !== null);
		});
	};

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
					populated={open || value.current !== null}
					invalid={shouldShowInvalid}
					hideLabel={props.hideLabel}
					class={props.class}
					style={props.style}>
					<Listbox.Button
						id={id}
						aria-description={props.description}
						ref={refs(ref, (elem) => (ctx.meta.current[path] = { elem, error }))}
						className={merge(
							tw`peer w-full px-2.5 pr-10 rounded
							${props.hideLabel ? 'pt-1.5 pb-1 h-10' : 'pt-6 pb-1 h-[3.25rem]'}
							text-left !outline-none resize-none transition focus:shaduow-md
							bg-gray-100 dark:bg-gray-700/75 dark:focus:bg-gray-700
							${open && '!shadow-md dark:!bg-gray-700'}
							${shouldShowInvalid && 'text-red-800 focus:text-gray-900'}
							${
								shouldShowInvalid &&
								'dark:text-red-200 dark:hover:text-red-50 dark:focus:text-gray-100'
							}
						`
							// props.inputClass
						)}>
						{props.options[value.current!] ?? ''}
					</Listbox.Button>
					<Transition
						show={open}
						duration={150}
						invertExit
						enter={tw`transition duration-150`}
						enterFrom={tw`opacity-0 -translate-y-2`}>
						<Listbox.Options
							static
							className={tw`absolute z-50 left-0 top-[calc(100%+0.5rem)] w-full flex-row-reverse
								bg-gray-700 rounded shadow-md outline-none overflow-hidden`}>
							{!required && (
								<Listbox.Option
									value={null}
									className={({ active, selected }) => tw`
										p-2.5 flex transition cursor-pointer duration-75
										${active ? 'bg-gray-750/50 text-accent-200' : 'bg-gray-750 text-gray-200'}
										${selected && 'font-medium !text-gray-100'}
									`}>
									{({ selected }: { selected: boolean }) => (
										<Fragment>
											<span class={tw`grow`}>None</span>
											{selected && (
												<Svg
													class={tw`icon-p-accent-200 icon-s-gray-500`}
													src={Icon.check}
													size={6}
												/>
											)}
										</Fragment>
									)}
								</Listbox.Option>
							)}
							{Object.entries(props.options).map(([value, label]) => (
								<Listbox.Option
									key={value}
									value={value}
									className={({ active, selected }) =>
										tw`p-2.5 flex transition cursor-pointer duration-75
											${active ? 'bg-accent-400/10 text-accent-200' : 'text-gray-200'}
											${selected && 'font-medium !text-gray-100'}`
									}>
									{({ selected }: { selected: boolean }) => (
										<Fragment>
											<span class={tw`grow`}>{label}</span>
											{selected && (
												<Svg
													class={tw`icon-p-accent-200 icon-s-gray-500`}
													src={Icon.check}
													size={6}
												/>
											)}
										</Fragment>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>

					<Svg
						class={tw`absolute right-2 icon-p-gray-200 transition
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
