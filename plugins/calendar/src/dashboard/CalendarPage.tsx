import { h } from 'preact';
import { tw, executeQuery, AppContext, Form, Field, TransitionGroup } from 'dashboard';
import { useContext, useEffect, useLayoutEffect, useState } from 'preact/hooks';

import { populateACAL } from './PopulateCalendar';
import { PopulatedCalendar, PopulatedEvent } from '../common/Calendar';

import Editor from './Editor';
import MonthView from './month/View';

export interface CategoryProps {
	name: string;
	color: string;

	enabled: boolean;
	toggle: () => void;
}

export interface EditingState {
	event: PopulatedEvent;
	initialEvent: PopulatedEvent;
	isNew: boolean;
	changed: boolean;
}

function Category(props: CategoryProps) {
	return (
		<button class={tw`flex gap-2 w-full items-center theme-${props.color}
			rounded transition duration-75 cursor-pointer group
			hocus:bg-gray-750 active:bg-gray-700`} onClick={props.toggle}>
			<div class={tw`w-8 h-8 p-1.5 relative`}>
				<div class={tw`w-full h-full rounded-full transition duration-75
					border-(2 ${props.enabled ? 'accent-500' : 'gray-200'})`}/>
				<div class={tw`absolute inset-0 rounded-full transition duration-75
					${props.enabled ? 'scale-[32%]' : 'scale-0'}
					bg-${props.enabled ? 'accent-500' : 'gray-200'}`}/>
			</div>
			<p class={tw`font-medium text-sm transition duration-75
				${props.enabled ? 'text-gray-50' : 'text-gray-300'}`}>{props.name}
			</p>
		</button>
	)
}

export default function CalendarPage() {
	const app = useContext(AppContext);
	useLayoutEffect(() => (app.setHijackScrollbar(false), () => app.setHijackScrollbar(true)));

	const [ calendars, setCalendars ] = useState<[string, string][]>([]);
	const [ calendarName, setCalendarName ] = useState<string | null>(null);

	const [ calendar, setCalendar ] = useState<PopulatedCalendar | null>(null);
	const [ editing, setEditing ] = useState<EditingState | null>(null);
	const [ saved, setSaved ] = useState<boolean>(false);

	useEffect(() => {
		executeQuery('{ calendars }').then(({ calendars }) => {
			setCalendars(calendars);
			setCalendarName(calendars[0][0]);
		});
	}, []);

	useEffect(() => {
		if (!calendarName) return;
		executeQuery('query($name: String!) { calendar(name: $name) }', { name: calendarName })
			.then(({ calendar }) => setCalendar(populateACAL(JSON.parse(calendar))));
	}, [ calendarName ]);

	useEffect(() => {
		if (!calendar) return;

		const date = new Date();
		date.setHours(0, 0, 0, 0);
		handleClickCell(date);

	// eslint-disable-next-line
	}, [ calendar !== null ]);

	function handleToggleCategory(uid: string) {
		const newCalendar = { ...calendar } as PopulatedCalendar;
		newCalendar.categories![uid].enabled = !newCalendar.categories![uid].enabled;
		setCalendar(newCalendar);
	}

	function handleEditingChange(event: PopulatedEvent) {
		const newCalendar = { ...calendar! };
		newCalendar.events[editing!.event.uid] = event;
		setCalendar(newCalendar);
		setEditing({ ...editing!, event, changed: true });
	}

	function handleEditingRevert() {
		const newCalendar = { ...calendar! };
		if (editing!.isNew) delete newCalendar.events[editing!.event.uid];
		else newCalendar.events[editing!.event.uid] = editing!.initialEvent;
		setCalendar(newCalendar);
		setEditing(null);
	}

	function handleEditingDelete() {
		const newCalendar = { ...calendar! };
		delete newCalendar.events[editing!.event.uid];
		setCalendar(newCalendar);
		setEditing(null);
	}

	function handleEditingSave() {
		setEditing(null);
	}

	// function handleSaveEditor(event: PopulatedEvent) {
	// 	const newCalendar = { ...calendar } as PopulatedCalendar;
	// 	newCalendar.events![event.uid] = event as PopulatedEvent;
	// 	setCalendar(newCalendar);
	// 	setEditing(null);
	// }

	// function handleCloseEditor() {
	// 	if (!editingNew) {
	// 		const newCalendar = { ...calendar } as PopulatedCalendar;
	// 		delete newCalendar.events![(editing as PopulatedEvent).uid];
	// 		setCalendar(newCalendar);
	// 	}
	// 	setEditing(null);
	// }

	function handleClickCell(date: Date) {
		console.log(editing);
		if (!editing) {
			const end = new Date(date);
			end.setHours(23, 59);

			const event: PopulatedEvent = {
				start: +date,
				end: +end,
				category: Object.keys(calendar!.categories)[0],
				title: '',
				description: '',
				dates: [ +date ],
				last: +end,
				uid: `${Date.now()}-${Math.random()}`,
			}

			const newCalendar = { ...calendar! };
			newCalendar.events[event.uid] = event;
			setCalendar(newCalendar);
			setEditing({ event: { ...event}, initialEvent: event, isNew: true, changed: false });
		}
		else if (!editing.changed) {
			handleEditingRevert();
		}
	}

	function handleClickEvent(event: PopulatedEvent) {
		if (editing?.changed) return;
		if (event.uid === editing?.event?.uid) return;
		if (editing) handleEditingRevert();

		setEditing({ event: { ...event }, initialEvent: event, isNew: false, changed: false });
	}

	return (
		<div class={tw`flex -mb-14`}>
			<div class={tw`grow flex-(& col) pb-1 relative`}>
				{calendar && <MonthView
					calendar={calendar}
					saved={saved}
					onSave={() => setSaved(true)}
					// activeEvent={((editing && editing.uid) ?? undefined) as string | undefined}

					// onStartAdd={)}
					onClickCell={handleClickCell}
					onClickEvent={handleClickEvent}
				/>}
				<TransitionGroup
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
				</TransitionGroup>
			</div>
			<div class={tw`w-80 shrink-0 flex-(& col) relative z-10 bg-gray-800 rounded-l-xl shadow-md p-4`}>
				<Form<{ calendar: string }>
					value={{ calendar: calendarName ?? undefined }}
					onChange={(data) => setCalendarName(data.calendar ?? null)}>
					<Field.Option path='calendar' options={new Map(calendars)}/>

					<div class={tw`h-4`}/>

					{Object.values(calendar?.categories ?? {}).map(category =>
						<Category
							key={category.uid}
							name={category.name}
							color={category.color}
							enabled={category.enabled}
							toggle={() => handleToggleCategory(category.uid)}
						/>
					)}
				</Form>
			</div>
		</div>
	);
}
