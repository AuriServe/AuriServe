import { Fragment, h } from 'preact';
import { useAsyncEffect } from 'vibin-hooks';
import { tw, executeQuery, AppContext, Form, Field, Icon, Svg, Button } from 'dashboard';
import { useContext, useLayoutEffect, useRef, useState } from 'preact/hooks';

// import Editor from './Editor';
import MonthView from './month/View';
import { CalendarEvent } from '../server/Database';
import ImportCalendarModal from './ImportCalendarModal';

export interface CategoryProps {
	name: string;
	color: string;

	enabled: boolean;
	onClick: () => void;
}

function Calendar(props: CategoryProps) {
	return (
		<button class={tw`flex gap-1 p-0.5 w-full items-center theme-${props.color}
			rounded transition duration-75 cursor-pointer group
			hocus:bg-gray-750 active:bg-gray-700`} onClick={props.onClick}>
			<div class={tw`w-7 h-7 relative`}>
				<div class={tw`inset-0 absolute rounded-full transition
					${props.enabled ? 'scale-[65%] bg-accent-400/25' : 'scale-50 bg-accent-400/50'}`}/>
				<div class={tw`inset-0 absolute rounded-full transition bg-gray-(800 group-hocus:750 group-active:!700)
					${props.enabled ? 'scale-[20%]' : 'scale-[32%]'}`}/>
				<div class={tw`inset-0 absolute rounded-full transition bg-accent-400
					${props.enabled ? 'scale-[38%] opacity-100' : 'scale-0 opacity-0'}`}/>
			</div>

			<p class={tw`font-medium text-sm transition duration-75 pt-px
				${props.enabled ? 'text-gray-50' : 'text-gray-300'}`}>{props.name}
			</p>
		</button>
	)
}

interface CalendarSpec {
	id: number;
	name: string;
	active: boolean;
}

const SCROLL_WEEK_INTERVAL = 3;
const BUFFER_WEEKS = 6;

