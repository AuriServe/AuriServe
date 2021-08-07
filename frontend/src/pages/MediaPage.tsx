import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useParams, useHistory } from 'react-router-dom';

import { Media } from 'common/graph/type';

import { mergeClasses } from 'common/util';

import { Text } from '../input';
import MediaItem from '../media/MediaItem';
import MediaView from '../media/MediaView';
import MediaUploadForm from '../media/MediaUploadForm';
import { Title, Page, SectionHeader, Card, Button, Modal, Dropdown, SelectGroup, SavePopup } from '../structure';
import { useData, useMutation, QUERY_INFO, QUERY_MEDIA, QUERY_QUOTAS, QUERY_USERS, MUTATE_DELETE_MEDIA } from '../Graph';

type SortingMode = 'size' | 'name' | 'uploader' | 'date' | 'type';

const SORTING_FUNCS: {[sorting in SortingMode]: (a: Media, b: Media) => number} = {
	size: (a: Media, b: Media) => a.bytes - b.bytes,
	name: (a: Media, b: Media) => a.name.localeCompare(b.name, undefined, {numeric: true}),
	uploader: (a: Media, b: Media) => a.user!.localeCompare(b.user!, undefined, {numeric: true}),
	date: (a: Media, b: Media) => a.created - b.created,
	type: () => 0
};

