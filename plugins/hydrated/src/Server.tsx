import path from 'path';
import auriserve from 'auriserve';
import { h, FunctionalComponent } from 'preact';
import { addStylesheet, removeStylesheet } from 'elements';

// Include the required stylesheets.

import './Style.pcss';

const styles = path.join(__dirname, 'style.css');
addStylesheet(styles);
auriserve.once('cleanup', () => removeStylesheet(styles));

// Export utilites.

export { default as Static } from './Static';

/**
 * Returns a preact component that renders the provided Element with the data necessary to hydrate it.
 * Props can optionally be transformed before being written to the dom, to reduce network load.
 * Rehydration should be done on the client with the hydrate() function.
 * When run on the client, just returns `element`.
 */

export function hydrate<PS, PH = PS>(
	identifier: string,
	Component: FunctionalComponent<PS | PH>,
	transformProps?: (props: PS) => PH
): FunctionalComponent<PS> {
	return function HydratedElement(props: PS) {
		const hydrateProps = { ...props };
		delete (hydrateProps as any).children;

		const hydratePropsStr = transformProps
			? JSON.stringify(transformProps(JSON.parse(JSON.stringify(hydrateProps))))
			: JSON.stringify(hydrateProps);

		return (
			<div data-element={identifier}>
				<script type='application/json' dangerouslySetInnerHTML={{ __html: hydratePropsStr }}/>
				<Component {...props as any}/>
			</div>
		);
	};
}

/**
 * Hydrates all instances of a hydratable preact component on the client.
 */

export function hydrateElement(_element: { identifier: string, component: FunctionalComponent<any> }) {
	// This function doesn't do anything on the server :3
}

/**
 * A hook that provides a boolean for if the element is currently hydrated.
 * Will force a full rerender of the component when the element is first hydrated.
 */

export function useHydrated(): boolean {
	return false;
}

/**
 * A hook that provides the client's globalThis if the component is rendering on the client.
 * Will return null on the server. Forces a full rerender of the component when the element is first hydrated.
 */

export function useClient(): typeof window['globalThis'] | null {
	return null;
}
