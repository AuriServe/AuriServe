import * as Preact from 'preact';
import { ServerDefinition } from 'auriserve-api';
interface Props {
	html: string;
	class?: string;
}

/**
 * Renders the provided HTML.
 */

function HTMLView(props: Props) {
	return (
		<div class={[ 'HTMLView', props.class ].filter(s => s).join(' ')}
			dangerouslySetInnerHTML={{ __html: props.html}} />
	);
}

export const server: ServerDefinition = {
	identifier: 'HTMLView',
	element: HTMLView,
	config: {
		props: {
			html: { name: 'HTML', type: 'html' }
		}
	}
};
