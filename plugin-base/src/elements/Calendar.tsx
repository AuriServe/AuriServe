import * as Preact from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { ClientDefinition, Color, Media } from 'auriserve-api';
import { TransitionGroup, CSSTransition } from 'preact-transitioning';

import './Calendar.sss';

import CalendarEvent from './components/CalendarEvent';

export interface EventProp {
	name: string;
	category: string;
	description: string;
	
	startDate: number;
	endDate?: number;
	hideDate: boolean;
	
	color?: Color.HSV;
	media?: Partial<Media>[];
	mediaAttachment?: 'top' | 'center' | 'bottom';
	
	// Added via Hydration
	dateString?: string;
}

export interface Category {
	name: string;
	color?: Color.HSV;
}

function HSVToRGB(hsv: Color.HSV = { h: 0, s: 0, v: 0}): Color.RGB {
	let r: number = 0, g: number = 0, b: number = 0;

	let i = Math.floor(hsv.h * 6);
	let f = hsv.h * 6 - i;
	let p = hsv.v * (1 - hsv.s);
	let q = hsv.v * (1 - f * hsv.s);
	let t = hsv.v * (1 - (1 - f) * hsv.s);

	switch(i % 6) {
	default: break;
	case 0: r = hsv.v; g = t; b = p; break;
	case 1: r = q; g = hsv.v; b = p; break;
	case 2: r = p; g = hsv.v; b = t; break;
	case 3: r = p; g = q; b = hsv.v; break;
	case 4: r = t; g = p; b = hsv.v; break;
	case 5: r = hsv.v; g = p; b = q; break;
	}

	return { r: r * 255, g: g * 255, b: b * 255 };
}

function componentToHex(c: number) {
	let hex = Math.round(c).toString(16);
	return hex.length === 1 ? '0' + hex : hex;
}

