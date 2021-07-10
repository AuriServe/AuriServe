import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';

import { mergeClasses } from 'common/util';

interface Props {
	label: string;

	style?: any;
	class?: string;
	children?: Preact.ComponentChildren;
}

export default forwardRef<HTMLLabelElement, Props>(function InputLabel(props, fRef) {
	return (
		<label ref={fRef} class={mergeClasses(props.class, 'block relative overflow-visible user-select-none',
			'font-medium text-xs text-gray-300 dark:text-gray-600 tracking-widest uppercase pt-3 pb-1.5')} style={props.style}>
			<p class='truncate select-none pb-1.5'>{props.label}</p>
			{props.children}
		</label>
	);
});
