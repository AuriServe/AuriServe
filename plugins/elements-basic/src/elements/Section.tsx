import { h } from 'preact';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';

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
	return <Tag class={merge('Section', props.class)} children={props.children} />;
}

export default { identifier: 'Section', component: Section };
