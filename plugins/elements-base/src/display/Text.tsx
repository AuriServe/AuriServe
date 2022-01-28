import { h } from 'preact';
import { merge } from 'common';

interface Props {
	content?: string;

	style?: any;
	class?: string;
}

const identifier = 'base:text';

function Text(props: Props) {
	return (
		<div
			style={props.style}
			class={merge(identifier, props.class)}
			dangerouslySetInnerHTML={{ __html: props.content ?? '' }}
		/>
	);
}

export default { identifier, component: Text };
