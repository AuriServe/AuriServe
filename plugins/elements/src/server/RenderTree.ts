import { useContext } from 'preact/hooks';
import { Context, createContext, h, VNode } from 'preact';
import { renderToString } from 'preact-render-to-string'

import { Node } from '../common/Tree';
import { elements } from '../common/Elements';
import UndefinedElement from '../common/UndefinedElement';

export const RenderContext = createContext({});

export function useRenderContext<C>() {
	return useContext<C>(RenderContext as any as Context<C>);
}

export default async function renderTree<C>(tree: Node, context: C): Promise<string> {
	async function elementFromNode(node: Node): Promise<VNode> {
		const Component = elements.get(node.element)?.component;
		if (!Component) return h(UndefinedElement, { elem: node.element });
		return h(
			Component,
			node.props ?? null,
			await Promise.all((node.children || []).map(elementFromNode))
		);
	}

	return renderToString(h(RenderContext.Provider,
		{ value: context as any } as any, [ await elementFromNode(tree) ]));
}

