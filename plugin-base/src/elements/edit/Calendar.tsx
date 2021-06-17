import * as Preact from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { AdminDefinition, Color } from 'auriserve-api';
import { TransitionGroup, CSSTransition } from 'preact-transitioning';
import { Input, Modal, DimensionTransition } from 'as-editor/components';

import './Calendar.sss';

import EditableImageList from './components/EditableImageList';

import { server } from '../CalendarServer';
import { CalendarProps, Event, Category,
	CalendarHeader, CalendarDayBar, CalendarPage,
	useCalendarNavigation, assignEventIndices } from '../Calendar';

interface EventProps {
	event: Event;
	categories: { [key: string]: Category };

	onClose: () => void;
	onSave: (event: Event) => void;
	onDelete: (event: Event) => void;
}

function daysDifferent(a: Date, b: Date): number {
	const aa = new Date();
	aa.setFullYear(a.getFullYear(), a.getMonth(), a.getDate());
	const bb = new Date();
	bb.setFullYear(b.getFullYear(), b.getMonth(), b.getDate());
	return Math.floor((bb.getTime() - aa.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Renders an editable calendar event popup.
 */

export function CalendarEvent(props: EventProps) {
	const [ event, setEvent ] = useState<Event>(props.event);
	const [ editingMedia, setEditingMedia ] = useState<boolean>(false);
	
	const categoriesMap = useMemo(() => {
		let map: { [key: string]: string } = {};
		Object.keys(props.categories).forEach(c => map[c] = props.categories[c].name);
		return map;
	}, [ props.categories ]);

	const handleSetStartDate = (date: Date) => {
		if (event.endDate) {
			// Shift endDate
			const daysDiff = daysDifferent(new Date(event.startDate), date);
			const newEnd = new Date(event.endDate);
			newEnd.setDate(newEnd.getDate() + daysDiff);
			setEvent({ ...event, startDate: +date, endDate: +newEnd });
		} else {
			setEvent({ ...event, startDate: +date });
		}
	};

	const handleSetEndDate = (date: Date) => {
		if (+date === +event.startDate)
			setEvent({ ...event, endDate: undefined });
		else setEvent({ ...event, endDate: +date });
	};

	return (
		<Preact.Fragment>
			<Modal active={true} onClose={props.onClose}>
				<DimensionTransition mode='height' duration={150}>
					<div class="Calendar-EditEvent">
						<h4 class="Calendar-EditEventHeader">{props.event.ind === -1 ? 'New Event' : 'Editing ' + props.event.name}</h4>

						<div class='Calendar-EditEventTitleWrap'>
							<Input.Label label='Title'>
								<Input.Text placeholder='My Event' value={event.name}
									setValue={(title: string) => setEvent({ ...event, name: title })}/>
							</Input.Label>

							<Input.Label label='Category'>
								<Input.Select value={event.category} options={categoriesMap}
									setValue={(category: string) => setEvent({ ...event, category: category, color: undefined })}/>
							</Input.Label>

							<Input.Label label='Color'>
								<Input.Color full={true} value={event.color ?? props.categories[event.category].color}
									setValue={(color: Color.HSV) => setEvent({ ...event, color: color })}/>
							</Input.Label>
						</div>

						<div class='Calendar-EditEventDateWrap'>
							<Input.Label label='Start Date'>
								<Input.DateTime value={new Date(event.startDate)}
									setValue={handleSetStartDate}/>
							</Input.Label>

							<Input.Label class={event.endDate ? '' : 'Calendar-InputInvisible'} label='End Date'>
								<Input.DateTime value={new Date(event.endDate ?? event.startDate)}
									setValue={handleSetEndDate}/>
							</Input.Label>
						</div>

						<Input.Label label='Date TDB?'>
							<Input.Checkbox alignRight={true} value={event.hideDate}
								setValue={(hideDate: boolean) => setEvent({ ...event, hideDate })}/>
						</Input.Label>

						<Input.Label label='Description'>
							<Input.Text placeholder='Lorem ipsum dolor sit amet...'
								long={true} maxHeight={Infinity} value={event.description}
								setValue={(description: string) => setEvent({ ...event, description })}/>
						</Input.Label>

						{event.media?.length && <Input.Label label='Image Attachment'>
							<Input.Select value={event.mediaAttachment}
								setValue={(mediaAttachment: any) => setEvent({ ...event, mediaAttachment })}
								options={{'top': 'Top', 'center': 'Middle', 'bottom': 'Bottom'}}/>
						</Input.Label>}

						<div class='Calendar-EditEventActionWrap'>
							<button onClick={() => props.onSave(event)}>Save</button>
							{event.ind !== -1 && <button onClick={() => props.onClose()}>Undo</button>}
							<button onClick={() => props.onDelete(event)}>{event.ind === -1 ? 'Cancel' : 'Delete Event'}</button>
							<button onClick={() => setEditingMedia(true)}>
								Manage Images {event.media && `(${(event.media ?? []).length})`}</button>
						</div>
					</div>
				</DimensionTransition>
			</Modal>
			<Modal active={editingMedia} defaultAnimation={true} onClose={() => setEditingMedia(false)}>
				<EditableImageList items={event.media as any[] ?? []} onClose={() => setEditingMedia(false)}
					setItems={(media) => setEvent({ ...event, media: media })} />
			</Modal>
		</Preact.Fragment>
	);
}

/**
 * Renders the editable calendar.
 */

export function EditCalendar(props: CalendarProps & { setProps: (props: any) => void }) {
	const [ month, year, navigate ] = useCalendarNavigation();
	const events = useMemo(() => assignEventIndices(props.events), [ props.events ]);

	const [ hovered, setHovered ] = useState<number | undefined>(undefined);
	const [ selected, setSelected ] = useState<number | undefined>(undefined);
	const [ editing, setEditing ] = useState<Event | undefined>(undefined);

	const handleSave = (event: Event) => {
		if (event.endDate && event.endDate < event.startDate) delete event.endDate;
		let newEvents = [ ...events ];
		newEvents[event.ind === -1 ? newEvents.length : event.ind] = event;
		newEvents = newEvents.map(evt => Object.assign({}, evt, { ind: undefined })).sort((a: Event, b: Event) => {
			return a.startDate - b.startDate;
		});

		props.setProps({ ...props, events: newEvents });
		setSelected(undefined);
		setEditing(undefined);
	};

	const handleAddEvent = () => {
		setSelected(-1);
		setEditing({
			name: '',
			description: '',
			category: Object.keys(props.categories)[0],
			startDate: Date.now(),
			hideDate: false,
			ind: -1
		});
	};

	const handleDeleteEvent = (event: Event) => {
		if (event.ind !== -1) {
			let newEvents = [ ...events ];
			newEvents.splice(event.ind, 1);
			props.setProps({ ...props, events: newEvents });
		}
		setSelected(undefined);
	};

	return (
		<div class='Calendar EditCalendar'>
			<CalendarHeader month={month} year={year} onNavigate={navigate} disabled={selected !== undefined} />
			<div class='Calendar-Body'>
				<CalendarDayBar />
				<div class='Calendar-PageWrap'>
					<TransitionGroup duration={300}>
						<CSSTransition key={month} classNames='Animate'>
							<CalendarPage
								month={month}
								year={year}
								events={events}
								categories={props.categories}

								hovered={hovered}
								showHidden={true}
								
								onHover={setHovered}
								onClick={setSelected}
							/>
						</CSSTransition>
					</TransitionGroup>
				</div>
				<div class='Calendar-ActionBar'>
					<button onClick={handleAddEvent}>Add Event</button>
				</div>
				{(selected !== undefined) && <CalendarEvent
					event={selected === -1 ? editing! : events[selected]}
					categories={props.categories}
					onClose={() => setSelected(undefined)}
					onDelete={handleDeleteEvent}
					onSave={handleSave} />}
			</div>
		</div>
	);
}

export const admin: AdminDefinition = {
	...server,

	element: EditCalendar,
	editing: {
		propertyEditor: false,
		inlineEditor: EditCalendar
	}
};

