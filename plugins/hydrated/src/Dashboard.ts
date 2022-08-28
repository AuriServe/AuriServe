import { FunctionalComponent } from 'preact';

// Export utilites.

export { default as Static } from './Static';

/**
 * Returns a preact component that renders the provided Element with the data necessary to hydrate it.
 * Props can optionally be transformed before being written to the dom, to reduce network load.
 * Rehydration should be done on the client with the hydrate() function.
 * When run on the dashboard, just returns `element`.
 */

export function hydrate<PS, PH = PS>(
	identifier: string,
	element: FunctionalComponent<PS | PH>,
	_transformProps?: (props: PS) => PH
): FunctionalComponent<PS> {
	return element as FunctionalComponent<PS>;
}

/**
 * Hydrates all instances of a hydratable preact component on the client.
 */

export function hydrateElement(_element: { identifier: string, component: FunctionalComponent }) {
	// This function doesn't do anything on the dashboard :3
}
