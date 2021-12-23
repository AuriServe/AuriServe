import { forwardRef } from 'preact/compat';
import { h, ComponentChildren } from 'preact';

import { merge } from 'common/util';

interface Props {
	title: string;
	description?: string;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default forwardRef<HTMLLabelElement, Props>(function InputAnnotation(props, fRef) {
	return (
		<label ref={fRef} class={merge(props.class, 'block relative overflow-auto user-select-none')} style={props.style}>
			<p class='mt-4 mb-1 cursor-pointer'>{props.title}</p>
			{props.description && <p class='mb-3 text-sm font-normal text-neutral-400 dark:text-neutral-300'>{props.description}</p>}
			{props.children}
		</label>
	);
});
