import as from 'auriserve';
import { merge } from 'common';

const {
	preact: { h },
} = as.preact;

export interface Props {
	html: string;
	class?: string;
}

/**
 * Renders the provided HTML inside a div.
 */

export function HTMLView(props: Props) {
	return (
		<div
			class={merge('HTMLView', props.class)}
			dangerouslySetInnerHTML={{ __html: props.html }}
		/>
	);
}

export default { identifier: 'HTMLView', component: HTMLView };
