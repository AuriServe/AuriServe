import { h } from 'preact';
import { merge } from 'common';

interface Props {
	content?: string;

	style?: any;
	class?: string;
}

const identifier = 'base:text';

export function Text(props: Props) {
	return (
		<div
			style={props.style}
			class={merge(identifier, props.class)}>
			<div class={'element-prose'} dangerouslySetInnerHTML={{ __html: props.content ?? '' }}/>
		</div>
	);
}

export default { identifier, component: Text };