function RGBToHex(rgb: Color.RGB = { r: 0, g: 0, b: 0}): string {
	return '#' + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

function HSVToHex(hsv: Color.HSV = { h: 0, s: 0, v: 0}): string {
	return RGBToHex(HSVToRGB(hsv));
}

export interface Event extends EventProp { ind: number }

type EventCascadeDay = ({event: Event; classes: string} | null)[];
type EventCascade = EventCascadeDay[];

interface HeaderProps {
	month: number;
	year: number;
	disabled?: boolean;

	onNavigate: (months: number) => void;
}

interface DateProps {
	date: Date;
	class: string;
	events: EventCascadeDay;
	categories: { [key: string]: Category };

	hovered?: number;
	showHidden: boolean;

	onHover: (ind?: number) => void;
	onClick: (ind: number) => void;
}

interface RowProps {
	month: number;
	weekStart: Date;
	events: Event[];
	categories: { [key: string]: Category };

	hovered?: number;
	showHidden: boolean;

	onHover: (ind?: number) => void;
	onClick: (ind: number) => void;
}

interface PageProps {
	month: number;
	year: number;
	events: Event[];
	categories: { [key: string]: Category };

	hovered?: number;
	showHidden: boolean;

	onHover: (ind?: number) => void;
	onClick: (ind: number) => void;

	// Added via CSSTransition
	className?: string;
}

export interface CalendarProps {
	events?: EventProp[];
	categories: { [key: string]: Category };
}

/** Simple modulus function that works with negative numbers. */
const mod = (n: number, m: number) => ((n % m) + m) % m;

export function sameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

/** An indexed array of month names. */
const monthNames = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'];


/**
 * Renders a header containing the days of the week.
 */

export function CalendarDayBar() {
	return (
		<div class='Calendar-DayBar'>
			<span>Sunday</span>
			<span>Monday</span>
			<span>Tuesday</span>
			<span>Wednesday</span>
			<span>Thursday</span>
			<span>Friday</span>
			<span>Saturday</span>
		</div>
	);
}

/**
 * Renders the current month and year,
 * as well as navigation buttons if 'window' is defined.
 */

export function CalendarHeader({ month, year, onNavigate, disabled }: HeaderProps) {
	const interactive = 'window' in global;
	return (
		<div class='Calendar-Header'>
			{interactive && <button class='Calendar-Button Previous'
				disabled={disabled} onClick={() => onNavigate(-1)}>Previous</button>}

			<h3>{monthNames[month]} {year}</h3>

			{interactive && <button class='Calendar-Button Next'
				disabled={disabled} onClick={() => onNavigate(1)}>Next</button>}
		</div>
	);
}


/**
 * Renders a single day of a calendar month.
 */

function CalendarDate(props: DateProps) {
	const events = props.events.map(evt => {
		if (!evt) return <div/>; /* Spacer */

		let { event, classes } = evt;
		const color = event.color ?? props.categories[event.category].color;
		
		if (event.hideDate) {
			if (!props.showHidden) return null;
			else classes += ' Hidden';
		}

		if (props.hovered === event.ind) classes += ' Selected';

		return (
			<button
				class={'Calendar-Event ' + classes}
				style={color && {'--color': HSVToHex(color) } as any}
				onMouseOut={() => props.onHover(undefined)}
				onMouseOver={() => props.onHover(event.ind)}
				onClick={() => props.onClick(event.ind)}>
				{classes.indexOf('start') !== -1 && <Preact.Fragment>
					<div class='Calendar-EventColorIndicator'/>
					<span>{evt.event.name}</span>
				</Preact.Fragment>}
			</button>
		);
	});

	return (
		<div class={props.class}>
			<span class='Calendar-DayIndicator'>{props.date.getDate()}</span>
			{events}
		</div>
	);
}


/**
 * Creates an memoized event cascade for a week.
 *
 * @param {Date} weekState - A date representing the start of the week.
 * @param {Event[]} events - A list of all of the Calendar events.
 * @returns the EventCascade for the week.
 */

function useEventCascade(weekStart: Date, events: Event[]): EventCascade {
	const cascade = useMemo(() => {
		const weekEnd = new Date(weekStart.getTime());
		weekEnd.setDate(weekStart.getDate() + 7);

		const eventCascade: EventCascade = [];
		events.filter(event => {
			const endDate = new Date(event.endDate || event.startDate);
			return (event.startDate > +weekStart && event.startDate < +weekEnd) || (endDate > weekStart && endDate <= weekEnd);
		}).sort((a, b) => ((a.endDate || a.startDate) - a.startDate > (b.endDate || b.startDate) - b.startDate) ? -1 : 1)
			.forEach(event => {
				let startInd = Math.floor((event.startDate - +weekStart) / (1000 * 3600 * 24));
				let endInd = Math.floor(((event.endDate || event.startDate) - +weekStart) / (1000 * 3600 * 24));

				for (let i = 0; true; i++) {
					if (!eventCascade[i]) eventCascade[i] = [ null, null, null, null, null, null, null ];

					const start = Math.max(startInd, 0);
					const end = Math.min(endInd, 6);

					let conflicts = false;
					for (let x = start; x <= end; x++) {
						if (eventCascade[i][x]) {
							conflicts = true;
							break;
						};
					}
					if (conflicts) continue;

					for (let x = start; x <= end; x++)
						eventCascade[i][x] = { event: event, classes: (x === start ? 'start' : '') + (x === end ? ' end' : '')};
					break;
				}
			});

		return eventCascade;
	}, [ events, weekStart ]);

	return cascade;
}


/**
 * Renders a week of a calendar month.
 */

function CalendarRow(props: RowProps) {
	const eventCascade = useEventCascade(new Date(props.weekStart.getTime()), props.events);

	let date = new Date(props.weekStart.getTime());
	let days: Preact.VNode[] = [];

	const currentDate = new Date();

	for (let i = 0; i < 7; i++) {
		const isCurrentMonth = date.getMonth() === props.month;

		const isCurrentDate = sameDay(date, currentDate);

		const dayClasses = 'Calendar-Day ' +
			(isCurrentDate ? ' CurrentDay' : '') +
			(isCurrentMonth ? ' CurrentMonth' : '');

		let dayEvents = eventCascade.map(row => row.filter((_, d) => d === i)[0]);

		days.push(
			<CalendarDate
				class={dayClasses}
				date={new Date(date.getTime())}
				events={dayEvents}
				categories={props.categories}

				hovered={props.hovered}
				showHidden={props.showHidden}

				onHover={props.onHover}
				onClick={props.onClick}
			/>
		);

		date.setDate(date.getDate() + 1);
	}

	return (
		<div class='Calendar-Row'>
			{days}
		</div>
	);
}


/**
 * Renders a calendar page containing a full month.
 */

// @ts-ignore
export function CalendarPage(props: PageProps) {
	let monthDate = new Date();
	monthDate.setMonth(props.month, 1);
	monthDate.setFullYear(props.year);

	let rows: Preact.VNode[] = [];

	const firstDayOfMonth = monthDate.getDay();
	for (let i = 1; true; i += 7) {

		// Create a date at Sunday of the `i`th week shown on the calendar.
		const day = i - firstDayOfMonth;
		let date = new Date();
		date.setHours(0, 0, 0, 0);
		date.setMonth(props.month, 1);
		date.setFullYear(props.year);
		date.setDate(day);

		// Break when we go past the last week of the month.
		if ((date.getMonth() > props.month && date.getFullYear() >= props.year) || date.getFullYear() > props.year) break;

		// Add a new CalendarRow for the week.
		rows.push(
			<CalendarRow
				month={props.month}
				weekStart={date}
				events={props.events}
				categories={props.categories}

				hovered={props.hovered}
				showHidden={props.showHidden}

				onHover={props.onHover}
				onClick={props.onClick}
			/>
		);
	}

	return (
		<div class={('Calendar-Page ' + (props.className ?? '')).trim()} key={props.month}>
			{rows}
		</div>
	);
}


/**
 * Hook that provides a month and date, and a function to traverse them.
 *
 * @returns the current month, the current year, and a function to add or subtract months in a tuple.
 */

export function useCalendarNavigation(): [ number, number, (months: number) => void ] {
	const [ month, setMonth ] = useState<number>(() => new Date().getMonth());
	const [ year, setYear ] = useState<number>(() => new Date().getFullYear());

	const navigate = (months: number): void => {
		setMonth(mod(month + months, 12));
		setYear(year + Math.floor((month + months) / 12));
	};

	return [ month, year, navigate ];
}


/**
 * Applies event indices to each event, in the order that they exist.
 */

export function assignEventIndices(events?: EventProp[]): Event[] {
	let i = 0;
	if (!events) events = [];
	return events.map(e => Object.assign({}, e, { ind: i++ }));
}


/**
 * Renders an interactive calendar.
 */

export function Calendar(props: CalendarProps) {
	const [ month, year, navigate ] = useCalendarNavigation();
	const events = useMemo(() => assignEventIndices(props.events), [ props.events ]);

	const [ hovered, setHovered ] = useState<number | undefined>(undefined);
	const [ selected, setSelected ] = useState<number | undefined>(undefined);

	return (
		<div class='Calendar'>
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
								showHidden={false}
				
								onHover={setHovered}
								onClick={setSelected}
							/>
						</CSSTransition>
					</TransitionGroup>
				</div>
				{selected !== undefined &&
					<CalendarEvent event={events[selected]} onClose={() => setSelected(undefined)} />}
			</div>
		</div>
	);
}

export const client: ClientDefinition = {
	identifier: 'Calendar',
	element: Calendar
};
