import * as Preact from 'preact';
import { Converter } from 'showdown';
import { ServerDefinition } from 'auriserve-api';

interface Props {
	content: string;
	class?: string;
	style?: any;
}

/**
 * Renders an HTML representation of Markdown content.
 */

function MarkdownView(props: Props) {
	const converter = new Converter();
	converter.setFlavor('github');
	converter.setOption('emoji', true);
	converter.setOption('tables', true);
	const content = converter.makeHtml(props.content);

	return (
		<div
			style={props.style}
			class={('MarkdownView ' + (props.class ?? ' ')).trim()}
			dangerouslySetInnerHTML={{__html: content}}
		/>
	);
};

export const server: ServerDefinition = {
	identifier: 'MarkdownView',
	element: MarkdownView,
	config: {
		props: {
			content: { type: 'long_text:markdown' }
		}
	}
};
