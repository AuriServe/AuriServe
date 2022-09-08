import { h, VNode } from 'preact';
import { renderToString } from 'preact-render-to-string'

import { Node } from '../common/Tree';
import { elements } from '../common/Elements';
import UndefinedElement from '../common/UndefinedElement';

export default async function renderTree(tree: Node): Promise<string> {

	async function elementFromNode(node: Node): Promise<VNode> {
		const Component = elements.get(node.element)?.component;
		if (!Component) return h(UndefinedElement, { elem: node.element });
		return h(
			Component,
			node.props ?? null,
			await Promise.all((node.children || []).map(elementFromNode))
		);
	}

	return renderToString(await elementFromNode(tree));
}
