export interface PageMetadata {
	type?: 'page';
	title?: string;
	description?: string;
	index?: boolean;
}

export interface PageDocument {
	metadata: PageMetadata;
	content: {
		layout: string;
		sections: Record<string, Node>;
	};
}

export interface IncludeMetadata {
	type: 'include'
}

export interface IncludeDocument {
	metadata: IncludeMetadata;
	content: Node;
}

export type Document = PageDocument | IncludeDocument;

export interface ElementNode {
	element: string;
	exposeAs?: string;
	props?: Record<string, any>;
	children?: Node[] | Record<string, Node[]>;
}

export interface IncludeNode {
	props?: Record<string, Record<string, any>>;
	include: string;
}

// export interface PopulatedIncludeNode extends IncludeNode {
// 	element: ElementNode;
// }

export type Node = ElementNode | IncludeNode /*| PopulatedIncludeNode*/;

export function isElementNode(node: Node): node is ElementNode {
	return !('include' in node);
}

export function isIncludeNode(node: Node): node is IncludeNode {
	return 'include' in node;
}

// export function isPopulatedIncludeNode(node: Node): node is PopulatedIncludeNode {
// 	return isIncludeNode(node) && 'element' in node;
// }

export function isPageDocument(document: Document): document is PageDocument {
	return !isIncludeDocument(document);
}

export function isIncludeDocument(document: Document): document is IncludeDocument {
	return 'metadata' in document && document.metadata.type === 'include';
}
