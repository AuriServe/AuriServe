import { h, Ref } from 'preact';
import { forwardRef } from 'preact/compat';
import { useCallback, useState } from 'preact/hooks';

import { ErrorType } from './Type';
import { tw, merge } from '../../Twind';
import Svg from '../Svg';

interface Props {
	id?: string;
	label: string;
	description?: string;
	icon?: string;

	value?: string;
	for: string;

	optional?: boolean;

	onChange?: (value: string) => void;
	onValidity?: (error: ErrorType | null, message: string | null) => void;
	onFocus?: (elem: HTMLElement) => void;
	onBlur?: (elem: HTMLElement) => void;

	rounded?: boolean;
	toggleLeft?: boolean;

	style?: any;
	class?: string;
}

export default forwardRef<HTMLElement, Props>(function ToggleInput(props, fRef) {
	const [value, setValue] = useState<boolean>(props.value as any as boolean);

	const { onChange } = props;

	const handleToggle = useCallback(
		(evt: Event) => {
			evt.preventDefault();
			evt.stopPropagation();

			setValue((oldValue) => {
				const value = !oldValue;
				onChange?.(value as any as string);
				return value;
			});
		},
		[onChange]
	);

	return (
		<div
			ref={fRef as Ref<HTMLDivElement>}
			class={merge(
				tw`flex-(& col) px-2.5 py-3 rounded transition cursor-pointer border-2 border-transparent group
				${value ? 'bg-gray-input' : '!border-gray-input'}`,
				props.class
			)}
			style={props.style}
			onClick={handleToggle}>
			<div class={tw`flex gap-3`}>
				{props.icon && <Svg src={props.icon} size={6} class={tw`shrink-0 -mr-0.5`} />}
				<label
					for={props.id}
					onClick={(evt) => evt.stopPropagation()}
					class={tw`
						block font-medium leading-none grow transition interact-none truncate pt-[5px]
						${value ? 'text-(gray-500 dark:gray-100)' : 'text-(gray-600 dark:gray-200)'}`}>
					{props.label}
				</label>
				<div class={tw`shrink-0 w-10 h-6 relative group isolate`}>
					<input
						type='checkbox'
						id={props.id}
						checked={value}
						onChange={() => setValue(!value)}
						onClick={(evt) => evt.stopPropagation()}
						class={tw`absolute z-10 w-full h-full inset-0 opacity-0 peer cursor-pointer`}
					/>
					<div
						class={tw`absolute inset-0 w-full h-full p-1 rounded-full transition
							ring-(accent-400 offset-gray-800 group-focus-within:(2 offset-2))
							bg-(gray-700 group-focus-within:gray-700 peer-checked:accent-400
							peer-checked:group-focus-within:accent-400)`}
					/>
					<div
						class={tw`absolute w-4 h-4 rounded-full shadow-sm shadow-gray-900/50
							top-1 left-1 peer-checked:translate-x-4 transition
							bg-(gray-300 group-hover:gray-200 group-focus-within:accent-400 peer-checked:gray-700
								peer-checked:group-hover:gray-600 peer-checked:group-focus-within:gray-700)`}
					/>
				</div>
			</div>
			{props.description && (
				<p
					class={tw`text-sm leading-5 mt-1.5 text-gray-200 ${
						props.icon && 'ml-8 pl-0.5'
					}`}>
					{props.description}
				</p>
			)}
		</div>
	);
});
