import { h, Fragment } from 'preact';
import { forwardRef } from 'preact/compat';
import { merge } from 'common/util';
import { Listbox } from '@headlessui/react';
import { useRef, useState, useMemo, useEffect } from 'preact/hooks';

import Svg from '../Svg';
import { Transition } from '../Transition';

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

export default forwardRef<HTMLSelectElement, Props>(function OptionInput(props, fRef) {
	const rootRef = useRef<HTMLDivElement>(null);
	const ref = useRef<HTMLElement>(null);

	const [ value, setValue ] = useState<string | undefined>(props.value);
	const [ invalid, setInvalid ] = useState<boolean>(false);
	const [ shouldShowInvalid, setShouldShowInvalid ] = useState<boolean>(false);

	const id = useMemo(() => props.id ?? 'no-form-' + Math.random().toString(36).substr(2, 9), [ props.id ]);

	useEffect(() => {
		let error: ErrorType | null = null;
		let errorMessage: string | null = null;

		if (!props.optional && value === undefined) {
			error = 'required';
			errorMessage = 'Please select an option.';
		}

		setInvalid(error !== null);
		props.onValidity?.(error, errorMessage);
	}, [ value, props.optional ]);

	const handleChange = (newValue: string) => {
		setValue(newValue);
		props.onChange?.(newValue);
	};

	useEffect(() => {
		let blurTimeout = 0;

		const handleFocus = () => {
			window.clearTimeout(blurTimeout);
			blurTimeout = 0;
			props.onFocus?.(ref.current);
		};

		const handleBlur = () => {
			props.onBlur?.(ref.current);
			if (blurTimeout > 0) window.clearTimeout(blurTimeout);
			blurTimeout = setTimeout(() => {
				setShouldShowInvalid(invalid);
			}, 0) as any;
		};

		rootRef.current.addEventListener('focusin', handleFocus);
		rootRef.current.addEventListener('focusout', handleBlur);

		return () => {
			rootRef.current.removeEventListener('focusin', handleFocus);
			rootRef.current.removeEventListener('focusout', handleBlur);
			window.clearTimeout(blurTimeout);
		};
	}, [ rootRef.current, props.onFocus, props.onBlur ]);

	const showInvalid = invalid && shouldShowInvalid;

	return (
		<Listbox value={value} onChange={handleChange}>
			{({ open }) => <div ref={rootRef}
				class={merge('relative group grid w-full h-max ', props.class)} style={props.style}
			>
				<Listbox.Button
					ref={(elem: any) => { ref.current = elem; if (fRef) fRef.current = elem; }}
					className={merge(
						'peer w-full px-2.5 h-[3.25rem] pt-6 pb-1 pr-10 rounded',
						'text-left !outline-none resize-none transition focus:shadow-md',
						'bg-neutral-100 dark:bg-neutral-700/75 dark:focus:bg-neutral-700',
						open && '!shadow-md dark:!bg-neutral-700',
						showInvalid && 'text-red-800 focus:text-neutral-900',
						showInvalid && 'dark:text-red-200 dark:hover:text-red-50 dark:focus:text-neutral-100')}
				>
					{props.options[value!] ?? ''}
				</Listbox.Button>
				<Transition show={open} duration={150} invertExit
					enter='transition duration-150' enterFrom='opacity-0 -translate-y-2'>
					<Listbox.Options static className='absolute z-50 left-0 top-[calc(100%+0.5rem)] w-full flex-row-reverse
						bg-neutral-700 rounded shadow-md outline-none overflow-hidden'>
						{Object.entries(props.options).map(([ value, label ]) =>
							<Listbox.Option key={value} value={value} className={({ active, selected }) => merge(
								'p-2.5 flex transition text-neutral-200 cursor-pointer duration-75',
								active && 'bg-accent-400/10 !text-accent-200',
								selected && 'font-medium !text-white')}
							>
								{({ selected }) => <Fragment>
									<span class='flex-grow'>{label}</span>
									{selected && <Svg src={icon_check} size={6} class='primary-200 secondary-neutral-500'/>}
								</Fragment>}
							</Listbox.Option>
						)}
					</Listbox.Options>
				</Transition>

				<label for={id}
					class={merge('absolute transition-all w-full interact-none',
						'top-[0.9375rem] peer-focus:top-1.5',
						'left-3 peer-focus:left-2.5',
						'text-base peer-focus:text-xs',
						'font-medium peer-focus:font-bold',
						(open || value !== undefined) && '!top-1.5 !left-2.5 !text-xs !font-bold',
						!showInvalid && 'text-neutral-500 peer-hover:text-neutral-500 peer-focus:text-accent-600',
						!showInvalid && 'dark:text-neutral-300 dark:peer-hover:text-neutral-200 dark:peer-focus:text-accent-300',
						open && !showInvalid && '!text-accent-600 dark:!text-accent-300',
						showInvalid && 'text-red-900 peer-hover:text-red-800/75 peer-focus:text-red-800',
						showInvalid && 'dark:text-red-400 dark:peer-hover:text-red-300 dark:peer-focus:text-red-300',
						open && showInvalid && '!text-accent-800 dark:!text-red-300')}>
					{props.label}
				</label>

				<div
					class={merge('absolute bottom-0 w-full h-0.5 rounded-b transition-all',
						'[transform-origin:25%] opacity-0 peer-focus:opacity-100 scale-x-75 peer-focus:scale-x-100',
						open && '!opacity-100 !scale-x-100',
						!showInvalid && 'bg-accent-500 dark:bg-accent-400',
						showInvalid && 'bg-red-700/75 dark:bg-red-300')}
				/>

				<Svg src={icon_dropdown} size={7} class={merge(
					'absolute top-3 right-2 primary-neutral-200 transition',
					open && 'scale-y-[-100%] translate-y-px')}/>
			</div>}
		</Listbox>
	);
});
