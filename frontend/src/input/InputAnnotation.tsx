import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';

import { mergeClasses } from 'common/util';

interface Props {
	title: string;
	description?: string;

	style?: any;
	class?: string;
	children?: Preact.ComponentChildren;
}

export default forwardRef<HTMLLabelElement, Props>(function InputAnnotation(props, fRef) {
	return (
		<label ref={fRef} class={mergeClasses(props.class, 'block relative overflow-auto user-select-none')} style={props.style}>
			<p class='mt-4 mb-1 cursor-pointer'>{props.title}</p>
			{props.description && <p class='mb-3 text-sm font-normal text-gray-500 dark:text-gray-600'>{props.description}</p>}
			{props.children}
		</label>
	);
});
