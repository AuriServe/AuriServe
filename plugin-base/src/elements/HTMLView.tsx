import { h } from 'preact';

import { mergeClasses } from 'common/util';
import { ServerDefinition } from 'common/definition';

export interface Props {
	html: string;
	class?: string;
}

/**
 * Renders the provided HTML inside a div.
 */

export function HTMLView(props: Props) {
	return <div
		class={mergeClasses('HTMLView', props.class)}
		dangerouslySetInnerHTML={{ __html: props.html}}
	/>;
}

export const server: ServerDefinition = { identifier: 'HTMLView', element: HTMLView };
