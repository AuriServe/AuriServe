import { h } from 'preact';
import { useMemo } from 'preact/hooks';

import { Format } from 'common';
import { User, Media } from 'common/graph/type';

import MediaIcon from './MediaIcon';
import Selectable from '../structure/Selectable';

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
			<Selectable class='flex !w-full gap-2' ind={ind} callbacks={callbacks} doubleClickSelects={true}>
				<MediaIcon class='flex-shrink-0 w-20 h-20' path={media.url} />
				<div class='pl-1 text-left overflow-hidden'>
					<p class='pt-1 text-gray-100 dark:text-gray-800 truncate'>
						{media.name}</p>
					<p class='text-sm text-gray-300 dark:text-gray-600 py-0.5 truncate'>
						Uploaded by {user?.username ?? '[Unknown]'} {Format.date(media.created)}.</p>
					<p class='text-sm text-gray-400 dark:text-gray-500 py-0.5 truncate'>
						{(media.size && Format.vector(media.size, 'px') + ' • ')} {Format.bytes(media.bytes)}</p>
				</div>
			</Selectable>
		</li>
	);
}
