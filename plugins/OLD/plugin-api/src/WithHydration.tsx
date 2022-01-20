import { h, FunctionalComponent } from 'preact';

/**
 * Returns a preact component that renders the provided Element with the data necessary to hydrate it.
 * Props can optionally be transformed before being written to the dom, to reduce network load.
 * Rehydration should be done on the client with the hydrate() function.
 */

export default function withHydration<T = any>(identifier: string, Element: FunctionalComponent<T>,
	mutateProps?: (props: T) => any): FunctionalComponent<T> {

	return function(props: T) {
		let serializedProps = JSON.stringify({ ...props, children: undefined });
		if (mutateProps) serializedProps = JSON.stringify(mutateProps(JSON.parse(serializedProps)));

		return (
			<div data-element={identifier}>
				<script type="application/json"
					dangerouslySetInnerHTML={{ __html: serializedProps }}/>
				<Element {...props}/>
			</div>
		);
	};
}
