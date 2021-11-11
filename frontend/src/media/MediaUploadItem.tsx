import { h } from 'preact';
import { useRef } from 'preact/hooks';

import { Format } from 'common';

import { Text } from '../input';
import MediaIcon from './MediaIcon';
import Selectable from '../structure/Selectable';
import { UploadItemData } from './MediaUploadForm';

interface Props {
	file: UploadItemData;
	ind: number;

	enabled: boolean;

	onNameChange: (name: string) => void;
	onFilenameChange: (name: string) => void;
}

export default function MediaUploadItem(props: Props) {
	const filenameRef = useRef<HTMLInputElement>(null);
	const identifier = props.file.name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

	const handleStopPropagation = (elem: any) =>
		elem?.addEventListener('mouseup', (evt: any) => evt.stopPropagation());

	const handleFilenameChange = () => {
		let elem = filenameRef.current!;

		let start = elem.selectionStart!;
		let end = elem.selectionEnd!;

		let oldVal = elem.value;
		elem.value = elem.value.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

		if (oldVal.length > elem.value.length) {
			start -= oldVal.length - elem.value.length;
			end -= oldVal.length - elem.value.length;
		}

		elem.setSelectionRange(start, end);
		props.onFilenameChange(elem.value);
	};

	return (
		<li class='flex !w-full gap-1 bg-neutral-50 dark:bg-neutral-700 p-[0.4375rem] rounded !overflow-visible'>
			<Selectable class='!p-0' ind={props.ind} doubleClickSelects={true}>
				<MediaIcon class='flex-shrink-0 w-20 h-20' path={props.file.file.name} image={props.file.thumbnail} />
			</Selectable>
			<div class='pl-1 text-left overflow-hidden'>
				<Text maxLength={32} enabled={props.enabled}
					class='font-medium  text-neutral-800 dark:text-neutral-100 truncate
						!py-0.5 !px-1 mt-0.5 -mb-0.5 !h-auto !bg-transparent !border-transparent focus:!border-neutral-400
						focus:!bg-neutral-100 dark:focus:!bg-neutral-800 hover:!border-neutral-300 dark:hover:!border-neutral-500'
					value={props.file.name} onValue={props.onNameChange} ref={handleStopPropagation}/>

				<Text maxLength={32} enabled={props.enabled} placeholder={identifier}
					class='relative font-medium text-sm text-neutral-600 dark:text-neutral-300 truncate
						!py-0.5 !px-1 -top-px -mb-0.5 !h-auto !bg-transparent !border-transparent focus:!border-neutral-400
						focus:!bg-neutral-100 dark:focus:!bg-neutral-800 hover:!border-neutral-300 dark:hover:!border-neutral-500'
					value={props.file.identifier} onValue={handleFilenameChange}
					ref={(elem) => {
						filenameRef.current = elem;
						handleStopPropagation(elem);
					}}
				/>
				<p class='relative font-medium text-sm text-neutral-500 dark:text-neutral-400 py-0.5 -top-px pl-1 truncate'>
					{Format.bytes(props.file.file.size)} • Last modified {Format.date(props.file.file.lastModified)}
				</p>
			</div>
		</li>
	);
}
