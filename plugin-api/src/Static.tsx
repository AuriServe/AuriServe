import { h, ComponentChildren } from 'preact';

import { mergeClasses } from 'common/util';

interface Props {
	style?: any;
	class?: string;
	children: ComponentChildren;
}

/**
 * Marks all children as static content that should not be rerendered when a component is hydrated.
 * Children can also be hydrated components. This Component has no effect if the parent component is not hydrated.
 * Static is styled as 'display: contents', meaning that it will render children
 * as if they are direct descendants of the parent.
 */

export default function Static(props: Props) {
	return (typeof window === 'undefined' || 'AS_EDITOR' in window)
		? <div class={mergeClasses('Static', props.class)} style={props.style}>{props.children}</div>
		: <div class={mergeClasses('Static', props.class)} style={props.style} dangerouslySetInnerHTML={{ __html: '' }}/>;
}
