import { hydrate as preactHydrate, h, FunctionalComponent } from 'preact';

export { default as Static } from './Static';

export function hydrate(identifier: string, element: FunctionalComponent) {
	return element;
}

export function hydrateElement(element: { identifier: string, component: FunctionalComponent }) {
	document.querySelectorAll(`[data-element="${element.identifier}"]`).forEach(elem => {
		const script = elem.querySelector(':scope > script') as HTMLScriptElement;
		const props = JSON.parse(script.innerText);
		script.remove();
		preactHydrate(h(element.component, props), elem);
	});
}
