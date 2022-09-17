import { h } from 'preact';
import { useLayoutEffect, useState } from 'preact/hooks';
import { tw, Svg, Icon, Form, Field, Button, Modal, Card } from 'dashboard';

import { populateEvent } from './PopulateCalendar';
import { PopulatedEvent, Event } from '../common/Calendar';
import EventFileManager, { Attachment } from './EventFileManager';

interface Props {
	new: boolean;
	event?: Partial<PopulatedEvent>;
	categories?: Map<string, string>;

	onClose: () => void;
	onSave: (event: PopulatedEvent) => void;
}

function createEvent(): Partial<PopulatedEvent> {
	const now = new Date();
	const start = +new Date(now.getFullYear(), now.getMonth(), now.getDate());
	// const end = +new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);

	return {
		uid: `${Date.now()}-${Math.random()}`,
		start,

		title: '',
		description: undefined,
		category: '0',
	}
}

// interface File {
// 	name: string;
// 	filename: string;
// 	handle?: File
// }

export default function EditEvent(props: Props) {
	const [ event, setEvent ] = useState<Partial<PopulatedEvent>>({ ...createEvent(), ...(props.event ?? {}) });
	useLayoutEffect(() => setEvent({ ...createEvent(), ...(props.event ?? {}) }), [ props.event ]);

	const [ attachments, setAttachments ] = useState<Attachment[]>([]);

	const categories = props.categories ?? new Map();

	const [ confirmDelete, setConfirmDelete ] = useState<boolean>(false);
	const [ attachFiles, setAttachFiles ] = useState<boolean>(true);

	function handleSubmit() {
		props.onSave(populateEvent(event as Event));
	}

	function handleDelete() {
		props.onClose();
	}

	function handleStartChange(_date: Date | number | null) {
		/* I'd love to change the end date proportionally here but I can't because the DateTime input isn't getting the update. I need to convert these components into like svelte or something. */

		// if (date == null || typeof date !== 'number') return;
		// const diff = event.end - event.start;
		// const newEvent = { ...event, start: date, end: date + diff };
		// console.log(newEvent.end > newEvent.start);
		// setEvent(newEvent);
	}

	return (
		<Form
			value={event}
			onChange={(event) => setEvent(event as Event)}
			onSubmit={handleSubmit}
			class={tw`flex-(& col) gap-3`}>
			<div class={tw`flex items-center mb-2`}>
				<Svg src={Icon.calendar} size={6} class={tw`px-1 py-2`}/>
				<h2 class={tw`text-xl leading-none font-medium ml-2`}>{props.new ? 'Add' : 'Edit'} Event</h2>
			</div>

			<div class={tw`flex gap-2`}>
				<Svg src={Icon.info} size={6} class={tw`shrink-0 px-1 py-2`}/>
				<Field.Text path='title' placeholderLabel/>
			</div>

			<div class={tw`flex gap-2`}>
				<Svg src={''} size={6} class={tw`shrink-0 px-1 py-2`}/>
				<Field.Text path='description' optional placeholderLabel multiline minRows={2} maxRows={15}/>
			</div>

			<div class={tw`flex gap-3`}>
				<Svg src={Icon.clock} size={6} class={tw`shrink-0 px-1 py-2 -mr-1`}/>
				<Field.DateTime path='start' placeholderLabel defaultTime='start' onChange={handleStartChange}/>
				<Field.DateTime path='end' placeholderLabel defaultTime='end' minValue={event.start}/>
			</div>

			<div class={tw`flex gap-2`}>
				<Svg src={Icon.tag} size={6} class={tw`shrink-0 px-1 py-2`}/>
				<Field.Option path='category' hideLabel options={categories}/>
			</div>

			<div class={tw`flex gap-2`}>
				<Svg src={Icon.attach} size={6} class={tw`shrink-0 px-1 py-2`}/>
				<button type='button' onClick={() => setAttachFiles(true)} class={tw`
					h-10 rounded bg-gray-input p-2.5 pt-[9px] w-full text-left hocus:bg-gray-700
					focus:(ring-(& gray-600 offset-2 offset-gray-800)) active:(ring-(& gray-600 offset-2 offset-gray-800))
					transition`}>
					{attachments.length
						? <span class={tw`text-gray-100`}>{attachments.length} file{attachments.length !== 1 ? 's' : ''} attached.</span>
						: <span class={tw`text-gray-300`}>Attach files...</span>}
				</button>
			</div>

			<div class={tw`flex gap-3 ml-10`}>
				<Button.Secondary size={9} type='submit' icon={Icon.save} label='Save'/>
				{props.new
					? <Button.Tertiary size={9} icon={Icon.close} label='Cancel' onClick={props.onClose}/>
					: <Button.Tertiary size={9} icon={Icon.trash} label='Delete' onClick={() => setConfirmDelete(true)}/>}
			</div>

			<Modal active={attachFiles} onClose={() => setAttachFiles(false)}>
				<EventFileManager
					onClose={() => setAttachFiles(false)}
					attachments={attachments}
					setAttachments={setAttachments}/>
			</Modal>

			<Modal active={confirmDelete}>
				<Card>
					<Card.Body class={tw`flex gap-6 p-6`}>
						<Svg src={Icon.trash} size={8}
							class={tw`bg-gray-700 rounded p-2 shrink-0 icon-p-gray-200 icon-s-gray-500`}/>
						<div>
							<p class={tw`text-lg font-medium text-gray-100`}>Delete Event</p>

							<p class={tw`text-gray-200`}>
								Are you sure that you want to delete this event?<br/>
								This action cannot be undone.
							</p>
						</div>
					</Card.Body>
					<div class={tw`px-6 py-4 bg-gray-750 flex flex-row-reverse justify-start gap-3 rounded-b-lg theme-red`}>
						<Button.Secondary icon={Icon.trash} label='Delete' onClick={handleDelete}/>
						<Button.Tertiary icon={Icon.close} label='Cancel' onClick={() => setConfirmDelete(false)}/>
					</div>
				</Card>
			</Modal>
		</Form>
	)
}
