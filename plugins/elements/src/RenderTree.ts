import type { VNode } from 'preact';

import as from 'auriserve';

import { Node } from './Tree';
import UndefinedElement from './UndefinedElement';

const {
	preact: { h },
	renderToString,
} = as.preact;

// const { logger: Log } = as.core;

// type ExposedMap = Record<string, ExposedTree>;
// type ExposedTree = Record<string, Page.ComponentNode>;

// interface PageBuilderContextData {
// 	path: string;
// 	cookies: Record<string, string>;
// }

// export const PageBuilderContext = Preact.createContext<PageBuilderContextData>(undefined as any);

// export class RenderError extends Error {
// 	readonly code: number;
// 	constructor(...params: any[]) {
// 		super(...params);
// 		if (Error.captureStackTrace) Error.captureStackTrace(this, RenderError);
// 		this.name = 'RenderError';
// 		this.code = (params[1] as number) ?? 0;
// 	}
// }
// const contextData: PageBuilderContextData = {
// 	path: rawUrl,
// 	cookies: cookies
// };

export default async function renderTree(tree: Node): Promise<string> {

	async function elementFromNode(node: Node): Promise<VNode> {
		const Component = as.elements.registeredElements.get(node.element)?.component;
		if (!Component) return h(UndefinedElement, { elem: node.element });
		return h(
			Component,
			node.props,
			await Promise.all((node.children || []).map(elementFromNode))
		);
	}

	return renderToString(await elementFromNode(tree));
}

