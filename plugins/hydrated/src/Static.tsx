import { h, ComponentChildren } from 'preact';

import { merge } from 'common/util';

interface Props {
	style?: any;
	class?: string;
	children: ComponentChildren;
}

const identifier = 'hydrated:static';

/**
 * All content rendered as a child of this component will be left untouched on the client,
 * unless they are themselves hydrated components. This is useful for doing
 * intensive rendering on the server without having to send all of the data to the client.
 * Children render as direct children of the parent component.
 */

export default function Static(props: Props) {
	return typeof window === 'undefined' ? (
		<div class={merge(identifier, props.class)} style={props.style}>
			{props.children}
		</div>
	) : (
		<div
			class={merge(identifier, props.class)}
			style={props.style}
			dangerouslySetInnerHTML={{ __html: '' }}
		/>
	);
}
