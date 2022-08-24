import { hydrate as preactHydrate, h, FunctionalComponent } from 'preact';

// Export utilites.

export { default as Static } from './Static';

/**
 * Returns a preact component that renders the provided Element with the data necessary to hydrate it.
 * Props can optionally be transformed before being written to the dom, to reduce network load.
 * Rehydration should be done on the client with the hydrate() function.
 * When run on the client, just returns `element`.
 */

export function hydrate(identifier: string, element: FunctionalComponent) {
	return element;
}

/**
 * Hydrates all instances of a hydratable preact component on the client.
 */

export function hydrateElement(element: { identifier: string, component: FunctionalComponent }) {
	document.querySelectorAll(`[data-element="${element.identifier}"]`).forEach(elem => {
		const script = elem.querySelector(':scope > script') as HTMLScriptElement;
		const props = JSON.parse(script.innerText);
		script.remove();
		preactHydrate(h(element.component, props), elem);
	});
}
