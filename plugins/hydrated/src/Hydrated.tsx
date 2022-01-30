import { h, FunctionalComponent } from 'preact';

/**
 * Returns a preact component that renders the provided Element with the data necessary to hydrate it.
 * Props can optionally be transformed before being written to the dom, to reduce network load.
 * Rehydration should be done on the client with the hydrate() function.
 */

export default function hydrated<PS, PH = PS>(
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
				<script
					type='application/json'
					dangerouslySetInnerHTML={{ __html: hydratePropsStr }}
				/>
				<Component {...props} />
			</div>
		);
	};
}
