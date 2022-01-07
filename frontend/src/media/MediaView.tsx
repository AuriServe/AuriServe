import { h } from 'preact';

import Card from '../Card';
import * as Btn from '../Button';
import MediaIcon from './MediaIcon';
import { Media, User } from 'common/graph/type';

import { formatVector, formatBytes, formatDate } from 'common';

import icon_code from '@res/icon/code.svg';
import icon_edit from '@res/icon/edit.svg';
import icon_trash from '@res/icon/trash.svg';
import icon_external from '@res/icon/external.svg';

interface Props {
	user: User;
	media: Media;
	onDelete?: () => void;
}

/** Image extensions that should be considered for loading a preview from URL. */
const IMAGE_EXTS = ['png', 'svg', 'jpg', 'jpeg', 'svg', 'gif'];

export default function MediaView({ user, media, onDelete }: Props) {
	const isImage = IMAGE_EXTS.filter((p) => media.extension === p).length > 0;

	const handleCopyID = () => {
		navigator.clipboard.writeText(media.id);
	};

	return (
		<div class='w-screen max-w-3xl'>
			<Card.Header class='flex flex-row gap-3 items-center'>
				<MediaIcon path={media.url} iconOnly={true} class='!bg-neutral-100 dark:!bg-neutral-600' />

				<div class='text-left overflow-hidden flex-grow'>
					<p class='truncate font-medium text-neutral-100'>{media.name}</p>
					<p class='text-sm pt-0.5 truncate font-medium text-neutral-200'>
						Uploaded by {user?.username ?? 'Unknown'} {formatDate(media.created)}.
					</p>
					<p class='text-sm pt-1 pb-0.5 truncate font-normal text-neutral-200'>
						{media.url} • <Btn.Link icon={icon_code} iconOnly label='Copy ID' onClick={handleCopyID} />
					</p>
				</div>
			</Card.Header>

			<Card.Toolbar>
				{onDelete && <Btn.Tertiary icon={icon_trash} label='Delete' onClick={onDelete} />}
				{onDelete && <Btn.Tertiary icon={icon_edit} label='Edit' onClick={onDelete} />}
			</Card.Toolbar>

			<Card.Body class='w-full flex place-items-center text-center'>
				{isImage ? (
					<img
						width={media.size!.x}
						height={media.size!.y}
						src={media.url}
						alt=''
						class='w-full h-max min-w-16 max-h-128 object-contain rounded'
					/>
				) : (
					<div class='py-20 w-full flex flex-col items-center gap-4'>
						<p class='text-neutral-300 font-medium'>&nbsp;Can't preview this type of file.</p>
						<Btn.Tertiary icon={icon_external} label='Open in new tab' href={media.url} />
					</div>
				)}
			</Card.Body>

			<Card.Footer>
				{media.size && `${formatVector(media.size)} px • `} {formatBytes(media.bytes)}
				&nbsp;•&nbsp;
				<Btn.Link icon={icon_external} label='Open' href={media.url} iconRight />
			</Card.Footer>
		</div>
	);
}
