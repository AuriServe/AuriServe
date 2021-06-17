import * as Preact from 'preact';

import { ClientDefinition } from 'auriserve-api';

import './Hydration.sss';

export function withHydration(identifier: string, Element: any, mutateProps?: (props: any) => any): Preact.FunctionalComponent {
	return function(props: any) {
		let safeProps = JSON.parse(JSON.stringify({ ...props, children: undefined }));
		if (mutateProps) safeProps = mutateProps(safeProps);

		return (
			<div data-element={identifier}>
				<script type="application/json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(safeProps) }} />
				<Element {...props} />
			</div>
		);
	};
}

export function hydrate(e: ClientDefinition) {
	document.querySelectorAll(`[data-element="${e.identifier}"]`).forEach(elem => {
		const script = elem.querySelector(':scope > script') as HTMLScriptElement;
		const props = JSON.parse(script.innerText);
		script.remove();
		Preact.hydrate(Preact.createElement(e.element, props), elem);
	});
}

export function Static({ children, class: className }: { children: Preact.ComponentChildren; class?: string }) {
	return (typeof window === 'undefined' || 'ASEditor' in window) ?
		<div class={[ 'Static', className ].filter(s => s).join(' ')}>{children}</div> :
		<div class={[ 'Static', className ].filter(s => s).join(' ')} dangerouslySetInnerHTML={{ __html: '' }}/>;
}
