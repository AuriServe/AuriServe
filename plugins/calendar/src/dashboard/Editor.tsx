import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { tw, Svg, Icon, Form, Field, Button, Modal, Card } from 'dashboard';

import { PopulatedEvent } from '../common/Calendar';
import EventFileManager, { Attachment } from './EventFileManager';

interface Props {
	event: PopulatedEvent;
	initialEvent: PopulatedEvent;
	isNew: boolean;
	changed: boolean;

	categories?: Map<string, string>;

	onChange: (event: PopulatedEvent) => void;
	onRevert: () => void;
	onDelete: () => void;
	onSave: () => void;

	class?: string;
}

// interface File {
// 	name: string;
// 	filename: string;
// 	handle?: File
// }

export default function EditEvent(props: Props) {
	const [ expanded, setExpanded ] = useState<boolean>(false);

	const [ attachments, setAttachments ] = useState<Attachment[]>([]);

	const categories = props.categories ?? new Map();

	const [ confirmClose, setConfirmClose ] = useState<'revert' | 'delete' | null>(null);
	const [ attachFiles, setAttachFiles ] = useState<boolean>(false);

	const { onRevert, onDelete, onSave, isNew } = props;

	const handleSubmit = useCallback(() => {
		onSave();
	}, [ onSave ]);

	const handleConfirmClose = useCallback((reason: 'revert' | 'delete') => {
		(confirmClose ?? reason) === 'delete' ? onDelete() : onRevert();
		setConfirmClose(null);
	}, [ confirmClose, onDelete, onRevert ]);

	const handleClose = useCallback((reason: 'revert' | 'delete') => {
		if (!props.changed && reason !== 'delete') handleConfirmClose(reason);
		else setConfirmClose(reason);
	}, [ props.changed, handleConfirmClose ]);

	function handleChange(event: Partial<PopulatedEvent>) {
		event.dates = [ event.start! ];
		event.last = event.end;

		const lastEvent = props.event;
		if (event.title !== lastEvent.title || event.description !== lastEvent.description ||
			event.end !== lastEvent.end || event.start !== lastEvent.start || event.category !== lastEvent.category) {
			props.onChange(event as PopulatedEvent);
		}
	}

	useEffect(() => {
		if (confirmClose) return;

		function handleKeyPress(evt: KeyboardEvent) {
			if (evt.key === 'Escape') {
				handleClose('revert');
				evt.preventDefault();
			}
			else if (evt.key === 'Delete') {
				handleClose(isNew ? 'revert' : 'delete');
				evt.preventDefault();
			}
		}

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [ handleClose, confirmClose, isNew ]);

	// function handleStartChange(_date: Date | number | null) {
	// 	/* I'd love to change the end date proportionally here but I can't because the DateTime input isn't getting the update. I need to convert these components into like svelte or something. */

	// 	// if (date == null || typeof date !== 'number') return;
	// 	// const diff = event.end - event.start;
	// 	// const newEvent = { ...event, start: date, end: date + diff };
	// 	// console.log(newEvent.end > newEvent.start);
	// 	// setEvent(newEvent);
	// }

	return (
		<Form<PopulatedEvent & { imageAlignment: 'top' | 'center' | 'bottom' }>
			class={tw`absolute flex left-0 right-0 mx-auto px-2 w-full bottom-2 interact-none transition-all
				${expanded ? 'max-w-full duration-150' : 'max-w-3xl duration-300'} ${props.class}`}
			initialValue={{ ...props.event, imageAlignment: 'top' }}
			onChange={handleChange as any}
			onSubmit={handleSubmit}>
			<Card class={tw`flex flex-col w-full interact-auto !shadow-xl !shadow-gray-900
				transition-all overflow-hidden w-full
				${expanded ? 'h-[36.5rem] duration-300' : 'h-[22.2rem] duration-150'}`}>
				<Card.Header icon={Icon.calendar} title={`${props.isNew ? 'New' : 'Edit'} Event`}>
					<div class={tw`flex flex-row-reverse gap-2 absolute top-4 mt-0.5 right-4`}>
						<Button.Tertiary small icon={Icon.close} iconOnly label={props.changed ? 'Cancel' : 'Close'}
							onClick={() => handleClose('revert')}/>
						<Button.Tertiary small icon={Icon.external} iconOnly label='Expand'
							onClick={() => setExpanded(!expanded)}/>
						<div class={tw`w-0.5 bg-gray-500`}/>
						{(props.changed || props.isNew)
							? <Button.Secondary key='save' type='submit' small icon={Icon.save} iconOnly label='Save'/>
							: <Button.Tertiary key='save' type='submit' small icon={Icon.save} iconOnly label='Save'/>}
						{!props.isNew && <Button.Tertiary small icon={Icon.trash} iconOnly label='Delete'
							onClick={() => handleClose('delete')}/>}
					</div>
				</Card.Header>
				<Card.Body class={tw`grow`}>
					<div class={tw`flex gap-4 ml-1.5 h-full`}>
						<div class={tw`grow flex-(& col) h-full gap-3`}>
							<div class={tw`shrink-0 flex gap-3`}>
								<Svg src={Icon.info} size={6} class={tw`shrink-0 py-2`}/>
								<Field.Text optional path='title' placeholderLabel autofocus class={tw`max-w-lg`}/>
							</div>

							<div class={tw`shrink-0 flex gap-3`}>
								<Svg src={Icon.clock} size={6} class={tw`shrink-0 py-2`}/>
								<div class={tw`flex grow gap-3 max-w-lg`}>
									<Field.DateTime path='start' placeholderLabel defaultTime='start'/>
									<Field.DateTime path='end' placeholderLabel defaultTime='end' minValue={props.event.start}/>
								</div>
							</div>

							<div class={tw`grow flex gap-3 items-stretch`}>
								<Svg src={Icon.file} size={6} class={tw`shrink-0 py-2`}/>
								<div class={tw`grow bg-gray-input flex rounded overflow-hidden`}>
									<Field.Text path='description' optional placeholderLabel multiline
										minRows={expanded ? 15 : 5} maxRows={expanded ? 15 : 5} class={tw`!h-auto grow`}/>
								</div>
							</div>
						</div>

						<div class={tw`shrink-0 w-64 flex-(& col) gap-3`}>
							<div class={tw`flex gap-3`}>
								<Svg src={Icon.tag} size={6} class={tw`shrink-0 py-2`}/>
								<Field.Option path='category' hideLabel options={categories}/>
							</div>

							<div class={tw`flex-(& col) grow gap-3`}>
								<div class={tw`flex gap-3 grow`}>
									<Svg src={Icon.attach} size={6} class={tw`shrink-0 py-2`}/>

									<div class={tw`bg-gray-input w-full grow rounded`}>
										<p class={tw`text-gray-300 p-2.5`}>Drag images or attachments here.</p>
									</div>
								</div>

								<div class={tw`flex gap-3`}>
									<Svg src={Icon.sort} size={6} class={tw`shrink-0 py-2`}/>

									<Field.Option above path='imageAlignment' hideLabel options={new Map([ [ 'top', 'Top'], [ 'center', 'Center' ], [ 'bottom', 'Bottom' ]])}/>
								</div>
							</div>


								{/* <button type='button' onClick={() => setAttachFiles(true)} class={tw`
									h-10 rounded bg-gray-input p-2.5 pt-[9px] w-full text-left hocus:bg-gray-700
									focus:(ring-(& gray-600 offset-2 offset-gray-800)) active:(ring-(& gray-600 offset-2 offset-gray-800))
									transition`}>
									{attachments.length
										? <span class={tw`text-gray-100`}>{attachments.length} file{attachments.length !== 1 ? 's' : ''} attached.</span>
										: <span class={tw`text-gray-300`}>Attach files...</span>}
								</button> */}
						</div>
					</div>

					<Modal active={attachFiles} onClose={() => setAttachFiles(false)}>
						<EventFileManager
							onClose={() => setAttachFiles(false)}
							attachments={attachments}
							setAttachments={setAttachments}/>
					</Modal>


					{/* Delete Event Modal */}
					<Modal active={confirmClose === 'delete'} onClose={() => setConfirmClose(null)}>
						<Card>
							<Card.Body class={tw`flex gap-6 p-6`}>
								<Svg src={Icon.trash} size={8}
									class={tw`bg-gray-700 rounded p-2 shrink-0 icon-p-gray-200 icon-s-gray-500`}/>
								<div>
									<p class={tw`text-lg font-medium text-gray-100`}>Delete Event</p>

									<p class={tw`text-gray-200`}>
										Are you sure that you want to delete this event?
									</p>
								</div>
							</Card.Body>
							<div class={tw`px-6 py-4 bg-gray-750 flex flex-row-reverse justify-start gap-3 rounded-b-lg theme-red`}>
								<Button.Secondary icon={Icon.trash} label='Delete' onClick={handleConfirmClose}/>
								<Button.Tertiary icon={Icon.close} label='Cancel' onClick={() => setConfirmClose(null)}/>
							</div>
						</Card>
					</Modal>

					{/* Discard Changes Modal */}
					<Modal active={confirmClose === 'revert'} onClose={() => setConfirmClose(null)}>
						<Card>
							<Card.Body class={tw`flex gap-6 p-6`}>
								<Svg src={Icon.trash} size={8}
									class={tw`bg-gray-700 rounded p-2 shrink-0 icon-p-gray-200 icon-s-gray-500`}/>
								<div>
									<p class={tw`text-lg font-medium text-gray-100`}>Discard Changes</p>

									<p class={tw`text-gray-200`}>
										Are you sure that you want to discard your changes?
									</p>
								</div>
							</Card.Body>
							<div class={tw`px-6 py-4 bg-gray-750 flex flex-row-reverse justify-start gap-3 rounded-b-lg theme-red`}>
								<Button.Secondary icon={Icon.trash} label='Discard' onClick={handleConfirmClose}/>
								<Button.Tertiary icon={Icon.close} label='Cancel' onClick={() => setConfirmClose(null)}/>
							</div>
						</Card>
					</Modal>
				</Card.Body>
			</Card>
		</Form>
	)
}
