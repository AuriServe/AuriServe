import { Fragment, h } from 'preact';
import { useMemo } from 'preact/hooks';
import { User, Media } from 'common/graph/type';
import { formatBytes, formatDate, formatVector } from 'common';

import MediaIcon from './MediaIcon';
import Selectable from '../structure/Selectable';

import { tw } from '../twind';

interface Props {
	user?: User;
	media: Media;
	ind: number;

	onClick: (id: string) => void;
}

export default function MediaItem({ user, media, ind, onClick }: Props) {
	const callbacks = useMemo(
		() => ({ onDoubleClick: onClick.bind(undefined, media.id) }),
		[media.id, onClick]
	);

	return (
		<li class={tw`flex place-items-stretch`}>
			<Selectable
				ind={ind}
				callbacks={callbacks}
				doubleClickSelects={true}
				class={tw`flex group !w-full p-2 gap-2 rounded-md transition !outline-none hocus:shadow-md
					border-{2 gray-{{200 dark:700} hocus:{300 dark:600}}} hocus:bg-gray-{100 dark:750}`}
				selectedClass={tw`!border-accent-{300 dark:500/40} !bg-accent-{50 dark:900/20}`}>
				{(selected) => (
					<Fragment>
						<MediaIcon
							path={media.url}
							class={tw`flex-shrink-0 group-hover:bg-gray-{200 dark:700} ${
								selected
									? '!bg-accent-{200 dark:900/50} !icon-p-accent-{600 dark:200} !icon-s-accent-400'
									: '!icon-p-gray-{400 dark:200} !icon-s-gray-{300 dark:500}'
							}`}
						/>

						<div class={tw`pl-1 text-left overflow-hidden`}>
							<p
								class={tw`pt-0.5 truncate font-medium
									${selected ? 'text-accent-{900 dark:100}' : 'text-gray-{700 dark:100}'}`}>
								{media.name}
							</p>
							<p
								class={tw`text-sm pt-0.5 truncate font-medium
									${selected ? 'text-accent-{800/75 dark:300}' : 'text-gray-{500 dark:200}'}`}>
								Uploaded by {user?.username ?? '[Unknown]'} {formatDate(media.created)}.
							</p>
							<p
								class={tw`text-sm pt-1 truncate font-normal
									${selected ? 'text-accent-{800/75 dark:300}' : 'text-gray-{500 dark:200}'}`}>
								{media.size && `${formatVector(media.size)} px • `}{' '}
								{formatBytes(media.bytes)}
							</p>
						</div>
					</Fragment>
				)}
			</Selectable>
		</li>
	);
}
