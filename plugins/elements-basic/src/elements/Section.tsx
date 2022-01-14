import as from 'auriserve';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

const {
	preact: { h },
} = as.preact;

export interface Props {
	role?: 'header' | 'footer' | 'aside' | 'section';

	class?: string;
	children?: ComponentChildren;
}

/**
 * Renders a section, header, footer, or aside depending on the specified role,
 * and the children within them. Defaults to section.
 */

export function Section(props: Props) {
	const Tag = props.role ?? 'section';
	// eslint-disable-next-line
	// @ts-ignore
	return <Tag class={merge('Section', props.class)} children={props.children} />;
}

export default { identifier: 'Section', component: Section };
