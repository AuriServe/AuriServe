export interface ComponentNode {
	elem: string;
	props?: Record<string, any>;

	children?: Node[];
	exposeAs?: string;
}

export function isComponentNode(e: Node): e is ComponentNode {
	return typeof e === 'object' && 'elem' in e && !('include' in e);
}

export interface IncludeNode {
	include: string;
	elem?: ComponentNode;
	override?: Record<string, Record<string, any>>
}

export function isIncludeNode(e: Node): e is IncludeNode {
	return typeof e === 'object' && 'include' in e;
}

export type Node = ComponentNode | IncludeNode;

export interface PageMetadata {
	name?: string;
	description?: string;
	
	layout?: string;
}

export interface PageDocument extends PageMetadata {
	elements: { [key: string]: Node }
}

export function isPageDocument(e: Document): e is PageDocument {
	return typeof e === 'object' && 'elements' in e;
}

export interface IncludeDocument {
	include: true;
	element: ComponentNode;
}

export function isIncludeDocument(e: Document): e is IncludeDocument {
	return typeof e === 'object' && 'include' in e && e.include;
}

export type Document = PageDocument | IncludeDocument;
