import * as Preact from 'preact';
import { ServerDefinition } from 'auriserve-api';

type NavEntry = NavItem | 'separator';

interface NavItem {
	label: string;
	to?: string;
	target?: 'new';
	entries: NavEntry[];
}

interface Props {
	entries: NavEntry[];
}

/**
 * Renders a tree of navigation entries recursively, returning
 * a single unordered list containing all of the entries.
 *
 * @param {NavEntry[]} entries - The list of entries to render.
 * @returns the rendered entries.
 */

function recursivelyRenderEntries(entries: NavEntry[]) {
	return (
		<ul>
			{entries.map((entry) => {
				if (typeof entry === 'string') return <li class="Navigation-ItemSeparator" aria-hidden="true" />;

				return <li class="Navigation-Item">
					{!entry.to && <span class="Navigation-ItemLabel">{entry.label}</span>}
					{entry.to && <a
						class="Navigation-ItemLabel"
						rel='noopener'
						href={entry.to}
						target={entry.target === 'new' ? '_blank' : undefined}
					>{entry.label}</a>}

					{entry.entries && recursivelyRenderEntries(entry.entries)}
				</li>;
			})}
		</ul>
	);
}

/**
 * Renders a Navigation element containing a list of navigation entries.
 */

function Navigation(props: Props) {
	return (
		<Preact.Fragment>
			<nav class="Navigation">
				<label id="Navigation-Toggle" for="Navigation-Open" />
				<div class="Navigation-Wrap">
					{recursivelyRenderEntries(props.entries)}
				</div>
			</nav>
		</Preact.Fragment>
	);
}

export const server: ServerDefinition = {
	identifier: 'Navigation',
	element: Navigation,
	config: {
		props: {
			entries: { type: 'custom' }
		}
	}
};
