import * as Preact from 'preact';
import { ServerDefinition } from 'auriserve-api';

interface Props {
	role?: 'header' | 'footer' | 'aside' | 'section';
	
	class?: string;
	children?: Preact.VNode[];
}

/**
 * Renders a section, header, footer, or aside
 * depending on the specified role. Defaults to section.
 */

function Section(props: Props) {
	return Preact.h(
		props.role ?? 'section',
		{ class: ('Section ' + (props.class ?? '')).trim() },
		props.children
	);
}

export const server: ServerDefinition = {
	identifier: 'Section',
	element: Section,
	config: {
		props: {
			role: { type: [ [ 'header', 'footer', 'aside', 'section' ] ], optional: true }
		}
	}
};
