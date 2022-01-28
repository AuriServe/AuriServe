import { h } from 'preact';

import { merge } from 'common/util';

type NavEntry = NavItem | 'separator';

interface NavItem {
	label: string;
	to?: string;
	target?: 'new';
	entries: NavEntry[];
}

interface Props {
	entries?: NavEntry[];

	style?: any;
	class?: string;
}

function Entries({ entries }: { entries: NavEntry[] }) {
	// const { path: activePath } = useServerContext();

	return (
		<ul>
			{entries.map((entry) => {
				if (typeof entry === 'string')
					return <li class='Navigation-ItemSeparator' aria-hidden='true' />;

				return (
					<li key={entry.to} class='Navigation-Item'>
						{!entry.to && <span class='Navigation-ItemLabel'>{entry.label}</span>}
						{entry.to && (
							<a
								rel='noreferrer noopener'
								href={entry.to}
								target={entry.target === 'new' ? '_blank' : undefined}
								class={merge(
									'Navigation-ItemLabel' /*, entry.to === activePath && 'Active'*/
								)}>
								{entry.label}
								{entry.target === 'new' && (
									<span class='sr-only'>(Opens in a new tab.)</span>
								)}
							</a>
						)}

						{entry.entries && <Entries entries={entry.entries} />}
					</li>
				);
			})}
		</ul>
	);
}

const identifier = 'base:navigation';

function Navigation(props: Props) {
	return (
		<nav class={merge(identifier, props.class)} style={props.style}>
			<label id='toggle' for='navigation_toggle' />
			<div class='entries-wrap'>
				<Entries entries={props.entries ?? []} />
			</div>
		</nav>
	);
}

export default { identifier, component: Navigation };
