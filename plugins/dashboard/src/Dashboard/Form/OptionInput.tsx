import { h, Fragment } from 'preact';
import { forwardRef } from 'preact/compat';
import { Listbox } from '@headlessui/react';
import { useRef, useState, useMemo, useEffect } from 'preact/hooks';

import Svg from '../Svg';
import { Transition } from '../Transition';
import InputContainer from './InputContainer';

import { tw } from '../twind';
import { refs } from '../Util';

import { ErrorType } from './Type';

import icon_check from '@res/icon/check.svg';
import icon_dropdown from '@res/icon/dropdown.svg';

interface Props {
	id?: string;
	label: string;
	value?: string;
	options: Record<string, string>;

	optional?: boolean;
	pattern?: RegExp;
	patternHint?: string;

	onChange?: (value: string) => void;
	onValidity?: (error: ErrorType | null, message: string | null) => void;
	onFocus?: (elem: HTMLElement) => void;
	onBlur?: (elem: HTMLElement) => void;

	style?: any;
	class?: string;
}

export default forwardRef<HTMLElement, Props>(function OptionInput(props, fRef) {
	const ref = useRef<HTMLElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	const [value, setValue] = useState<string | undefined>(props.value);
	const [invalid, setInvalid] = useState<boolean>(false);
	const [shouldShowInvalid, setShouldShowInvalid] = useState<boolean>(false);

	const id = useMemo(
		() => props.id ?? `no-form-${Math.random().toString(36).substring(2, 7)}`,
		[props.id]
	);
	const { optional, onFocus, onBlur, onValidity } = props;

	useEffect(() => {
		let error: ErrorType | null = null;
		let errorMessage: string | null = null;

		if (!optional && value === undefined) {
			error = 'required';
			errorMessage = 'Please select an option.';
		}

		setInvalid(error !== null);
		onValidity?.(error, errorMessage);
	}, [value, optional, onValidity]);

	const handleChange = (newValue: string) => {
		setValue(newValue);
		props.onChange?.(newValue);
	};

	useEffect(() => {
		const root = rootRef.current;
		const input = ref.current;
		if (!root || !input) return undefined;
		let blurTimeout = 0;

		const handleFocus = () => {
			window.clearTimeout(blurTimeout);
			blurTimeout = 0;
			onFocus?.(input);
		};

		const handleBlur = () => {
			onBlur?.(input);
			if (blurTimeout > 0) window.clearTimeout(blurTimeout);
			blurTimeout = setTimeout(() => {
				setShouldShowInvalid(invalid);
			}, 0) as any;
		};

		root.addEventListener('focusin', handleFocus);
		root.addEventListener('focusout', handleBlur);

		return () => {
			root.removeEventListener('focusin', handleFocus);
			root.removeEventListener('focusout', handleBlur);
			window.clearTimeout(blurTimeout);
		};
	}, [onFocus, onBlur, invalid]);

	const showInvalid = invalid && shouldShowInvalid;

	return (
		<Listbox value={value} onChange={handleChange}>
			{({ open }: { open: boolean }) => (
				<InputContainer
					ref={rootRef}
					labelId={id}
					label={props.label}
					active={open}
					populated={open || value !== undefined}
					invalid={showInvalid}
					class={props.class}
					style={props.style}>
					<Listbox.Button
						ref={refs(ref, fRef)}
						className={tw`peer w-full px-2.5 h-[3.25rem] pt-6 pb-1 pr-10 rounded
							text-left !outline-none resize-none transition focus:shaduow-md
							bg-gray-100 dark:bg-gray-700/75 dark:focus:bg-gray-700
							${open && '!shadow-md dark:!bg-gray-700'}
							${showInvalid && 'text-red-800 focus:text-gray-900'}
							${showInvalid && 'dark:text-red-200 dark:hover:text-red-50 dark:focus:text-gray-100'}
						`}>
						{props.options[value!] ?? ''}
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
							{Object.entries(props.options).map(([value, label]) => (
								<Listbox.Option
									key={value}
									value={value}
									className={({ active, selected }) =>
										tw`p-2.5 flex transition text-gray-200 cursor-pointer duration-75
											${active && 'bg-accent-400/10 !text-accent-200'}
											${selected && 'font-medium !text-white'}`
									}>
									{({ selected }: { selected: boolean }) => (
										<Fragment>
											<span class={tw`grow`}>{label}</span>
											{selected && (
												<Svg
													src={icon_check}
													size={6}
													class={tw`icon-p-accent-200 icon-s-gray-500`}
												/>
											)}
										</Fragment>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>

					<Svg
						src={icon_dropdown}
						size={7}
						class={tw`absolute top-3 right-2 icon-p-gray-200 transition
							${open && 'scale-y-[-100%] translate-y-px}'}`}
					/>
				</InputContainer>
			)}
		</Listbox>
	);
});
