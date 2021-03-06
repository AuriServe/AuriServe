import * as Preact from 'preact';
import { Format } from 'common';
import { useState, useEffect } from 'preact/hooks';

import { mergeClasses } from 'common/util';

import { Form } from '../input';
import MediaUploadItem from './MediaUploadItem';
import { Button, SelectGroup, DimensionTransition } from '../structure';

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

		Promise.all(promises).then(props.onUpload);
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
		file={f} ind={i} key={f.file.name} enabled={state === MediaUploadState.SELECTING}
		onNameChange={(name) => handleNameChange(i, name)} onFilenameChange={(filename) => handleFilenameChange(i, filename)}/>);

	return (
		<Form onSubmit={handleUpload}>
			<div class={mergeClasses(
				'flex place-items-center group relative rounded w-auto h-40',
				'bg-gray-900 dark:bg-gray-200 border border-gray-900 dark:border-gray-200 mt-1',
				'active:border-gray-500 dark:active:border-gray-500 focus-within:border-gray-500 dark:focus-within:border-gray-500',
				'focus:outline-none transition duration-150 select-none', state !== MediaUploadState.SELECTING && 'disabled')}>

				<div class={mergeClasses('absolute pointer-events-none -inset-px transform scale-90 rounded bg-gray-500',
					'opacity-0 transition duration-150 group-hover:opacity-10 group-hover:scale-100 group-focus-visible:opacity-10',
					'group-focus-visible:scale-100')}/>

				<input type='file' multiple autoFocus
					class='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
					onChange={handleAddFiles}
					disabled={state !== MediaUploadState.SELECTING} />
				
				<h2 class='block w-full text-center text-gray-500 text-xl'>Click or drag files here to upload.</h2>
			</div>

			{files.length > 0 && <div class='my-3 h-12'>
				{selected.length > 0 && <Button onClick={handleRemoveFiles} icon='/admin/asset/icon/trash-dark.svg'
					label={'Remove' + (selected.length === 1 ? '' : ' (' + selected.length + ')')}/>}
			</div>}

			<DimensionTransition duration={150}>
				{state === MediaUploadState.SELECTING &&
					<SelectGroup
						class='w-screen max-w-3xl grid grid-cols-2 gap-3'
						selected={selected} setSelected={setSelected} multi={true}>
						{uploadItems}
					</SelectGroup>
				}

				{state === MediaUploadState.UPLOADING &&
					<div class='w-screen max-w-3xl grid grid-cols-2 gap-3'>{uploadItems}</div>
				}
			</DimensionTransition>

			<div class='flex mt-3 justify-between'>
				<Button onClick={handleClose} label='Cancel'
					disabled={state === MediaUploadState.UPLOADING}/>

				<Button type='submit' label={`Upload File${files.length > 1 ? 's' : ''}`}
					disabled={files.length === 0 || state === MediaUploadState.UPLOADING}/>
			</div>
		</Form>
	);
}
