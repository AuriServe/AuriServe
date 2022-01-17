export interface Metadata {
	title?: string;
	description?: string;
}

export interface Page {
	metadata: Metadata;
	content: {
		layout: string;
		sections: Record<string, Node>;
	};
}

export interface ElementNode {
	element: string;
	props?: Record<string, any>;
	children?: Node[];
}

export interface IncludeNode {
	include: string;
}

export interface PopulatedIncludeNode extends IncludeNode {
	node: ElementNode;
	override?: Record<string, Record<string, any>>;
}

export type Node = ElementNode | IncludeNode | PopulatedIncludeNode;

export function isComponentNode(node: Node): node is ElementNode {
	return typeof node === 'object' && 'element' in node && !('include' in node);
}

export function isIncludeNode(node: Node): node is IncludeNode {
	return typeof node === 'object' && 'include' in node;
}

export function isPopulatedIncludeNode(node: Node): node is PopulatedIncludeNode {
	return isIncludeNode(node) && 'node' in node;
}
