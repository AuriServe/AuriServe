import { h } from 'preact';

import { merge } from 'common/util';
import { usePageContext } from 'pages';
import { getOptimizedImage } from 'media';

type NavEntry = NavItem | 'separator';

interface NavItem {
	label: string;
	to?: string;
	target?: 'new';
	icon?: number;
	entries: NavEntry[];
}

interface Props {
	entries?: NavEntry[];
	iconSize?: number;

	style?: any;
	class?: string;
}

function Entries({ entries, iconSize }: { entries: NavEntry[], iconSize?: number }) {
	const ctx = usePageContext();
	const requestPath = (ctx?.path ?? '!!').replace(/^\//, '').replace(/#.*/, '').replace(/\/$/, '');

	return (
		<ul>
			{entries.map((entry) => {
				if (typeof entry === 'string')
					return <li class='separator' aria-hidden='true' />;

				return (
					<li key={entry.to} class={merge('item',
							entry.entries && 'has-entries',
							(entry.to ?? '!!!').replace(/^\//, '').replace(/#.*/, '').replace(/\/$/, '') === requestPath && 'active'
					)}>
						{!entry.to && <span class='label'>{entry.label}</span>}
						{entry.to && (
							<a
								rel='noreferrer noopener'
								href={entry.to}
								target={entry.target === 'new' ? '_blank' : undefined}
								class={merge('label')}>
								{entry.icon != null && (
									<img
										src={`/media/${getOptimizedImage(entry.icon, 'svg_min')?.path}`}
										width={iconSize}
										height={iconSize}
										alt=''
									/>
								)}
								<span>{entry.label}</span>
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
				<Entries entries={props.entries ?? []} iconSize={props.iconSize} />
			</div>
		</nav>
	);
}

export default { identifier, component: Navigation };
