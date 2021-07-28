import { h } from 'preact';
import { ServerDefinition } from 'plugin-api';

import { mergeClasses } from 'common/util';

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
