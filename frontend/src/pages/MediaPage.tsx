import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { useParams, useNavigate } from 'react-router-dom';

import { Media } from 'common/graph/type';

import Card from '../Card';
import * as Btn from '../Button';
import MediaItem from '../media/MediaItem';
import MediaView from '../media/MediaView';
import MediaUploadForm from '../media/MediaUploadForm';
import { Title, Page, SectionHeader, Modal, SelectGroup, SavePopup } from '../structure';
import {
	useData,
	executeQuery,
	QUERY_INFO,
	QUERY_MEDIA,
	QUERY_QUOTAS,
	QUERY_USERS,
	MUTATE_DELETE_MEDIA,
} from '../Graph';

import icon_add from '@res/icon/add.svg';
import icon_view from '@res/icon/view.svg';
import icon_image from '@res/icon/image.svg';
import icon_trash from '@res/icon/trash.svg';
import icon_options from '@res/icon/options.svg';
import icon_refresh from '@res/icon/refresh.svg';

type SortingMode = 'size' | 'name' | 'uploader' | 'date' | 'type';

const SORTING_FUNCS: { [sorting in SortingMode]: (a: Media, b: Media) => number } = {
	size: (a: Media, b: Media) => a.bytes - b.bytes,
	name: (a: Media, b: Media) =>
		a.name.localeCompare(b.name, undefined, { numeric: true }),
	uploader: (a: Media, b: Media) =>
		a.user!.localeCompare(b.user!, undefined, { numeric: true }),
	date: (a: Media, b: Media) => a.created - b.created,
	type: () => 0,
};

// function titleCase(str: string): string {
// 	return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
// }

