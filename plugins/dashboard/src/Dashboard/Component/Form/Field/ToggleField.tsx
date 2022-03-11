import { h } from 'preact';

import Svg from '../../Svg';

import { FieldProps } from '../Types';
import useValidity from '../useValidity';
import useDerivedState from '../useDerivedState';

import { tw, merge } from '../../../Twind';
import { useLayoutEffect } from 'preact/hooks';

type Props = FieldProps<boolean> & {
	icon?: string;
	toggleLeft?: boolean;
	// rounded?: boolean;
};

export default function ToggleField(props: Props) {
	const { ctx, value, id, path, label, disabled, readonly, onFocus, onBlur } =
		useDerivedState<boolean>(props, false);

	/* Don't use the derived state because checkboxes should default to optional. */
	const required = props.required ?? !(props.optional ?? true);

	const { validate, invalid } = useValidity<boolean>({
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

		value.current = newValue;
		validate(newValue);
		props.onChange?.(newValue);
		ctx.event.emit('change', path, newValue);
	};

	return (
		<label
			class={merge(
				tw`flex-(& col) px-2.5 py-3 rounded border-(2 gray-input) relative isolate
					cursor-${props.disabled ? 'auto' : 'pointer'}`,
				props.class
			)}
			style={props.style}>
			<div class={tw`flex gap-3`}>
				{props.icon && <Svg src={props.icon} size={6} class={tw`shrink-0 -mr-0.5`} />}
				<input
					ref={(elem) =>
						(ctx.meta.current[path] = {
							error: ctx.meta.current[path]?.error ?? null,
							elem,
						})
					}
					id={id}
					type='checkbox'
					disabled={disabled}
					readonly={readonly}
					class={tw`absolute z-10 w-full h-full inset-0 opacity-0 peer cursor-(pointer disabled:auto)`}
					checked={value.current}
					onChange={handleChange}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
				<div
					class={tw`absolute bg-gray-input inset-0 opacity-(0 peer-checked:100) transition`}
				/>
				<span
					class={tw`
						relative font-medium leading-none grow transition select-none truncate pt-[5px]
						text-((gray-600 dark:gray-200) peer-checked:(gray-500 dark:gray-100))
						${invalid && 'text-red-((900 dark:400)'}`}>
					{label}
				</span>
				<div
					class={tw`absolute w-10 h-6 top-3 right-3 p-1 rounded-full transition
						${
							props.disabled
								? `bg-gray-700 peer-checked:bg-gray-400`
								: `ring-(${invalid ? 'red-400' : 'accent-400'}
									offset-gray-800 peer-focus:(2 offset-2) peer-active:(2 offset-2))
									bg-(gray-700 peer-checked:accent-400 peer-checked:peer-focus:accent-400)`
						}`}
				/>
				<div
					class={tw`absolute w-4 h-4 top-4 right-8 rounded-full
					peer-checked:translate-x-4 shadow-sm shadow-gray-900/50 transition
					peer-disabled:!(bg-gray-400 peer-checked:bg-gray-700)
					${
						invalid
							? `bg-red-300`
							: `bg-(gray-300 peer-hover:gray-200 peer-focus:accent-400 peer-checked:gray-700
								peer-checked:peer-hover:gray-600 peer-checked:peer-focus:gray-700)`
					}`}
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
