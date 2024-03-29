import { h } from 'preact';
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';

import Svg from '../../Svg';

import type { FieldProps } from '.';
import useValidity from '../useValidity';
import useDerivedState from '../useDerivedState';

import { refs } from '../../../Util';
import { tw, merge } from '../../../Twind';
import { useClasses } from '../../../Hooks';

type Props = FieldProps<boolean> & {
	icon?: string;
	// toggleLeft?: boolean;
	// rounded?: boolean;
};

export default function ToggleField(props: Props) {
	const ref = useRef<HTMLElement>(null);
	const classes = useClasses(props.class);

	useEffect(() => {
		// Autofocus on first render if the autofocus prop is set.
		if (props.autofocus) ref.current?.focus();
		// This *should not* be called again if autofocus changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {
		value,
		setValue,
		id,
		path,
		label,
		disabled,
		readonly,
		onFocus,
		onBlur: stateOnBlur,
		onRef
	} = useDerivedState<boolean>(props, false);

	/* Don't use the derived state because checkboxes should default to optional. */
	const required = props.required ?? !(props.optional ?? true);

	const {
		validate,
		onBlur: validityOnBlur,
		invalid,
	} = useValidity<boolean>({
		path,
		context: {},
		checks: [
			{
				condition: ({ value }) => required && !value,
				message: 'This field is required.',
			},
		],
		onValidityChange: props.onValidity,
	});

	useLayoutEffect(() => void validate(value.current), [validate, value]);

	const handleChange = ({ target }: any) => {
		const newValue: boolean = target.checked;
		setValue(newValue);
		validate(newValue);
	};

	const handleBlur = (evt: Event) => {
		validityOnBlur();
		stateOnBlur(evt);
	};

	return (
		<label
			class={merge(
				tw`flex-(& col) px-2.5 py-3 min-h-13 rounded border-(2 gray-input) relative isolate
					cursor-${props.disabled ? 'auto' : 'pointer'}`,
				classes.get()
			)}
			style={props.style}>
			<div class={tw`flex gap-3`}>
				{props.icon && <Svg src={props.icon} size={6} class={merge(tw`shrink-0 -mr-0.5 z-10`, classes.get('icon'))} />}
				<input
					ref={refs(ref, props.fieldRef, onRef)}
					id={id}
					type='checkbox'
					disabled={disabled}
					readonly={readonly}
					class={tw`absolute z-10 w-full h-full inset-0 opacity-0 peer cursor-(pointer disabled:auto)`}
					checked={value.current ?? false}
					onChange={handleChange}
					onFocus={onFocus}
					onBlur={handleBlur}
				/>
				<div
					class={merge(
						tw`absolute bg-gray-input inset-0 opacity-(0 peer-checked:100) transition`,
						classes.get('background')
					)}
				/>
				<span
					class={merge(tw`
						relative font-medium leading-none grow transition select-none truncate pt-[5px]
						text-((gray-600 dark:gray-200) peer-checked:(gray-500 dark:gray-100))
						${invalid && 'text-red-((900 dark:400)'}`, classes.get('label'))}>
					{label}
				</span>
				<div
					class={merge(tw`absolute w-10 h-6 top-3 right-3 p-1 rounded-full transition
						${
							props.disabled
								? `bg-gray-700 peer-checked:bg-gray-400`
								: `ring-(${invalid ? 'red-400' : 'accent-400'}
									offset-gray-800 peer-focus:(2 offset-2) peer-active:(2 offset-2))
									bg-(gray-700 peer-checked:accent-400 peer-checked:peer-focus:accent-400)`
						}`,
						classes.get('switch_track')
					)}

				/>
				<div
					class={merge(tw`absolute w-4 h-4 top-4 right-8 rounded-full
					peer-checked:translate-x-4 shadow-sm shadow-gray-900/50 transition
					peer-disabled:!(bg-gray-400 peer-checked:bg-gray-700)
					${
						invalid
							? `bg-red-300`
							: `bg-(gray-300 peer-hover:gray-200 peer-focus:accent-400 peer-checked:gray-700
								peer-checked:peer-hover:gray-600 peer-checked:peer-focus:gray-700)`
					}`,
					classes.get('switch_knob')
					)}
				/>
			</div>
			{props.description && (
				<span
					class={tw`relative text-sm leading-5 mt-1.5 text-gray-200 whitespace-pre-line select-none ${
						props.icon && 'ml-8 pl-0.5'
					}`}>
					{props.description.replace('\\n', '\n')}
				</span>
			)}
		</label>
	);
}
