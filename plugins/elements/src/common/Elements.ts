import type { ComponentClass, FunctionalComponent } from 'preact';

export interface Element {
	identifier: string;
	component: ComponentClass<any, any> | FunctionalComponent<any>;
}

export const elements = new Map();

export function addElement(element: any) {
	elements.set(element.identifier, element);
}

export function removeElement(identifier: string) {
	return elements.delete(identifier);
}
