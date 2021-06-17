import * as Preact from 'preact';
import { ServerDefinition } from 'auriserve-api';

interface Props {
	content: string;
	class?: string;
	style?: any;
}

/**
 * Renders HTML text content.
 */

function TextView(props: Props) {
	return (
		<div
			style={props.style}
			class={('TextView ' + (props.class ?? ' ')).trim()}
			dangerouslySetInnerHTML={{__html: props.content}}
		/>
	);
};

export const server: ServerDefinition = {
	identifier: 'TextView',
	element: TextView,
	config: {
		props: {
			content: { type: 'html' }
		}
	}
};
