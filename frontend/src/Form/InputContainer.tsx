import { forwardRef } from 'preact/compat';
import { h, ComponentChildren } from 'preact';

import { merge } from 'common/util';

interface Props {
	/** The input's label. */
	label: string;

	/** The id of the input element the label is for. */
	labelId: string;

	/** Whether or not the input is active, determines the appearance of the container. */
	active?: boolean;

	/** Whether or not the input is invalid, determines the appearance of the container. */
	invalid?: boolean;

	style?: any;
	class?: string;
	children: ComponentChildren;
}

/**
 * A visual container for Input Fields. Renders a background, label, and children.
 * `active` and `invalid` props are used to determine visual appearance, and do not affect validation.
 * Refs are forwarded to the inner div element.
 */

export default forwardRef<HTMLDivElement, Props>(function InputContainer(props, ref) {
	return (
		<div ref={ref} class={merge('relative group grid w-full h-max ', props.class)} style={props.style}>
			{props.children}
			<label for={props.labelId}
				class={merge('absolute transition-all w-full interact-none',
					'top-1.5 peer-focus:top-1.5 peer-placeholder-shown:top-[0.9375rem]',
					'left-2.5 peer-focus:left-2.5 peer-placeholder-shown:left-3',
					'text-xs peer-focus:text-xs peer-placeholder-shown:text-base',
					'font-bold peer-focus:font-bold peer-placeholder-shown:font-medium',
					!props.invalid && 'text-neutral-500 peer-hover:text-neutral-500 peer-focus:text-accent-600',
					!props.invalid && 'dark:text-neutral-300 dark:peer-hover:text-neutral-200 dark:peer-focus:text-accent-300',
					props.invalid && 'text-red-900 peer-hover:text-red-800/75 peer-focus:text-red-800',
					props.invalid && 'dark:text-red-400 dark:peer-hover:text-red-300 dark:peer-focus:text-red-300')}>
				{props.label}
			</label>
			<div style={{ transformOrigin: '25%' }}
				class={merge('absolute bottom-0 w-full h-0.5 rounded-b transition-all',
					'opacity-0 peer-focus:opacity-100 scale-x-75 peer-focus:scale-x-100 [transform-origin:25%]',
					props.invalid ? 'bg-red-700/75 dark:bg-red-300' : 'bg-accent-500 dark:bg-accent-400')}
			/>
		</div>
	);
});
