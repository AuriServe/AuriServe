import { h, Ref } from 'preact';
import { useContext } from 'preact/hooks';
import { forwardRef } from 'preact/compat';

import { tw, merge } from '../twind';
import { ErrorType, FormContext } from './Type';

interface Props {
	id?: string;
	label: string;
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
	const form = useContext(FormContext);
	const description = form.schema.fields[props.for]?.description;

	return (
		<div
			ref={fRef as Ref<HTMLDivElement>}
			class={merge(tw`flex gap-4 w-full`, props.class)}
			style={props.style}>
			<div
				class={tw`grow
					${description === undefined && 'mt-1.5'}
					${props.toggleLeft && 'order-2'}`}>
				<label
					for={props.id}
					class={tw`
						block font-medium leading-none cursor-pointer max-w-xl select-none transition
						text-gray-(500 dark:200 dark:hover:100)`}>
					{props.label}
				</label>
				{description && (
					<p class={tw`text-sm leading-5 mt-1.5 mb-1 max-w-xl text-gray-300`}>
						{description}
					</p>
				)}
			</div>
			<div class={tw`shrink-0 w-10 h-6 relative group isolate order-1`}>
				<input
					type='checkbox'
					id={props.id}
					value={props.value}
					class={tw`absolute z-10 w-full h-full inset-0 opacity-0 cursor-pointer peer`}
				/>
				<div
					class={tw`absolute inset-0 w-full h-full p-1 transition
						ring-(accent-500/50 offset-neutral-800 peer-focus:2 peer-focus:offset-2)
						bg-(gray-input peer-focus:gray-700 peer-checked:accent-400 peer-checked:peer-focus:accent-400)
						${props.rounded ? 'rounded-full' : 'rounded-md'}`}
				/>
				<div
					class={tw`absolute w-4 h-4 shadow-sm shadow-neutral-900/50
						top-1 left-1 peer-checked:translate-x-4 transition
						bg-(gray-300 peer-hover:gray-200 peer-focus:accent-400 peer-checked:gray-700
							peer-checked:peer-hover:gray-600 peer-checked:peer-focus:white)
						${props.rounded ? 'rounded-full' : 'rounded'}`}
				/>
			</div>
		</div>
	);
});
