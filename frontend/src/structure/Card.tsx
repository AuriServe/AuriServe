import { forwardRef } from 'preact/compat';
import { h, ComponentChildren, RefObject } from 'preact';

import { merge } from 'common/util';

export interface Props {
	// Any default section properties.
	[ key: string ]: any;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default forwardRef(function Card(props: Props, ref?: RefObject<HTMLElement>) {
	return (
		<section ref={ref} {...props} class={merge(
			'block bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 p-4 mx-auto my-8 max-w-screen-xl',
			'font-sans rounded-lg shadow-md', props.class
		)}>
			{props.children}
		</section>
	);
});
