import { h } from 'preact';
import { merge } from 'common';

interface Props {
	html: string;
	class?: string;
}

const identifier = 'base:html';

export function HTML(props: Props) {
	return (
		<div
			class={merge(identifier, props.class)}
			dangerouslySetInnerHTML={{ __html: props.html }}
		/>
	);
}

export default { identifier, component: HTML };
