import { h } from 'preact';
import { ServerDefinition, useServerContext } from 'plugin-api';

import { merge } from 'common/util';

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
	const { path: activePath } = useServerContext();

	return (
		<ul>
			{entries.map(entry => {
				if (typeof entry === 'string') return <li class='Navigation-ItemSeparator' aria-hidden='true'/>;

				return <li class='Navigation-Item'>
					{!entry.to && <span class='Navigation-ItemLabel'>{entry.label}</span>}
					{entry.to && <a
						rel='noopener'
						href={entry.to}
						target={entry.target === 'new' ? '_blank' : undefined}
						class={merge('Navigation-ItemLabel', entry.to === activePath && 'Active')}
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
		<nav class={merge('Navigation', props.class)} style={props.style}>
			<label id='Navigation-Toggle' for='Navigation-Open'/>
			<div class='Navigation-Wrap'>
				<Entries entries={props.entries ?? []}/>
			</div>
		</nav>
	);
}

export const server: ServerDefinition = { identifier: 'Navigation', element: Navigation };
