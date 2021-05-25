export type Child = Element | Include;

export type ElementProps = {[key: string]: any};
export type IncludeProps = {[key: string]: ElementProps}

export interface Element {
	elem: string;
	props?: ElementProps;
	children?: Child[];
	exposeAs?: string;
}

export interface Include {
	include: string;
	override?: IncludeProps;
	elem?: Element;
}

export function isElement(e: Child): e is Element {
	return typeof e === 'object' && 'elem' in e && !('include' in e);
}

export function isInclude(e: Child): e is Include {
	return typeof e === 'object' && 'include' in e;
}

export interface PageMeta {
	title: string;
	description: string;
	
	layout: string;
}

export interface Page extends PageMeta {
	elements: {
		[key: string]: Child
	}
}
