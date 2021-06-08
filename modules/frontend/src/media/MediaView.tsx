import * as Preact from 'preact';
// import { useState } from 'preact/hooks';

import { Format } from 'common';
import { Media, User } from 'common/graph/type';

import { Button, DimensionTransition } from '../structure';
import UserTag from '../user/UserTag';
// import MediaReplaceForm from './MediaReplaceForm';
import MediaIcon, { mediaIsImage } from './MediaIcon';

interface Props {
	user: User;
	media: Media;
	onDelete?: () => void;
}

export default function MediaView({ user, media, onDelete }: Props) {
	// const [ replacing, setReplacing ] = useState<boolean>(false);

	console.log(media.id);
	
	return (
		<DimensionTransition duration={200} mode='height'>
			<div class='block overflow-hidden w-screen max-w-3xl'>
				<div class='flex flex-row gap-4 items-center'>
					<MediaIcon path={media.url} imageIcon={false} class='w-20 h-20 !bg-gray-900 dark:!bg-gray-200'/>
					<div>
						<h1 class='text-gray-100 font-medium truncate'>{media.name}</h1>
						<h2 class='text-gray-300 font-medium text-sm py-0.5 truncate'>
							{Format.bytes(media.bytes)} • Uploaded by <UserTag user={user} /> {Format.date(media.created)}</h2>
						<h3 class='text-gray-400 font-medium text-sm py-0.5 truncate'>{media.url}</h3>
					</div>
				</div>

				<div class='mt-4 flex flex-row gap-2'>
					{onDelete && <Button icon='/admin/asset/icon/trash-dark.svg' label='Delete' onClick={() => onDelete!()}/>}
					{/* <Button icon='/admin/asset/icon/refresh-dark.svg' label={replacing ? 'Cancel' : 'Replace File'}
						onClick={() => setReplacing(!replacing)}/>*/}

					<div class='flex-grow'/>

					{mediaIsImage('.' + media.extension) &&
						<Button icon='/admin/asset/icon/external-dark.svg' label='Open in New Tab'
							href={media.url} target='_blank' rel='noreferrer noopener'/>}
					
				</div>

				<div class='w-full flex place-items-center p-4 mt-4 text-center rounded bg-gray-900 dark:bg-gray-200'>
					{mediaIsImage('.' + media.extension)
						? <img width={media.size!.x} height={media.size!.y} src={media.url} alt=''
							class='w-full h-max min-w-16 max-h-96 object-contain'/>
						: <Button icon='/admin/asset/icon/external-dark.svg' target='_blank' rel='noreferrer noopener' label='View File'
							href={media.url} class='my-24 mx-auto py-2.5 px-3 !bg-gray-800 dark:!bg-gray-300'></Button>
					}
				</div>

				{/* this.state.replacing &&
					<MediaReplaceForm
						replace={props.item.id}
						accept={'.' + props.item.extension}
						onSubmit={this.handleReplaceSubmit} /> */}
			</div>
		</DimensionTransition>
	);
};
