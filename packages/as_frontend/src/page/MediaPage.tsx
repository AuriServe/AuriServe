import mime from 'mime';
import * as Preact from 'preact';
import { NavLink as Link } from 'react-router-dom';
import { useState, useEffect } from 'preact/hooks';

import { Media } from 'as_common/graph/interface';

import Title from '../Title';
import SavePopup from '../SavePopup';
import Modal from '../structure/Modal';
import MediaItem from '../media/MediaItem';
import MediaView from '../media/MediaView';
import Dropdown from '../structure/Dropdown';
import { Select, Text } from '../input/Input';
import CardHeader from '../structure/CardHeader';
import SelectGroup from '../structure/SelectGroup';
import MediaUploadForm from '../media/MediaUploadForm';
import { useQuery, useMutation, QUERY_INFO, QUERY_ALL_MEDIA, QUERY_QUOTAS, QUERY_USERS, MUTATE_DELETE_MEDIA } from '../Graph';

import './MediaPage.sass';

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
	let [ data,, refresh ] = useQuery([ QUERY_INFO, QUERY_ALL_MEDIA, QUERY_QUOTAS, QUERY_USERS ]);
	const deleteMedia = useMutation(MUTATE_DELETE_MEDIA);

	const [ view, setView ] = useState<'grid' | 'list'>('grid');
	const [ filter, setFilter ] = useState<string>('');
	const [ sortDir, setSortDir ] = useState<'ascending' | 'descending'>('descending');
	const [ sortType, setSortType ] = useState<SortingMode>('size');

	const [ media, setMedia ] = useState<Media[]>(data.media ?? []);
	const [ deleted, setDeleted ] = useState<number[]>([]);
	const [ selected, setSelected ] = useState<number[]>([]);

	const [ viewing, setViewing ] = useState<string | undefined>(undefined);
	const [ uploading, setUploading ] = useState<boolean>(false);

	const handleUploadMedia = () => {
		setSelected([]);
		setUploading(true);
	};

	const handleUploaded = () => {
		refresh();
		setUploading(false);
	};

	const handleDelete = (items: number[]) => {
		setDeleted([ ...deleted, ...items ]);
		setViewing(undefined);
	};

	const handleSave = async () => {
		await deleteMedia({ media: media.filter((_, i) => deleted.includes(i)).map(m => m.id) });
		await refresh();
		setViewing(undefined);
		setDeleted([]);
	};

	useEffect(() => {
		let newMedia = [ ...data.media ?? [] ];

		let query = filter.toLowerCase();
		let mimes = (query.match(/#\w+\/?\w*/g) ?? []).map(s => s.substr(1));
		query = query.replace(/#\w*\/?\w* */g, '');

		if (filter) newMedia = newMedia.filter(m =>
			m.url.toLowerCase().includes(query) || m.name.toLowerCase().includes(query));

		if (mimes.length) newMedia = newMedia.filter(({ path: p }) =>
			mimes.filter(m => mime.getType(p)?.startsWith(m)).length);

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

	let viewingItem = data.media?.filter(m => m.id === viewing)[0];

	return (
		<div class='Page MediaPage'>
			<Title>Media</Title>
			<section class='Page-Card'>
				<CardHeader icon='/admin/asset/icon/image-dark.svg' title='Manage Media'
					subtitle={'Create or remove user-uploaded media.'} />

				<div class='MediaPage-Toolbar'>
					<div>
						<button class='MediaPage-ToolbarButton' onClick={handleUploadMedia}>
							<img src='/admin/asset/icon/add-dark.svg' alt=''/><span>Upload Media</span>
						</button>

						{selected.length > 0 && <button class='MediaPage-ToolbarButton' onClick={() => handleDelete(selected)}>
							<img src='/admin/asset/icon/trash-dark.svg' alt=''/>
							<span>{selected.length === 1 ? 'Delete' : 'Delete (' + selected.length + ')'}</span>
						</button>}
					</div>

					<div>
						<button class='MediaPageDropdown-Button' title='Refresh'
							aria-label='Refresh' onClick={refresh}>
							<img src='/admin/asset/icon/refresh-dark.svg' alt=''/>
						</button>

						<Dropdown class='MediaPageDropdown'
							buttonClass='MediaPage-ToolbarButton'
							buttonChildren={<img src={`/admin/asset/icon/view-${filter ? 'color' : 'dark'}.svg`} alt=''/>}>
							
							<button class='MediaPageDropdown-Button' onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
								<img src={`/admin/asset/icon/${view}-view-dark.svg`} alt=''/>
								<span>{titleCase(view)} View</span>
							</button>
							
							<div class='MediaPageDropdown-LabelIconPair'>
								<Select class='MediaPageDropdown-IconWrap MediaPageDropdown-Input' multi={true}
									style={{ '--icon': 'url(/admin/asset/icon/sort-dark.svg)' } as any}
									options={{ name: 'Name', size: 'Size', uploader: 'Uploader', date: 'Upload Date', type: 'File Type' }}
									placeholder='No filter' value={sortType} setValue={setSortType} />

								<button class='MediaPageDropdown-Button' title={titleCase(sortDir)} aria-label={titleCase(sortDir)}
									onClick={() => setSortDir(sortDir === 'ascending' ? 'descending' : 'ascending')}>
									<img src={`/admin/asset/icon/sort-${sortDir === 'ascending' ? 'desc' : 'asc'}-dark.svg`} alt=''/>
								</button>
							</div>

							<div class='MediaPageDropdown-IconWrap'
								style={{ '--icon': 'url(/admin/asset/icon/filter-dark.svg)' } as any}>
								<Text class='MediaPageDropdown-Input' placeholder='No filter' value={filter} setValue={setFilter} />
							</div>
						</Dropdown>

						<Link className='MediaPage-ToolbarButton' title='Media Settings'
							aria-label='Media Settings' to='/settings/media'>
							<img src='/admin/asset/icon/settings-dark.svg' alt=''/>
						</Link>
					</div>
				</div>

				{media.filter((_, i) => !deleted.includes(i)) &&
					<SelectGroup selected={selected} setSelected={setSelected} multi={true} enabled={true}
						class={'MediaPage-Media ' + (view === 'grid' ? 'Grid' : 'Stack')}>
						{media.map((a: any, i: number) => !deleted.includes(i) ? (
							<MediaItem ind={i} user={data.users?.filter(u => u.id === a.user)[0]}
								item={a} key={a.identifier} onClick={() => setViewing(a.id)}/>
						): null).filter(i => i)}
					</SelectGroup>
				}

				{!media ? <h2 class='MediaPage-Notice'>Loading media...</h2> :
					!media.filter((_, i) => !deleted.includes(i)).length ?
						<h2 class='MediaPage-Notice'>No media found.</h2> : null}
			</section>

			<Modal active={viewingItem !== undefined} onClose={() => setViewing(undefined)} defaultAnimation={true}>
				{viewingItem && <MediaView onDelete={() => handleDelete([data.media!.map(a => a.id).indexOf(viewing!)])}
					user={data.users?.filter(u => u.id === viewingItem!.user)[0]!} item={viewingItem}/>}
			</Modal>

			<Modal active={uploading} defaultAnimation={true}>
				<CardHeader icon='/admin/asset/icon/document-dark.svg' title='Upload Media'
					subtitle={`Upload new media assets to ${data.info?.name ?? ''}.`} />
				<MediaUploadForm onCancel={() => setUploading(false)} onUpload={handleUploaded}/>
			</Modal>

			<SavePopup active={deleted.length !== 0} onSave={handleSave} onReset={() => setDeleted([])} />
		</div>
	);
}