function titleCase(str: string): string {
	return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export default function MediaPage() {
	const history = useHistory();
	const { id } = useParams<{ id: string }>();

	const uploading: boolean = id === 'upload';
	const viewing: string | null = !uploading ? id : null;

	let [ data, refresh ] = useData([ QUERY_INFO, QUERY_MEDIA, QUERY_QUOTAS, QUERY_USERS ], []);
	const deleteMedia = useMutation(MUTATE_DELETE_MEDIA);

	const [ view, setView ] = useState<'grid' | 'list'>('grid');
	const [ filter, setFilter ] = useState<string>('');
	const [ sortDir, setSortDir ] = useState<'ascending' | 'descending'>('descending');
	const [ sortType ] = useState<SortingMode>('size');

	const [ media, setMedia ] = useState<Media[]>(data.media ?? []);
	const [ deleted, setDeleted ] = useState<number[]>([]);
	const [ selected, setSelected ] = useState<number[]>([]);

	const handleUploaded = () => {
		refresh();
		history.push('/media');
	};

	const handleDelete = (items: number[]) => {
		setDeleted([ ...deleted, ...items ]);
		if (viewing) history.push('..');
	};

	const handleSave = async () => {
		await deleteMedia({ media: media.filter((_, i) => deleted.includes(i)).map(m => m.id) });
		await refresh();
		if (viewing) history.push('..');
		setDeleted([]);
	};

	useEffect(() => {
		let newMedia = [ ...data.media ?? [] ];

		let query = filter.toLowerCase();
		// let mimes = (query.match(/#\w+\/?\w*/g) ?? []).map(s => s.substr(1));
		query = query.replace(/#\w*\/?\w* */g, '');

		if (filter) newMedia = newMedia.filter(m =>
			m.url.toLowerCase().includes(query) || m.name.toLowerCase().includes(query));

		// if (mimes.length) newMedia = newMedia.filter(({ path: p }) =>
		// 	mimes.filter(m => mime.getType(p)?.startsWith(m)).length);

		if (sortDir === 'ascending') newMedia = newMedia.sort(SORTING_FUNCS[sortType]);
		else newMedia = newMedia.sort(SORTING_FUNCS[sortType]).reverse();

		setMedia(newMedia);
	}, [ sortType, sortDir, data.media, filter ]);

	useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === 'Delete') handleDelete(selected);
		};

		window.addEventListener('keyup', handleKeyUp);
		return () => window.removeEventListener('keyup', handleKeyUp);
	}, [ selected ]);

	let viewingItem = media?.filter(m => m.id === viewing)[0];

	return (
		<Page>
			<Title>Media</Title>
			<div class='flex justify-center gap-4 mx-4'>
				<Card class='flex-grow max-w-screen-xl mx-0'>
					<SectionHeader icon='/admin/asset/icon/image-dark.svg' title='Manage Media'
						subtitle='Upload, edit, and remove user-uploaded media.' class='!pb-0' />

					<div class='flex sticky top-0 place-content-between py-3 bg-white dark:bg-gray-100
						border-b border-gray-800 dark:border-gray-300 z-10 -mx-1.5 px-1.5'>
						<div class='flex gap-2'>
							<Button to='/media/upload/' onClick={() => setSelected([])} icon='/admin/asset/icon/add-dark.svg' label='Upload Media'/>

							{selected.length === 1 && <Button onClick={() => history.push(media[selected[0]].id + '/')}
								icon='/admin/asset/icon/view-dark.svg' label='View'/>}

							{selected.length > 0 && <Button onClick={() => handleDelete(selected)}
								icon='/admin/asset/icon/trash-dark.svg' label={'Delete ' +
									(selected.length === 1 ? '' : '(' + selected.length + ')')} />}
						</div>

						<div class='flex gap-2'>
							<Dropdown
								button={{ label: 'View Options', iconOnly: true,
									icon: `/admin/asset/icon/view-${filter ? 'color' : 'dark'}.svg` }}
								class='grid gap-2 p-2 w-48'>

								<Button label={titleCase(view) + ' View'} icon={`/admin/asset/icon/${view}-view-dark.svg`}
									onClick={() => setView(view === 'grid' ? 'list' : 'grid')}/>

								<div class='flex gap-2'>
									{/* <Select class='flex-shrink flex-grow-0' multi
										style={{ '--icon': 'url(/admin/asset/icon/sort-dark.svg)' } as any}
										options={{ name: 'Name', size: 'Size', uploader: 'Uploader', date: 'Upload Date', type: 'File Type' }}
										placeholder='No filter' value={sortType} setValue={setSortType} />*/}

									<Button label={titleCase(sortDir)} iconOnly
										icon={`/admin/asset/icon/sort-${sortDir === 'ascending' ? 'desc' : 'asc'}-dark.svg`}
										onClick={() => setSortDir(sortDir === 'ascending' ? 'descending' : 'ascending')}/>

									<Button label={titleCase(sortDir)} iconOnly
										onClick={() => setSortDir(sortDir === 'ascending' ? 'descending' : 'ascending')}>
										<img width={32} height={32} alt='' role='presentation' src='/admin/asset/icon/sort-desc-dark.svg'
											class={mergeClasses('w-8 h-8 dark:filter dark:invert dark:brightness-75 dark:contrast-200 transform',
												'dark:hue-rotate-180 pointer-events-none transition-all',
												sortDir === 'descending' && 'scale-y-[-100%]')}/>
									</Button>

									<Button label={titleCase(sortDir)} iconOnly
										icon={`/admin/asset/icon/sort-${sortDir === 'ascending' ? 'desc' : 'asc'}-dark.svg`}
										onClick={() => setSortDir(sortDir === 'ascending' ? 'descending' : 'ascending')}/>
								</div>

								<Text placeholder='No filter' value={filter} onValue={setFilter} />
							</Dropdown>

							<Button onClick={refresh} iconOnly icon='/admin/asset/icon/refresh-dark.svg' label='Refresh'/>

							<Button to='/settings/media/' iconOnly icon='/admin/asset/icon/settings-dark.svg' label='Media Settings'/>
						</div>
					</div>

					{media.filter((_, i) => !deleted.includes(i)) &&
						<SelectGroup selected={selected} setSelected={setSelected} multi={true} enabled={true}
							class='grid gap-3 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 pt-3'>
							{media.map((item: any, ind: number) => !deleted.includes(ind) ? (
								<MediaItem ind={ind} user={data.users?.filter(u => u.id === item.user)[0]}
									media={item} key={item.identifier} onClick={(id) => history.push(id + '/')}/>
							): null).filter(item => item)}
						</SelectGroup>
					}

					{(!media || !media.filter((_, i) => !deleted.includes(i)).length) &&
						<h2 class='text-2xl text-center mt-20 mb-16 pb-2 text-gray-400'>
							{!media ? 'Loading media...' : 'No media found.'}</h2>}
				</Card>

				<div class='flex-grow max-w-md'>
					<div class='sticky w-full top-8'>
						<Card class='w-full mx-0 mb-4'>
							<SectionHeader icon='/admin/asset/icon/element-dark.svg' title='Storage Space'/>
							<p class='mb-48'>fucky</p>
						</Card>

						<Card class='w-full mx-0 mt-4'>
							<SectionHeader icon='/admin/asset/icon/stats-dark.svg' title='Active Tasks'/>
							<p class='mb-32'>wucky</p>
						</Card>
					</div>
				</div>
			</div>

			<Modal active={viewingItem !== undefined} onClose={() => history.push('..')} defaultAnimation={true}>
				{viewingItem && <MediaView onDelete={() => handleDelete([ media.map(a => a.id).indexOf(viewing!) ])}
					user={data.users?.filter(u => u.id === viewingItem!.user)[0]!} media={viewingItem}/>}
			</Modal>

			<Modal active={uploading} defaultAnimation={true}>
				<SectionHeader icon='/admin/asset/icon/document-dark.svg' title='Upload Media'
					subtitle={`Upload new media assets to ${data.info?.name ?? ''}.`} />
				<MediaUploadForm onCancel={() => history.push('..')} onUpload={handleUploaded}/>
			</Modal>

			<SavePopup active={deleted.length !== 0} onSave={handleSave} onReset={() => setDeleted([])} />
		</Page>
	);
}
