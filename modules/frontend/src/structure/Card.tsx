import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';

import { mergeClasses } from '../Util';

export interface Props {
	// Any default section properties.
	[ key: string ]: any;

	style?: any;
	class?: string;
	children?: Preact.ComponentChildren;
}

export default forwardRef(function Card(props: Props, ref?: Preact.RefObject<HTMLElement>) {
	return (
		<section ref={ref} {...props} class={mergeClasses(
			'block bg-white dark:bg-gray-100 border-gray-800 dark:border-gray-300 border rounded',
			'p-4 max-w-7xl mx-auto my-8 max-w-screen-xl shadow-md', props.class
		)}>
			{props.children}
		</section>
	);
});
