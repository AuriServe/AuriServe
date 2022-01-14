import as from 'auriserve';
import { merge } from 'common';

const {
	preact: { h },
} = as.preact;

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
		// eslint-disable-next-line
		// @ts-ignore
		<div
			style={props.style}
			class={merge('TextView', props.class)}
			dangerouslySetInnerHTML={{ __html: props.content ?? '' }}
		/>
	);
}

export default { identifier: 'TextView', component: TextView };
