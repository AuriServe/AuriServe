import { forwardRef, useMemo } from 'preact/compat';
import { h, ComponentChildren } from 'preact';

import { merge } from 'common/util';

interface Props {
	/** The input's label. */
	label: string;

	/** The id of the input element the label is for. */
	labelId: string;

	/**
	 * Whether or not the input is populated. i.e. if the label should shrink.
	 * If undefined, uses :placeholder-shown and peer-focus:, otherwise, uses the boolean state specified.
	 */

	populated?: boolean;

	/**
	 * Whether or not the input is active, which applies a highlight to the label.
	 * If undefined, uses peer-focus: and otherwise, uses the boolean state specified.
	 */

	active?: boolean;


	/** Whether or not the input is invalid, determines the appearance of the container. */
	invalid?: boolean;

	style?: any;
	class?: string;
	children: ComponentChildren;
}

/**
 * Ridiculously overcomplicated function to get the styles for the label.
 * Parameters are taken from the props. Should be memoized.
 */

function getLabelStyles(active?: boolean, populated?: boolean, invalid?: boolean) {
	let classes = 'absolute w-full transition-all interact-none';

	if (populated === undefined) classes += `
		top-1.5 peer-focus:top-1.5 peer-placeholder-shown:top-[0.9375rem]
		left-2.5 peer-focus:left-2.5 peer-placeholder-shown:left-3
		text-xs peer-focus:text-xs peer-placeholder-shown:text-base
		font-bold peer-focus:font-bold peer-placeholder-shown:font-medium`;
	else classes += populated
		? ' !top-1.5 !left-2.5 !text-xs !font-bold'
		: ` top-[0.9375rem] peer-focus:top-1.5 left-3 peer-focus:left-2.5
			text-base peer-focus:text-xs font-medium peer-focus:font-bold`;

	if (active === undefined) {
		if (!invalid) classes += ` text-neutral-500 peer-hover:text-neutral-500 peer-focus:text-accent-600
			dark:text-neutral-300 dark:peer-hover:text-neutral-200 dark:peer-focus:text-accent-300`;
		else classes += ` text-red-900 peer-hover:text-red-800/75 peer-focus:text-red-800
			dark:text-red-400 dark:peer-hover:text-red-300 dark:peer-focus:text-red-300`;
	}
	else {
		if (!invalid) classes += active
			? ' text-accent-600 dark:text-accent-300'
			: ` text-neutral-500 dark:text-neutral-300
				peer-hover:text-neutral-500 dark:peer-hover:text-neutral-200
				peer-focus:text-accent-600 dark:peer-focus:text-accent-300`;
		else classes += active
			? ' text-red-800 dark:text-red-300'
			: ` text-red-900 dark:text-red-400
				peer-hover:text-red-800/75 dark:peer-hover:text-red-300
				dark:peer-focus:text-red-300 peer-focus:text-red-800`;
	}

	return classes;
}

/**
 * A visual container for Input Fields. Renders a background, label, and children.
 * `active` and `invalid` props are used to determine visual appearance, and do not affect validation.
 * Refs are forwarded to the inner div element.
 */

export default forwardRef<HTMLDivElement, Props>(function InputContainer(props, ref) {
	const labelStyles = useMemo(() => getLabelStyles(props.active, props.populated, props.invalid),
		[ props.active, props.populated, props.invalid ]);

	return (
		<div ref={ref} class={merge('relative group grid w-full h-max ', props.class)} style={props.style}>
			{props.children}
			<label for={props.labelId} class={labelStyles}>
				{props.label}</label>
			<div class={merge('absolute bottom-0 w-full h-0.5 rounded-b transition-all [transform-origin:25%]',
				'opacity-0 peer-focus:opacity-100 scale-x-75 peer-focus:scale-x-100',
				props.active && '!opacity-100 !scale-x-100',
				props.invalid ? 'bg-red-700/75 dark:bg-red-300' : 'bg-accent-500 dark:bg-accent-400')}/>
		</div>
	);
});
