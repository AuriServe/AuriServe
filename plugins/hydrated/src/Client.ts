import { hydrate as preactHydrate, h, FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

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

export function hydrateElement(element: { identifier: string, component: FunctionalComponent<any> }) {
	document.querySelectorAll(`[data-element="${element.identifier}"]`).forEach(elem => {
		const script = elem.querySelector(':scope > script') as HTMLScriptElement;
		const props = JSON.parse(script.innerText);
		script.remove();
		preactHydrate(h(element.component, props), elem);
	});
}

/**
 * A hook that provides a boolean for if the element is currently hydrated.
 * Will force a full rerender of the component when the element is first hydrated.
 */

export function useHydrated(): boolean {
	const [ hydrated, setHydrated ] = useState(false);
	useEffect(() => setHydrated(true), []);
	return hydrated;
}

/**
 * A hook that provides the client's globalThis if the component is rendering on the client.
 * Will return null on the server. Forces a full rerender of the component when the element is first hydrated.
 */

export function useClient(): typeof window['globalThis'] | null {
	const hydrated = useHydrated();
	if (hydrated) return window.globalThis;
	return null;
}
