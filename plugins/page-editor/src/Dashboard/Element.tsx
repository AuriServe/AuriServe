import { Node } from 'pages';
import { assert } from 'common';
import { h, createContext } from 'preact';

import { Stack } from './mock/Stack';
import { Text } from './mock/Text';

export interface ElementContextData {
	path: string;
	setProps(props: any): void;
}

export const ElementContext = createContext<ElementContextData>(null as any);

export interface Props {
	node: Node;
	path: string;
}

export default function Element({ node, path }: Props) {
	assert('element' in node, 'Not a component node');
	assert(node.element === 'Stack' || node.element === 'Text', 'Not a supported element');

	const ctx = {
		path,
		setProps: (props: any) => console.warn(props),
	};

	const Elem = node.element === 'Stack' ? Stack : Text;

	return (
		<ElementContext.Provider value={ctx}>
			<Elem {...(node.props as any)}>
				{(node.children ?? []).map((child, i) => (
					<Element key={i} node={child} path={`${path}.children[${i}]`} />
				))}
			</Elem>
		</ElementContext.Provider>
	);
}
