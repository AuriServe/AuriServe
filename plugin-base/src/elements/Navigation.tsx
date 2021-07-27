import { h } from 'preact';

import { ServerDefinition } from 'common/definition';
import { mergeClasses } from 'common/util';

export type NavEntry = NavItem | 'separator';

export interface NavItem {
	label: string;
	to?: string;
	target?: 'new';
	entries: NavEntry[];
}

export interface Props {
	entries?: NavEntry[];

	style?: any;
	class?: string;
}

function Entries({ entries }: { entries: NavEntry[] }) {
	return (
		<ul>
			{entries.map(entry => {
				if (typeof entry === 'string') return <li class='Navigation-ItemSeparator' aria-hidden='true'/>;

				return <li class='Navigation-Item'>
					{!entry.to && <span class='Navigation-ItemLabel'>{entry.label}</span>}
					{entry.to && <a
						class='Navigation-ItemLabel'
						rel='noopener'
						href={entry.to}
						target={entry.target === 'new' ? '_blank' : undefined}
					>
						{entry.label}
						{entry.target === 'new' && <span class='sr-only'>(Opens in a new tab.)</span>}
					</a>}

					{entry.entries && <Entries entries={entry.entries}/>}
				</li>;
			})}
		</ul>
	);
}

/**
 * Renders a nav tag containing a tree of navigation entries.
 * Entries may be nested, go to internal or external pages, and open new tabs.
 */

export function Navigation(props: Props) {
	return (
		<nav class={mergeClasses('Navigation', props.class)} style={props.style}>
			<label id='Navigation-Toggle' for='Navigation-Open'/>
			<div class='Navigation-Wrap'>
				<Entries entries={props.entries ?? []}/>
			</div>
		</nav>
	);
}

export const server: ServerDefinition = { identifier: 'Navigation', element: Navigation };
