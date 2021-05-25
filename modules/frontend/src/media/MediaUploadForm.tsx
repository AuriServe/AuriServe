import * as Preact from 'preact';
import { Format } from 'common';
import { useState, useEffect } from 'preact/hooks';

import './MediaUploadForm.sass';

import MediaUploadItem from './MediaUploadItem';
import SelectGroup from '../structure/SelectGroup';
import DimensionTransition from '../structure/DimensionTransition';

enum MediaUploadState {
	SELECTING,
	UPLOADING,
	COMPLETED
}

export interface UploadItemData {
	file: File;
	ext: string;

	name: string;
	identifier: string;

	thumbnail?: string;
}

interface Props {
	onCancel: () => void;
	onUpload: () => void;
}

export default function MediaUploadForm(props: Props) {
	const [ grid, setGrid ] = useState<boolean>(true);

	const [ selected, setSelected ] = useState<number[]>([]);
	const [ files, setFiles ] = useState<UploadItemData[]>([]);
	const [ state, setState ] = useState<MediaUploadState>(MediaUploadState.SELECTING);

	const handleClose = (e: any) => {
		e.preventDefault();
		props.onCancel();
	};

	const handleUpload = () => {
		setState(MediaUploadState.UPLOADING);
		setSelected([]);

		const THREADS = 6;

		let success: string[] = [];

		let promises: Promise<void>[] = [];
		for (let i = 0; i < THREADS; i++) {
			let ind = i;

			promises.push(new Promise((resolve) => {
				const f = () => {
					if (ind >= files.length) return resolve();
					const file = files[ind];

					let data = new FormData();
					data.append('file', file.file);
					data.append('name', file.name);
					data.append('identifier', file.identifier);

					fetch('/admin/media/upload', {
						method: 'POST', cache: 'no-cache', body: data
					}).then((r) => {
						if (r.status === 202) success.push(Format.sanitize(file.identifier || file.name));
						ind += THREADS;
						f();
					});
				};
				f();
			}));
		};

		Promise.all(promises).then(() => props.onUpload());
	};

	const handleRemoveFiles = () => {
		let newFiles = [ ...files ];
		selected.reverse().forEach((ind) => newFiles.splice(ind, 1));
		setFiles(newFiles);
	};

	const handleAddFiles = async (e: any) => {
		let newFiles = [ ...files ];
		let addedFiles = [ ...(e.target.files || [])];
		e.target.value = '';

		await Promise.all(addedFiles.map(file => new Promise<void>((resolve) => {
			const ext = file.name.substr(file.name.lastIndexOf('.') + 1);
			const isImage = ext === 'png' || ext === 'jpeg' || ext === 'jpg' || ext === 'svg' || ext === 'gif';

			const cleanName = Format.fileNameToName(file.name, 32);
			
			const resolveFile = (image?: string) => {
				if (!newFiles.map(f => f.name).includes(cleanName)) {
					newFiles.push({
						file, ext,
						name: cleanName,
						identifier: '',
						thumbnail: image
					});
				}
				resolve();
			};

			if (isImage) {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolveFile(reader.result as string);
			}
			else {
				resolveFile();
			}
		})));

		setFiles(newFiles);
	};

	const handleNameChange = (ind: number, name: string) => {
		let newFiles = [ ...files ];
		newFiles[ind] = { ...newFiles[ind], name };
		setFiles(newFiles);
	};

	const handleFilenameChange = (ind: number, name: string) => {
		const cleanName = name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
		let newFiles = [ ...files ];
		newFiles[ind] = { ...newFiles[ind], identifier: cleanName };
		setFiles(newFiles);
	};

	useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === 'Delete') handleRemoveFiles();
		};

		window.addEventListener('keyup', handleKeyUp);
		return () => window.removeEventListener('keyup', handleKeyUp);
	}, [ handleRemoveFiles ]);

	const uploadItems: Preact.VNode[] = files.map((f, i) => <MediaUploadItem
		file={f} ind={i} key={f.file.name} editable={state === MediaUploadState.SELECTING}
		onNameChange={(name) => handleNameChange(i, name)} onFilenameChange={(filename) => handleFilenameChange(i, filename)}/>);

	return (
		<form class="MediaUploadForm" onSubmit={(e) => e.preventDefault()}>
			<div class={'MediaUploadForm-InputWrap' + (state !== MediaUploadState.SELECTING ? ' disabled' : '')}>
				<input type="file" multiple autoFocus
					class="MediaUploadForm-Input"
					onChange={handleAddFiles}
					disabled={state !== MediaUploadState.SELECTING} />
				<h2>Click or drag files here to upload.</h2>
			</div>

			{files.length > 0 && <div class="MediaUploadForm-Toolbar">
				<div>
					{selected.length > 0 && <button class="MediaUploadForm-Toolbar-Button" onClick={handleRemoveFiles}>
						<img src="/admin/asset/icon/trash-dark.svg"/>
						<span>{selected.length === 1 ? 'Remove' : 'Remove (' + selected.length + ')'}</span>
					</button>}
				</div>
				<div>
					{/* <button class="MediaUploadForm-Toolbar-Button">
						<img src="/admin/asset/icon/sort-dark.svg"/><span>Sort by Size</span>
					</button>*/}

					<button class="MediaUploadForm-Toolbar-Button" onClick={() => setGrid(!grid)}>
						<img src={`/admin/asset/icon/${grid ? 'grid' : 'list'}-view-dark.svg`}/>
					</button>
				</div>
			</div>}

			<DimensionTransition duration={150}>
				{state === MediaUploadState.SELECTING &&
					<SelectGroup
						class={'MediaUploadForm-Files ' + (grid ? 'Grid' : 'Stack')}
						selected={selected} setSelected={setSelected} multi={true}>
						{uploadItems}
					</SelectGroup>
				}

				{state === MediaUploadState.UPLOADING &&
					<div class={'MediaUploadForm-Files ' + (grid ? 'Grid' : 'Stack')}>
						{uploadItems}
					</div>
				}
			</DimensionTransition>

			<div class="MediaUploadForm-ActionBar">
				<div>
					<button
						onClick={handleClose}
						class="MediaUploadForm-ActionBar-Button"
						disabled={state === MediaUploadState.UPLOADING}>
						Cancel
					</button>
				</div>
				<div>
					{files.length > 0 && <button
						onClick={handleUpload}
						class="MediaUploadForm-ActionBar-Button Upload"
						disabled={state === MediaUploadState.UPLOADING}>
						{`Upload File${files.length > 1 ? 's' : ''}`}
					</button>}
				</div>
			</div>
		</form>
	);
}
