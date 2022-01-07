import { Fragment, h } from 'preact';
import { useMemo } from 'preact/hooks';

import { User, Media } from 'common/graph/type';

import MediaIcon from './MediaIcon';
import Selectable from '../structure/Selectable';

import { formatBytes, formatDate, formatVector, merge } from 'common';

interface Props {
	user?: User;
	media: Media;
	ind: number;

	onClick: (id: string) => void;
}

export default function MediaItem({ user, media, ind, onClick }: Props) {
	const callbacks = useMemo(() => ({ onDoubleClick: onClick.bind(undefined, media.id) }), [ media.id, onClick ]);

	return (
		<li class='flex place-items-stretch'>
			<Selectable ind={ind} callbacks={callbacks} doubleClickSelects={true}
				class='flex !w-full gap-2 p-2 group border-2 rounded-md transition !outline-none
					hocus:bg-neutral-100 dark:hocus:bg-neutral-750 hocus:shadow-md
					border-neutral-200 hocus:border-neutral-300 dark:border-neutral-700 dark:hocus:border-neutral-600'
				selectedClass='!border-accent-300 !bg-accent-50
					dark:!border-accent-500/40 dark:!bg-accent-900/20'>
				{(selected) => <Fragment>
					<MediaIcon path={media.url}
						class={merge('flex-shrink-0 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700',
							!selected && '!icon-p-neutral-400 dark:!icon-p-neutral-200',
							!selected && '!icon-s-neutral-300 dark:!icon-s-neutral-500',
							selected && '!bg-accent-200 dark:!bg-accent-900/50 !icon-p-accent-600 !icon-s-accent-400 dark:!icon-p-accent-200')}/>

					<div class='pl-1 text-left overflow-hidden'>
						<p class={merge('pt-0.5 truncate font-medium',
							selected ? 'text-accent-900 dark:text-accent-100' : 'text-neutral-700 dark:text-neutral-100')}>
							{media.name}
						</p>
						<p class={merge('text-sm pt-0.5 truncate font-medium',
							selected ? 'text-accent-800/75 dark:text-accent-300' : 'text-neutral-500 dark:text-neutral-200')}>
							Uploaded by {user?.username ?? '[Unknown]'} {formatDate(media.created)}.
						</p>
						<p class={merge('text-sm pt-1 truncate font-normal',
							selected ? 'text-accent-800/75 dark:text-accent-300' : 'text-neutral-500 dark:text-neutral-200')}>
							{(media.size && `${formatVector(media.size)} px • `)} {formatBytes(media.bytes)}
						</p>
					</div>
				</Fragment>}
			</Selectable>
		</li>
	);
}
