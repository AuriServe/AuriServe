import { h } from 'preact';
import { formatBytes } from 'common';
import { tw, Svg, Icon, Button, Card, Transition } from 'dashboard';
import { useState, useRef, useEffect, useCallback, StateUpdater } from 'preact/hooks';

export interface Attachment {
	name: string;
	size: number;
	filename: string;

	handle?: File;
}

interface Props {
	onClose: () => void;

	attachments: Attachment[];
	setAttachments: StateUpdater<Attachment[]>;
}

export default function EventFileManager(props: Props) {
	const [ dragging, setDragging ] = useState<boolean>(false);

	const fileUploadRef = useRef<HTMLInputElement>(null);
	const dragTargetRef = useRef<HTMLDivElement>(null);

	function handleDeleteFile(ind: number) {
		props.setAttachments(props.attachments.filter((_, i) => i !== ind));
	}

	function handleTitleChange(ind: number, value: string) {
		const newAttachments = [ ...props.attachments ];
		newAttachments[ind].name = value;
		props.setAttachments(newAttachments);
	}

	function handleFileInput() {
		props.setAttachments(attachments => {
			const newAttachments = [ ...attachments ];
			for (const handle of Array.from(fileUploadRef.current?.files ?? [])) {
				const name = handle.name;
				const size = handle.size;
				const filename = handle.name;

				newAttachments.unshift({ name, size, filename, handle });
			}
			return newAttachments;
		});
	}

	const handleDragEnter = useCallback((evt: DragEvent) => {
		let isInTarget = false;
		let elem = evt.target as HTMLElement;
		evt.preventDefault();
		evt.stopPropagation();

		while (elem.parentElement) {
			if (elem === dragTargetRef.current) { isInTarget = true; break; }
			elem = elem.parentElement;
		}

		setDragging((dragging) => {
			if (!dragging && isInTarget) {
				console.log('in');
				return true;
			}
			else if (dragging && !isInTarget) {
				console.log('out');
				return false;
			}
			return dragging;
		});
	}, []);

	const handleDrop = useCallback((evt: DragEvent) => {
		evt.preventDefault();
		evt.stopPropagation();
		setDragging(false);

		props.setAttachments(attachments => {
			const newAttachments = [ ...attachments ];
			for (const handle of Array.from(evt.dataTransfer?.files ?? [])) {
				const name = handle.name;
				const size = handle.size;
				const filename = handle.name;

				newAttachments.unshift({ name, size, filename, handle });
			}
			return newAttachments;
		});
	}, [ props.setAttachments ]); // eslint-disable-line react-hooks/exhaustive-deps


	useEffect(() => {
		const handleDragOver = (evt: DragEvent) => evt.preventDefault();

		document.body.addEventListener('drop', handleDrop);
		document.body.addEventListener('dragover', handleDragOver);
		document.body.addEventListener('dragenter', handleDragEnter);
		return () => {
			document.body.removeEventListener('drop', handleDrop);
			document.body.removeEventListener('dragover', handleDragOver);
			document.body.removeEventListener('dragenter', handleDragEnter);
		}
	}, [ handleDragEnter, handleDrop ]);

	return (
		<Card class={tw`w-screen max-w-4xl`}>
			<Card.Header
				icon={Icon.attach}
				title='Attach files'
				subtitle='Image attachments will be displayed in the event header.'>

				<Button.Secondary small icon={Icon.upload} label='Add Attachment'
					onClick={() => fileUploadRef.current?.click()} class={tw`absolute bottom-4 right-4`}/>
			</Card.Header>
			<Card.Body class={tw`p-0 relative`}>
				<div class={tw`p-4 pr-px`} ref={dragTargetRef}>
					<div class={tw`overflow-y-scroll h-[430px] pr-px
						scroll-(gutter-gray-800 bar-gray-600 bar-hover-gray-500)`}>
						<div class={tw`grid grid-cols-[repeat(auto-fill,minmax(240px,auto))] auto-rows-fr gap-3`}>
							{props.attachments.map((attachments, i) =>
								<div key={attachments.filename} class={tw`h-auto rounded h-20 flex-(& col) p-3 group relative transition
									bg-gray-(input hover:700 focus-within:700) hover:shadow focus-within:shadow`}>
									<Button.Tertiary small icon={Icon.trash} label='Delete' iconOnly
										class={tw`absolute top-1.5 right-1.5 shadow-(!md black/30) !opacity-(0 group-hover:100 focus:100)`}
										onClick={() => handleDeleteFile(i)}/>
									<div class={tw`aspect-[2/1] rounded shrink-0 bg-accent-700/30 grid place-content-center mb-2`}>
										<Svg src={Icon.file} size={6} class={tw`icon-p-white icon-s-accent-300 bg-accent-400/20
											rounded-full p-3`}/>
									</div>
									<input class={tw`text-gray-100 font-medium bg-transparent outline-none -mx-1 px-1 py-0.5
										transition duration-75 rounded-sm focus:(bg-gray-800) placeholder:text-gray-300`}
										placeholder='Untitled'
										value={attachments.name} onInput={(evt: any) => handleTitleChange(i, evt.target.value)}/>
									<p class={tw`text-gray-200 text-sm`}>
										{attachments.filename} &nbsp;•&nbsp; {formatBytes(attachments.size)}</p>
								</div>
							)}
						</div>
					</div>
					{!props.attachments.length && <div class={tw`absolute inset-0 interact-none grid place-content-center`}>
						<p class={tw`text-gray-100 text-center font-medium`}>No Attachments</p>
						<p class={tw`text-gray-300 text-center`}>Drag and drop files here to attach them.</p>
					</div>}
					<Transition
						as='div'
						show={dragging}
						duration={150}
						invertExit
						enterFrom={tw`scale-[98%] opacity-0`}
						class={tw`absolute inset-4 bg-accent-900/80 rounded interact-none
							transition duration-150 grid place-content-center`}>
						<p class={tw`text-accent-300 font-medium text-lg`}>Drag files here to upload.</p>
					</Transition>
				</div>
			</Card.Body>
			<input type='file' multiple class={tw`sr-only`} ref={fileUploadRef} onChange={handleFileInput}/>
		</Card>
	)
}
