import { forwardRef } from 'preact/compat';
import { h, ComponentChildren } from 'preact';

import { tw, merge } from '../../../Twind';

interface Props {
	/** The input's label. */
	label: string;

	/** The id of the input element the label is for. */
	labelId: string;

	hideLabel?: boolean;

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
	const posInactive = 'top-[0.9375rem] left-3 text-base font-medium';
	const posActive = 'top-1.5 left-2.5 text-xs font-bold';
	const validActive = 'text-accent-(600 dark:300)';
	const validInactive = 'text-(gray-((500 dark:300) peer-hover:(500 dark:200)))';
	const invalidActive = 'text-red-(800 dark:300)';
	const invalidInactive =
		'text-red-((900 dark:400) peer-hover:(800/75 dark:300) peer-focus-input:(800 dark:300))';

	const colActive = invalid ? invalidActive : validActive;
	const colInactive = invalid ? invalidInactive : validInactive;

	return tw`InputContainerLabel~(
		absolute w-[calc(100%-1.5rem)] truncate transition-all interact-none
		${
			populated === undefined
				? `${posActive} input-inactive:(${posInactive})`
				: `${populated ? posActive : posInactive}`
		}
		${
			active === undefined
				? `${colInactive} peer-focus-input:!(${colActive})`
				: `${active ? colActive : `${colInactive} peer-focus-input:!(${colActive})`}`
		}
	)`;
}

/**
 * A visual container for Input Fields. Renders a background, label, and children.
 * `active` and `invalid` props are used to determine visual appearance, and do not affect validation.
 * Refs are forwarded to the inner div element.
 */

export default forwardRef<HTMLDivElement, Props>(function InputContainer(props, ref) {
	return (
		<div
			ref={ref}
			class={merge(tw`group InputContainer~(relative grid w-full h-max)`, props.class)}
			style={props.style}>
			{props.children}
			<label
				for={props.labelId}
				class={
					props.hideLabel
						? tw`sr-only`
						: getLabelStyles(props.active, props.populated, props.invalid)
				}>
				{props.label}
			</label>
			<div
				class={tw`
					absolute bottom-0 w-full h-0.5 rounded-b transition-all [transform-origin:25%]
					opacity-0 scale-x-75 peer-focus:(opacity-100 scale-x-100)
					${props.active && '!opacity-100 !scale-x-100'}
					${props.invalid ? 'bg-red-(700/75 dark:300)' : 'bg-accent-(500 dark:400)'}`}
			/>
		</div>
	);
});
