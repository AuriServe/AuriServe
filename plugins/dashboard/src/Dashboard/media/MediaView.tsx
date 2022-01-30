// import { h } from 'preact';
// import { formatVector, formatBytes, formatDate } from 'common';

// import Card from '../Card';
// import Button from '../Button';
// import MediaIcon from './MediaIcon';
// import { Media, User } from 'common/graph/type';

// import { tw } from '../twind';

// import icon_code from '@res/icon/code.svg';
// import icon_edit from '@res/icon/edit.svg';
// import icon_trash from '@res/icon/trash.svg';
// import icon_external from '@res/icon/external.svg';

// interface Props {
// 	user: User;
// 	media: Media;
// 	onDelete?: () => void;
// }

// /** Image extensions that should be considered for loading a preview from URL. */
// const IMAGE_EXTS = ['png', 'svg', 'jpg', 'jpeg', 'svg', 'gif'];

// export default function MediaView({ user, media, onDelete }: Props) {
// 	const isImage = IMAGE_EXTS.filter((p) => media.extension === p).length > 0;

// 	const handleCopyID = () => {
// 		navigator.clipboard.writeText(media.id);
// 	};

// 	return (
// 		<div class={tw`w-screen max-w-3xl`}>
// 			<Card.Header class={tw`flex-(& row) gap-3 items-center`}>
// 				<MediaIcon path={media.url} iconOnly={true} class={tw`!bg-gray-(100 dark:600)`} />

// 				<div class={tw`text-left overflow-hidden flex-grow`}>
// 					<p class={tw`truncate font-medium text-gray-100`}>{media.name}</p>
// 					<p class={tw`text-sm pt-0.5 truncate font-medium text-gray-200`}>
// 						Uploaded by {user?.username ?? 'Unknown'} {formatDate(media.created)}.
// 					</p>
// 					<p class={tw`text-sm pt-1 pb-0.5 truncate font-normal text-gray-200`}>
// 						{media.url} •{' '}
// 						<Button.Link
// 							icon={icon_code}
// 							iconOnly
// 							label='Copy ID'
// 							onClick={handleCopyID}
// 						/>
// 					</p>
// 				</div>
// 			</Card.Header>

// 			<Card.Toolbar>
// 				{onDelete && (
// 					<Button.Tertiary icon={icon_trash} label='Delete' onClick={onDelete} />
// 				)}
// 				{onDelete && <Button.Tertiary icon={icon_edit} label='Edit' onClick={onDelete} />}
// 			</Card.Toolbar>

// 			<Card.Body class={tw`w-full flex place-items-center text-center`}>
// 				{isImage ? (
// 					<img
// 						width={media.size!.x}
// 						height={media.size!.y}
// 						src={media.url}
// 						alt=''
// 						class={tw`w-full h-max min-w-16 max-h-128 object-contain rounded`}
// 					/>
// 				) : (
// 					<div class={tw`py-20 w-full flex-(& col) items-center gap-4`}>
// 						<p class={tw`text-gray-300 font-medium`}>
// 							&nbsp;Can't preview this type of file.
// 						</p>
// 						<Button.Tertiary
// 							icon={icon_external}
// 							label='Open in new tab'
// 							href={media.url}
// 						/>
// 					</div>
// 				)}
// 			</Card.Body>

// 			<Card.Footer>
// 				{media.size && `${formatVector(media.size)} px • `} {formatBytes(media.bytes)}
// 				&nbsp;•&nbsp;
// 				<Button.Link icon={icon_external} label='Open' href={media.url} iconRight />
// 			</Card.Footer>
// 		</div>
// 	);
// }