export default function CalendarPage() {
	const app = useContext(AppContext);
	useLayoutEffect(() => (app.setHijackScrollbar(false), () => app.setHijackScrollbar(true)));

	const [ calendars, setCalendars ] = useState<Map<number, CalendarSpec>>(new Map());
	const [ events, setEvents ] = useState<CalendarEvent[]>([]);
	const [ editing, setEditing ] = useState<CalendarEvent | null>(null);

	const refreshAbortController = useRef<AbortController>(new AbortController());
	const lastQueriedDate = useRef<Date>(new Date());

	async function refreshEvents(date: Date, calendars: number[]) {
		if (calendars.length === 0) return;

		const from = Math.floor(+date) - 1000 * 60 * 60 * 24 * 7 * BUFFER_WEEKS;
		const to = Math.floor(+date) + 1000 * 60 * 60 * 24 * 7 * BUFFER_WEEKS * 2;

		refreshAbortController.current.abort();
		const controller = new AbortController();
		refreshAbortController.current = controller;

		const res = await fetch(`/api/calendar/events?from=${encodeURIComponent(from)}&to=${
			encodeURIComponent(to)}&calendars=${encodeURIComponent(calendars.join(','))}`, {
				signal: controller.signal,
				method: 'GET',
				cache: 'no-cache'
		});

		if (controller.signal.aborted) return;
		const json = await res.json();

		if (controller.signal.aborted) return;
		setEvents(json.events);
	}

	useAsyncEffect(async (abort) => {
		const res = (await executeQuery(`query { calendar { calendars } }`)).calendar.calendars as [ string, string ][];
		if (abort.aborted) return;
		setCalendars(new Map<number, CalendarSpec>(res.map(r => [ +r[0], { id: +r[0], name: r[1], active: true } ])));
		const date = new Date();
		lastQueriedDate.current = date;
		await refreshEvents(date, res.map(r => +r[0]));
	}, []);

	async function handleUpload(id: number, name: string) {
		setCalendars(new Map(calendars!.set(id, { id, name, active: true })));
		await refreshEvents(lastQueriedDate.current, [...calendars.values()].filter(c => c.active).map(c => c.id));
	}

	function handleScroll(_: number, date: Date) {
		const diff = Math.abs(+lastQueriedDate.current - +date);
		if (diff >= 1000 * 60 * 60 * 24 * 7 * SCROLL_WEEK_INTERVAL) {
			lastQueriedDate.current = date;
			refreshEvents(date, [...calendars.values()].filter(c => c.active).map(c => c.id));
		}
	}

	async function handleSetActive(id: number, active: boolean) {
		if (active === calendars.get(id)?.active ?? false) return;
		const newCal = new Map(calendars.set(id, { ...calendars.get(id)!, active }));
		setCalendars(newCal);
		if (active) await refreshEvents(lastQueriedDate.current, [...newCal.values()].filter(c => c.active).map(c => c.id));
		else setEvents(events.filter(e => e.cal !== id));
	}

	function handleStartEdit(eventOrDate: CalendarEvent | Date) {
		const event: CalendarEvent = (eventOrDate instanceof Date) ? {
			cal: calendars.values().next().value.id,
			uid: `${Date.now()}-${Math.random()}@cal.auriserve.com`,
			type: 'event-day',

			start: +eventOrDate,
			end: +eventOrDate,
			rrule: null,
			timezone: null,

			title: '',
			description: '',
			location: ''
		} : eventOrDate;

		setEditing(event);
	}

	// useEffect(() => {
	// 	executeQuery('{ calendars }').then(({ calendars }) => {
	// 		setCalendars(calendars);
	// 		setCalendarName(calendars[0][0]);
	// 	});
	// }, []);

	// useEffect(() => {
	// 	if (!calendarName) return;
	// 	executeQuery('query($name: String!) { calendar(name: $name) }', { name: calendarName })
	// 		.then(({ calendar }) => setCalendar(populateACAL(JSON.parse(calendar))));
	// }, [ calendarName ]);

	// function handleToggleCategory(uid: string) {
	// 	const newCalendar = { ...calendar } as PopulatedCalendar;
	// 	newCalendar.categories![uid].enabled = !newCalendar.categories![uid].enabled;
	// 	setCalendar(newCalendar);
	// }

	// function handleEditingChange(event: PopulatedEvent) {
	// 	const newCalendar = { ...calendar! };
	// 	console.log(calendar);
	// 	newCalendar.events[editing!.event.uid] = event;
	// 	console.log(newCalendar);
	// 	setCalendar(newCalendar);
	// 	setEditing({ ...editing!, event, changed: true });
	// }

	// function handleEditingRevert() {
	// 	const newCalendar = { ...calendar! };
	// 	if (editing?.isNew) delete newCalendar.events[editing!.event.uid];
	// 	else if (editing) newCalendar.events[editing!.event.uid] = editing!.initialEvent;
	// 	setCalendar(newCalendar);
	// 	setEditing(null);
	// }

	// function handleEditingDelete() {
	// 	const newCalendar = { ...calendar! };
	// 	delete newCalendar.events[editing!.event.uid];
	// 	setCalendar(newCalendar);
	// 	setEditing(null);
	// 	setDirty(true);
	// }

	// function handleEditingSave() {
	// 	setDirty(true);
	// 	setEditing(null);
	// }

	// function handleClickCell(date: Date) {
	// 	if (!editing) {
	// 		const end = new Date(date);
	// 		end.setHours(23, 59);

	// 		const event: PopulatedEvent = {
	// 			start: +date,
	// 			end: +end,
	// 			category: Object.keys(calendar!.categories)[0],
	// 			title: '',
	// 			description: '',
	// 			dates: [ +date ],
	// 			last: +end,
	// 			uid: `${Date.now()}-${Math.random()}`,
	// 		}

	// 		const newCalendar = { ...calendar! };
	// 		newCalendar.events[event.uid] = event;
	// 		setCalendar(newCalendar);
	// 		setEditing({ event: { ...event}, initialEvent: event, isNew: true, changed: false });
	// 	}
	// 	else if (!editing.changed) {
	// 		handleEditingRevert();
	// 	}
	// }

	// function handleClickEvent(event: PopulatedEvent) {
	// 	if (!editing?.changed) {
	// 		if (editing?.event?.uid !== event.uid) {
	// 			handleEditingRevert();
	// 			setEditing({ event: { ...event }, initialEvent: event, isNew: false, changed: false });
	// 		}
	// 		else {
	// 			handleEditingRevert();
	// 		}
	// 	}
	// }

	// function handleSave() {
	// 	if (!dirty || saving) return;

	// 	setSaving(true);

	// 	executeQuery('mutation($name: String!, $calendar: String!) { calendar(name: $name, calendar: $calendar) }',
	// 		{ name: calendarName, calendar: JSON.stringify(unpopulateACAL(calendar!)) }).then(res => {

	// 		if (!res.calendar) {
	// 			alert('Failed to save calendar.');
	// 			setSaving(false);
	// 		}
	// 		else {
	// 			setDirty(false);
	// 			setSaving(false);
	// 		}
	// 	});
	// }

	console.log(editing);

	return (
		<div
			class={tw`flex -mb-14 overflow-hidden`}
		>
			<div class={tw`${editing ? 'w-96' : 'w-80'} shrink-0 flex-(& col) relative z-10 bg-gray-800 shadow-md p-4
				transition-all duration-150 max-h-screen overflow-hidden`}>
				{editing ? <Fragment>
					<Form<CalendarEvent> value={editing} class={tw`flex-(& col) overflow-hidden h-full`}>
						<div class={tw`shrink-0 flex-(& col) -mt-1 shrink-0 pb-3`}>
							<div class={tw`flex items-center`}>
								<Svg src={Icon.widget_add} size={6} class={tw`-mt-0.5`}/>
								<h2 class={tw`text-xl leading-none font-medium ml-2 my-1.5`}>
									{editing.id != null ? 'Edit' : 'Add'} Event
								</h2>
							</div>
						</div>

						<div class={tw`flex-(& col) gap-6 overflow-y-auto overflow-x-hidden grow`}>
							<div class={tw`flex-(& col) gap-2`}>
								<Field.Text path='title' optional/>
								<div class={tw`grid-(& cols-5) gap-2`}>
									<Field.Option
										label='Calendar'
										class={tw`col-span-3`}
										options={new Map([ ...calendars.values() ].map(v => [ v.id, v.name ]))}
										disabled={calendars.size < 2}
										value={editing.cal! as any as string}
									/>

									<Field.Toggle
										label='Public'
										class={tw`col-span-2`}
										value={!(editing as any).hidden}
										onChange={value => setEditing({ ...editing, hidden: !value } as any)}
									/>
								</div>
							</div>

							<div class={tw`flex-(& col) gap-2`}>
								<div class={tw`flex gap-2 mb-1 items-center`}>
									<Svg src={Icon.clock} size={5}/>
									<p class={tw`text-gray-200 uppercase tracking-widest text-xs font-bold mt-0.5`}>Scheduling</p>
								</div>

								<div class={tw`grid-(& cols-2) gap-2`}>
									<Field.DateTime path='start' label='Start Date' class={tw`shrink-0 h-[52px]`}/>
									<Field.DateTime path='end' label='End Date' class={tw`shrink-0 h-[52px]`}/>
								</div>
								<Field.Toggle
									label='All Day'
									value={editing.type === 'event-day'}
									onChange={value => setEditing({ ...editing, type: value ? 'event-day' : 'event-timed' })}
								/>
							</div>

							<div class={tw`flex-(& col) gap-2`}>
								<div class={tw`flex gap-2 mb-1 items-center`}>
									<Svg src={Icon.file} size={5}/>
									<p class={tw`text-gray-200 uppercase tracking-widest text-xs font-bold mt-0.5`}>Details</p>
								</div>

								<Field.Text path='description' optional multiline/>
								<Field.Text path='location' optional/>
								<Field.Text value='' label='Attachments' disabled optional/>
							</div>
						</div>

						<div class={tw`shrink-0 flex-(& row-reverse) pt-4`}>
							<Button.Secondary icon={Icon.save} label='Save'/>
						</div>
					</Form>
				</Fragment> : <Fragment>
					<h2 class={tw`text-xs text-gray-300 tracking-widest font-bold mb-2 uppercase ml-2 mt-6 grow-0 shrink-0`}>
						Calendars
					</h2>
					<div class={tw`flex-(& col) gap-0.5 items-start grow`}>
						{[...(calendars?.entries() ?? [])].map(calendar =>
							<Calendar
								color='blue'
								enabled={calendar[1].active}
								name={calendar[1].name}
								onClick={() => handleSetActive(calendar[0], !calendar[1].active)}
								key={calendar[0]}
							/>
						)}
					</div>
				</Fragment>}
			</div>

			{calendars && <ImportCalendarModal
				calendars={new Map([...calendars.entries()].map(([ id, { name }]) => ([ id, name ])))}
				onUpload={handleUpload}
			/>}

			<div class={tw`grow flex-(& col) h-screen relative`}>
				<MonthView
					events={events}
					onScroll={handleScroll}
					onClickCell={(date) => handleStartEdit(date)}
					onClickEvent={(event) => handleStartEdit(event)}
				/>
				{/* <TransitionGroup
					duration={150}
					enterFrom={tw`opacity-0 scale-[98%] translate-y-4`}
					enter={tw`transition !duration-150`}
					invertExit>
					{editing &&
						<Editor
							key={editing.event.uid}
							{...editing}
							categories={new Map(Object.values(calendar!.categories).map(category => [ category.uid, category.name ]))}
							onChange={handleEditingChange}
							onRevert={handleEditingRevert}
							onDelete={handleEditingDelete}
							onSave={handleEditingSave}
						/>
					}
				</TransitionGroup> */}
			</div>
		</div>
	);
}
