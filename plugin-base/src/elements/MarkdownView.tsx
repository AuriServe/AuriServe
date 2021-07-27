import { h } from 'preact';
import { Converter } from 'showdown';

import { mergeClasses } from 'common/util';
import { ServerDefinition } from 'common/definition';

interface Props {
	content?: string;

	style?: any;
	class?: string;
}

/**
 * Renders an HTML representation of Markdown content.
 */

function MarkdownView(props: Props) {
	const converter = new Converter();
	converter.setFlavor('github');
	converter.setOption('emoji', true);
	converter.setOption('tables', true);
	const content = converter.makeHtml(props.content ?? '');

	return <div
		style={props.style}
		class={mergeClasses('MarkdownView', props.class)}
		dangerouslySetInnerHTML={{ __html: content }}
	/>;
};

export const server: ServerDefinition = { identifier: 'MarkdownView', element: MarkdownView };
