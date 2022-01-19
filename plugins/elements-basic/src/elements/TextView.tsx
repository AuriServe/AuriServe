import { h } from 'preact';
import { merge } from 'common';

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
	return (
		<div
			style={props.style}
			class={merge('TextView', props.class)}
			dangerouslySetInnerHTML={{ __html: props.content ?? '' }}
		/>
	);
}

export default { identifier: 'TextView', component: TextView };
