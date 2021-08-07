import { forwardRef } from 'preact/compat';
import { h, ComponentChildren, RefObject } from 'preact';

import { mergeClasses } from 'common/util';

export interface Props {
	// Any default section properties.
	[ key: string ]: any;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default forwardRef(function Card(props: Props, ref?: RefObject<HTMLElement>) {
	return (
		<section ref={ref} {...props} class={mergeClasses(
			'block bg-white dark:bg-gray-100 text-gray-100 dark:text-gray-800 p-4 mx-auto my-8 max-w-screen-xl',
			'font-sans border-gray-800 dark:border-gray-300 border rounded shadow-md', props.class
		)}>
			{props.children}
		</section>
	);
});
