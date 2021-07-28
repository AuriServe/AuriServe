import { h } from 'preact';
import { ServerDefinition } from 'plugin-api';

import { mergeClasses } from 'common/util';

export interface Props {
	content?: string;

	style?: any;
	class?: string;
}

/**
 * Displays textual HTML contents.
 * In the page editor, the text can be visually edited.
 */

export function TextView(props: Props) {
	return <div
		style={props.style}
		class={mergeClasses('TextView', props.class)}
		dangerouslySetInnerHTML={{ __html: props.content ?? '' }}
	/>;
};

export const server: ServerDefinition = {	identifier: 'TextView',	element: TextView };
