import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { forwardRef } from 'preact/compat';

import { ErrorType, FormContext } from './Type';

import { merge } from 'common/util';

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

export default forwardRef<HTMLDivElement, Props>(function ToggleInput(props, fRef) {
	const form = useContext(FormContext);
	const description = form.schema.fields[props.for]?.description;

	return (
		<div ref={fRef} class={merge('flex gap-4 w-full', props.class)} style={props.style}>
			<div class={merge('grow', description === undefined && 'mt-1.5')}>
				<label
					for={props.id}
					class='block font-medium leading-none cursor-pointer max-w-xl select-none transition
					text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-100'>
					{props.label}
				</label>
				{description && <p class='text-sm leading-5 mt-1.5 mb-1 max-w-xl text-neutral-300'>{description}</p>}
			</div>
			<div class={merge('shrink-0 w-10 h-6 relative group isolate', props.toggleLeft && '-order-1')}>
				<input
					type='checkbox'
					id={props.id}
					value={props.value}
					class='absolute z-10 w-full h-full inset-0 opacity-0 cursor-pointer peer'
				/>
				<div
					class={merge(
						'absolute inset-0 w-full h-full p-1 transition',
						'ring-accent-500/50 ring-offset-neutral-800 peer-focus:ring-2 peer-focus:ring-offset-2',
						'bg-neutral-input peer-focus:bg-neutral-700 peer-checked:bg-accent-400',
						'peer-checked:peer-focus:bg-accent-400',
						props.rounded ? 'rounded-full' : 'rounded-md'
					)}
				/>
				<div
					class={merge(
						'absolute w-4 h-4 shadow-sm shadow-neutral-900/50',
						'top-1 left-1 peer-checked:translate-x-4 transition',
						'bg-neutral-300 peer-hover:bg-neutral-200 peer-focus:bg-accent-400',
						'peer-checked:bg-neutral-700 peer-checked:peer-hover:bg-neutral-600 peer-checked:peer-focus:bg-white',
						props.rounded ? 'rounded-full' : 'rounded'
					)}
				/>
			</div>
		</div>
	);
});
