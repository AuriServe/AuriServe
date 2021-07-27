import { h, ComponentChildren } from 'preact';

import { mergeClasses } from 'common/util';
import { ServerDefinition } from 'common/definition';

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
	return <Tag class={mergeClasses('Section', props.class)} children={props.children}/>;
}

export const server: ServerDefinition = { identifier: 'Section', element: Section };
