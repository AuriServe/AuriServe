import { Fragment, h } from 'preact';
import { useMemo } from 'preact/hooks';

import { Format } from 'common';
import { User, Media } from 'common/graph/type';

import MediaIcon from './MediaIcon';
import Selectable from '../structure/Selectable';
import { mergeClasses } from 'common/util';

interface Props {
	user?: User;
	media: Media;
	ind: number;

	onClick: (id: string) => void;
}

export default function MediaItem({ user, media, ind, onClick }: Props) {
	const callbacks = useMemo(() => ({ onDoubleClick: onClick.bind(undefined, media.id) }), [ media.id ]);

	return (
		<li class='flex place-items-stretch'>
			<Selectable ind={ind} callbacks={callbacks} doubleClickSelects={true}
				class='flex !w-full gap-2 p-2 group border-2 rounded-md transition !outline-none
					hover:bg-neutral-100 focus-visible:bg-neutral-100
					dark:hover:bg-neutral-750 dark:focus-visible:bg-neutral-750
					border-neutral-200 hover:border-neutral-300 focus-visible:border-neutral-300
					dark:border-neutral-700 dark:hover:border-neutral-600 dark:focus-visible:border-neutral-600
					hover:shadow-md focus-visible:shadow-md'
				selectedClass='!border-accent-300 !bg-accent-50
					dark:!border-accent-500/40 dark:!bg-accent-900/20'>
				{(selected) => <Fragment>
					<MediaIcon path={media.url}
						class={mergeClasses('flex-shrink-0 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700',
							!selected && '!primary-neutral-400 dark:!primary-neutral-200',
							!selected && '!secondary-neutral-300 dark:!secondary-neutral-500',
							selected && '!bg-accent-200 dark:!bg-accent-900/50 !primary-600 !secondary-400 dark:!primary-200')}/>

					<div class='pl-1 text-left overflow-hidden'>
						<p class={mergeClasses('pt-0.5 truncate font-medium',
							selected ? 'text-accent-900 dark:text-accent-100' : 'text-neutral-700 dark:text-neutral-100')}>
							{media.name}
						</p>
						<p class={mergeClasses('text-sm pt-0.5 truncate font-medium',
							selected ? 'text-accent-800/75 dark:text-accent-300' : 'text-neutral-500 dark:text-neutral-200')}>
							Uploaded by {user?.username ?? '[Unknown]'} {Format.date(media.created)}.
						</p>
						<p class={mergeClasses('text-sm pt-1 truncate font-normal',
							selected ? 'text-accent-800/75 dark:text-accent-300' : 'text-neutral-500 dark:text-neutral-200')}>
							{(media.size && Format.vector(media.size, 'px') + ' • ')} {Format.bytes(media.bytes)}
						</p>
					</div>
				</Fragment>}
			</Selectable>
		</li>
	);
}
