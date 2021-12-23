import { h, ComponentChildren } from 'preact';
import { forwardRef } from 'preact/compat';

import { merge } from 'common/util';

interface Props {
	label: string;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default forwardRef<HTMLLabelElement, Props>(function InputLabel(props, fRef) {
	return (
		<label ref={fRef} class={merge(props.class, 'block relative overflow-visible user-select-none',
			'font-semibold text-xs text-neutral-200 tracking-widest uppercase pt-3 pb-1')} style={props.style}>
			<p class='truncate select-none -mb-6 relative z-10 w-max ml-3 dark:text-neutral-400'>{props.label}</p>
			{props.children}
		</label>
	);
});
