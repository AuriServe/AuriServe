import { hydrate as preactHydrate, h, FunctionalComponent } from 'preact';

/**
 * The configuration object to pass into the hydrate function.
 * A ClientDefinition fits this interface.
 */

export interface HydrateConfig {
	identifier: string;
	element: FunctionalComponent;
}

/**
 * Hydrates a component rendered server-side using withHydration().
 * Removes component props from the DOM once the hydration occurs.
 */

export default function hydrate(e: HydrateConfig) {
	document.querySelectorAll(`[data-element="${e.identifier}"]`).forEach(elem => {
		const script = elem.querySelector(':scope > script') as HTMLScriptElement;
		const props = JSON.parse(script.innerText);
		script.remove();
		preactHydrate(h(e.element, props), elem);
	});
}
