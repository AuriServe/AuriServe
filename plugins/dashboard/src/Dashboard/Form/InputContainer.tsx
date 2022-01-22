import { forwardRef, useMemo } from 'preact/compat';
import { h, ComponentChildren } from 'preact';

import { tw } from '../twind';

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

	if (populated === undefined)
		classes += ` top-(1.5 test:[0.9375rem]) left-(2.5 test:3) text-(xs test:base) font-(bold test:medium)`;
	else
		classes += populated
			? ' top-1.5 left-2.5 text-xs font-bold'
			: ` top-(peer-focus:1.5 [0.9375rem]) left-(peer-focus:2.5 3)
						text-(peer-focus:xs base) font-(peer-focus:bold medium)`;

	if (active === undefined) {
		if (!invalid)
			classes += `text-(gray-((500 dark:300) peer-hover:(500 dark:200)) peer-focus:accent-(600 dark:300))`;
		else
			classes += ` text-red-((900 dark:400) peer-hover:(800/75 dark:300) peer-focus:(800 dark:300))`;
	} else if (!invalid)
		classes += active
			? ' text-accent-(600 dark:300)'
			: ` text-(gray-(500 dark:300 peer-hover:(500 dark:200)) peer-focus:accent-(600 dark:300))`;
	else
		classes += active
			? ' text-red-(800 dark:300)'
			: ` text-red-((900 dark:400) peer-hover:(800/75 dark:300) peer-focus:(800 dark:300))`;

	return classes;
}

/**
 * A visual container for Input Fields. Renders a background, label, and children.
 * `active` and `invalid` props are used to determine visual appearance, and do not affect validation.
 * Refs are forwarded to the inner div element.
 */

export default forwardRef<HTMLDivElement, Props>(function InputContainer(props, ref) {
	const labelStyles = useMemo(
		() => getLabelStyles(props.active, props.populated, props.invalid),
		[props.active, props.populated, props.invalid]
	);

	return (
		<div
			ref={ref}
			class={tw`relative group grid w-full h-max ${props.class}`}
			style={props.style}>
			{props.children}
			<label for={props.labelId} class={tw`${labelStyles}`}>
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