export default function MediaPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	const uploading: boolean = id === 'upload';
	const viewing: string | null = !uploading ? id! : null;

	const [data, refresh] = useData(
		[QUERY_INFO, QUERY_MEDIA, QUERY_QUOTAS, QUERY_USERS],
		[]
	);

	// const [ view, setView ] = useState<'grid' | 'list'>('grid');
	const [filter] = useState<string>('');
	const [sortDir] = useState<'ascending' | 'descending'>('descending');
	const [sortType] = useState<SortingMode>('size');

	const [media, setMedia] = useState<Media[]>(data.media ?? []);
	const [deleted, setDeleted] = useState<number[]>([]);
	const [selected, setSelected] = useState<number[]>([]);

	const handleUploaded = () => {
		refresh();
		navigate('/media');
	};

	const handleDelete = useCallback(
		(items: number[]) => {
			setDeleted([...deleted, ...items]);
			if (viewing) navigate('..');
		},
		[deleted, viewing, navigate]
	);

	const handleSave = async () => {
		await executeQuery(MUTATE_DELETE_MEDIA, {
			media: media.filter((_, i) => deleted.includes(i)).map((m) => m.id),
		});
		refresh();
		if (viewing) navigate('..');
		setDeleted([]);
	};

	useEffect(() => {
		let newMedia = [...(data.media ?? [])];

		let query = filter.toLowerCase();
		// let mimes = (query.match(/#\w+\/?\w*/g) ?? []).map(s => s.substr(1));
		query = query.replace(/#\w*\/?\w* */g, '');

		if (filter)
			newMedia = newMedia.filter(
				(m) => m.url.toLowerCase().includes(query) || m.name.toLowerCase().includes(query)
			);

		// if (mimes.length) newMedia = newMedia.filter(({ path: p }) =>
		// 	mimes.filter(m => mime.getType(p)?.startsWith(m)).length);

		if (sortDir === 'ascending') newMedia = newMedia.sort(SORTING_FUNCS[sortType]);
		else newMedia = newMedia.sort(SORTING_FUNCS[sortType]).reverse();

		setMedia(newMedia);
	}, [sortType, sortDir, data.media, filter]);

	useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === 'Delete') handleDelete(selected);
		};

		window.addEventListener('keyup', handleKeyUp);
		return () => window.removeEventListener('keyup', handleKeyUp);
	}, [selected, handleDelete]);

	const viewingItem = media?.filter((m) => m.id === viewing)[0];

	return (
		<Page>
			<Title>Media</Title>
			<div class='flex justify-center gap-6 mx-6'>
				<Card class='flex-grow max-w-screen-xl mt-6 max-w-3xl'>
					<Card.Header
						icon={icon_image}
						title='Manage Media'
						subtitle='Upload, edit, and remove user-uploaded media.'
					/>
					<Card.Toolbar>
						<Btn.Secondary
							to='/media/upload/'
							onClick={() => setSelected([])}
							icon={icon_add}
							label='Upload Media'
						/>

						{selected.length > 0 && <Card.Toolbar.Divider />}

						{selected.length === 1 && (
							<Btn.Tertiary
								onClick={() => navigate(`${media[selected[0]].id}/`)}
								icon={icon_view}
								label='View'
							/>
						)}

						{selected.length > 0 && (
							<Btn.Tertiary
								icon={icon_trash}
								label={`Delete ${selected.length === 1 ? '' : `(${selected.length})`}`}
								onClick={() => handleDelete(selected)}
							/>
						)}

						<Card.Toolbar.Spacer />

						<Btn.Tertiary
							onClick={refresh}
							iconOnly
							icon={icon_view}
							label='View Options'
						/>
						<Btn.Tertiary
							onClick={refresh}
							iconOnly
							icon={icon_refresh}
							label='Refresh'
						/>

						<Btn.Tertiary
							to='/settings/media/'
							iconOnly
							icon={icon_options}
							label='Media Settings'
						/>
					</Card.Toolbar>

					<Card.Body>
						{media.filter((_, i) => !deleted.includes(i)) && (
							<SelectGroup
								selected={selected}
								setSelected={setSelected}
								multi={true}
								enabled={true}
								class='grid gap-3 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]'>
								{media
									.map((item: any, ind: number) =>
										!deleted.includes(ind) ? (
											<MediaItem
												ind={ind}
												user={data.users?.filter((u) => u.id === item.user)[0]}
												media={item}
												key={item.identifier}
												onClick={(id) => navigate(`${id}/`)}
											/>
										) : null
									)
									.filter((item) => item)}
							</SelectGroup>
						)}

						{(!media || !media.filter((_, i) => !deleted.includes(i)).length) && (
							<h2 class='text-2xl text-center mt-20 mb-16 pb-2 text-neutral-500'>
								{!media ? 'Loading media...' : 'No media found.'}
							</h2>
						)}
					</Card.Body>
				</Card>

				{/* <div class='flex-grow max-w-md mt-6'>
					<div class='sticky w-full top-6'>
						<Card class='w-full mx-0 mb-6'>
							<Card.Header icon={icon_image} title='Storage'/>
							<Card.Body>
								<p class='mb-48'>WIP</p>
							</Card.Body>
						</Card>

						<Card class='w-full mx-0 mt-6'>
							<Card.Header icon={icon_image} title='Tasks'/>
							<Card.Body>
								<p class='mb-48'>WIP</p>
							</Card.Body>
						</Card>
					</div>
				</div> */}
			</div>

			<Modal active={viewingItem !== undefined} onClose={() => navigate('/media/')}>
				{viewingItem && (
					<MediaView
						onDelete={() => handleDelete([media.map((a) => a.id).indexOf(viewing!)])}
						user={data.users!.filter((u) => u.id === viewingItem!.user)[0]!}
						media={viewingItem}
					/>
				)}
			</Modal>

			<Modal active={uploading}>
				<SectionHeader
					icon='/admin/asset/icon/document-dark.svg'
					title='Upload Media'
					subtitle={`Upload new media assets to ${data.info?.name ?? ''}.`}
				/>
				<MediaUploadForm onCancel={() => navigate('..')} onUpload={handleUploaded} />
			</Modal>

			<SavePopup
				active={deleted.length !== 0}
				onSave={handleSave}
				onReset={() => setDeleted([])}
			/>
		</Page>
	);
}
