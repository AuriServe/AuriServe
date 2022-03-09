// import { h, Fragment } from 'preact';
// import { forwardRef } from 'preact/compat';
// import { Listbox } from '@headlessui/react';
// import { useRef, useState, useMemo, useEffect } from 'preact/hooks';

// import Svg from '../Svg';
// import { Transition } from '../Transition';
// import InputContainer from './InputContainer';

// import { merge, tw } from '../../Twind';
// import { refs } from '../../Util';

// import { ErrorType } from './Types';

// import icon_check from '@res/icon/check.svg';
// import icon_dropdown from '@res/icon/dropdown.svg';

// interface Props {
// 	id?: string;
// 	label: string;
// 	value?: string;
// 	options: Record<string, string>;

// 	optional?: boolean;
// 	pattern?: RegExp;
// 	patternHint?: string;

// 	onChange?: (value: string | undefined) => void;
// 	onValidity?: (error: ErrorType | null, message: string | null) => void;
// 	onFocus?: (elem: HTMLElement) => void;
// 	onBlur?: (elem: HTMLElement) => void;

// 	hideLabel?: boolean;

// 	style?: any;
// 	class?: string;
// 	inputClass?: string;
// }

// export default forwardRef<HTMLElement, Props>(function OptionInput(props, fRef) {
// 	const ref = useRef<HTMLElement>(null);
// 	const rootRef = useRef<HTMLDivElement>(null);

// 	const [value, setValue] = useState<string | undefined>(props.value);
// 	const [invalid, setInvalid] = useState<boolean>(false);
// 	const [shouldShowInvalid, setShouldShowInvalid] = useState<boolean>(false);

// 	const id = useMemo(
// 		() => props.id ?? `no-form-${Math.random().toString(36).substring(2, 7)}`,
// 		[props.id]
// 	);
// 	const { optional, onFocus, onBlur, onValidity } = props;

// 	useEffect(() => {
// 		let error: ErrorType | null = null;
// 		let errorMessage: string | null = null;

// 		if (!optional && value === undefined) {
// 			error = 'required';
// 			errorMessage = 'Please select an option.';
// 		}

// 		setInvalid(error !== null);
// 		onValidity?.(error, errorMessage);
// 	}, [value, optional, onValidity]);

// 	const handleChange = (newValue: string | undefined) => {
// 		setValue(newValue);
// 		props.onChange?.(newValue);
// 	};

// 	useEffect(() => {
// 		const root = rootRef.current;
// 		const input = ref.current;
// 		if (!root || !input) return undefined;
// 		let blurTimeout = 0;

// 		const handleFocus = () => {
// 			window.clearTimeout(blurTimeout);
// 			blurTimeout = 0;
// 			onFocus?.(input);
// 		};

// 		const handleBlur = () => {
// 			onBlur?.(input);
// 			if (blurTimeout > 0) window.clearTimeout(blurTimeout);
// 			blurTimeout = setTimeout(() => {
// 				setShouldShowInvalid(invalid);
// 			}, 0) as any;
// 		};

// 		root.addEventListener('focusin', handleFocus);
// 		root.addEventListener('focusout', handleBlur);

// 		return () => {
// 			root.removeEventListener('focusin', handleFocus);
// 			root.removeEventListener('focusout', handleBlur);
// 			window.clearTimeout(blurTimeout);
// 		};
// 	}, [onFocus, onBlur, invalid]);

// 	const showInvalid = invalid && shouldShowInvalid;

// 	return (
// 		<Listbox value={value} onChange={handleChange}>
// 			{({ open }: { open: boolean }) => (
// 				<InputContainer
// 					ref={rootRef}
// 					labelId={id}
// 					label={props.label}
// 					active={open}
// 					populated={open || value !== undefined}
// 					invalid={showInvalid}
// 					hideLabel={props.hideLabel}
// 					class={props.class}
// 					style={props.style}>
// 					<Listbox.Button
// 						ref={refs(ref, fRef)}
// 						className={merge(
// 							tw`peer w-full px-2.5 pr-10 rounded
// 							${props.hideLabel ? 'pt-1.5 pb-1 h-10' : 'pt-6 pb-1 h-[3.25rem]'}
// 							text-left !outline-none resize-none transition focus:shaduow-md
// 							bg-gray-100 dark:bg-gray-700/75 dark:focus:bg-gray-700
// 							${open && '!shadow-md dark:!bg-gray-700'}
// 							${showInvalid && 'text-red-800 focus:text-gray-900'}
// 							${showInvalid && 'dark:text-red-200 dark:hover:text-red-50 dark:focus:text-gray-100'}
// 						`,
// 							props.inputClass
// 						)}>
// 						{props.options[value!] ?? ''}
// 					</Listbox.Button>
// 					<Transition
// 						show={open}
// 						duration={150}
// 						invertExit
// 						enter={tw`transition duration-150`}
// 						enterFrom={tw`opacity-0 -translate-y-2`}>
// 						<Listbox.Options
// 							static
// 							className={tw`absolute z-50 left-0 top-[calc(100%+0.5rem)] w-full flex-row-reverse
// 								bg-gray-700 rounded shadow-md outline-none overflow-hidden`}>
// 							{optional && (
// 								<Listbox.Option
// 									key={undefined}
// 									value={undefined}
// 									className={({ active, selected }) => tw`
// 										p-2.5 flex transition cursor-pointer duration-75
// 										${active ? 'bg-gray-750/50 text-accent-200' : 'bg-gray-750 text-gray-200'}
// 										${selected && 'font-medium !text-gray-100'}
// 									`}>
// 									{({ selected }: { selected: boolean }) => (
// 										<Fragment>
// 											<span class={tw`grow`}>None</span>
// 											{selected && (
// 												<Svg
// 													src={icon_check}
// 													size={6}
// 													class={tw`icon-p-accent-200 icon-s-gray-500`}
// 												/>
// 											)}
// 										</Fragment>
// 									)}
// 								</Listbox.Option>
// 							)}
// 							{Object.entries(props.options).map(([value, label]) => (
// 								<Listbox.Option
// 									key={value}
// 									value={value}
// 									className={({ active, selected }) =>
// 										tw`p-2.5 flex transition cursor-pointer duration-75
// 											${active ? 'bg-accent-400/10 text-accent-200' : 'text-gray-200'}
// 											${selected && 'font-medium !text-gray-100'}`
// 									}>
// 									{({ selected }: { selected: boolean }) => (
// 										<Fragment>
// 											<span class={tw`grow`}>{label}</span>
// 											{selected && (
// 												<Svg
// 													src={icon_check}
// 													size={6}
// 													class={tw`icon-p-accent-200 icon-s-gray-500`}
// 												/>
// 											)}
// 										</Fragment>
// 									)}
// 								</Listbox.Option>
// 							))}
// 						</Listbox.Options>
// 					</Transition>

// 					<Svg
// 						src={icon_dropdown}
// 						size={7}
// 						class={tw`absolute right-2 icon-p-gray-200 transition
// 							${props.hideLabel ? 'top-1.5' : 'top-3'}
// 							${open && 'scale-y-[-100%] translate-y-px}'}`}
// 					/>
// 				</InputContainer>
// 			)}
// 		</Listbox>
// 	);
// });