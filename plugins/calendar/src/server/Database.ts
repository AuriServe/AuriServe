import { RRuleSet, rrulestr } from 'rrule';
import { database } from 'auriserve';

const CALENDARS_TBL = 'calendar_calendars';
const CATEGORIES_TBL = 'calendar_categories';
const EVENTS_TBL = 'calendar_events';
const EVENT_CATEGORIES_TBL = 'calendar_event_categories';

/** A calendar item in the database. */
export interface DatabaseCalendar {
	id: number;
	name: string;
	description: string;
	color: string;
}

/** A category item in the database. */
export interface DatabaseCategory {
	id: number;
	cal_id: number;

	name: string;
	color: string | null;
}

/** An event item in the database. */
export interface DatabaseEvent {
	id: number;
	cal_id: number;
	uid: string;

	// Start time of the 1st event in the series.
	start: number;
	// End time of the 1st event in the series.
	end: number;

	// The recurrence rule(s) string of the event. Null if not recurring. Rules separated by '###'.
	rrule: string | null;
	// The end time of the last event in the rrule series. INT_MAX if infinite, null if no recurrence.
	rend: number | null;

	title: string;
	description: string;
	location: string;
}

/** An enhanced calendar returned by `getCalendar`. */
export interface Calendar extends DatabaseCalendar {
	categories: Category[];
}

/** An enhanced category returned by `getCalendar`. */
export type Category = DatabaseCategory;

/** An enhanced event returned by `getEvents`. */
export interface Event extends Omit<DatabaseEvent, 'rrule'> {
	rrule: RRuleSet | null;
}

export function init() {
	// /**
	//  * Clean-up databases, for testing.
	//  */

	// database.prepare('DROP TABLE IF EXISTS ${CALENDARS_TBL}').run();
	// database.prepare('DROP TABLE IF EXISTS ${CATEGORIES_TBL}').run();
	// database.prepare('DROP TABLE IF EXISTS ${EVENTS_TBL}').run();
	// database.prepare('DROP TABLE IF EXISTS ${EVENT_CATEGORIES_TBL}').run();

	/**
	 * Holds calendars. Calendars represent a series of events, with optional categories.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${CALENDARS_TBL} (
			id INTEGER PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT NOT NULL
		) STRICT`
	).run();

	/**
	 * Holds category definitions. Categories are relative to calendars, and are applied to events.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${CATEGORIES_TBL} (
			id INTEGER PRIMARY KEY,
			cal_id INTEGER REFERENCES Calendars(id) ON DELETE CASCADE,
			name TEXT NOT NULL,
			color TEXT
		) STRICT`
	).run();

	/**
	 * Holds calendar events. Events reference a calendar, and can be recurring.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${EVENTS_TBL} (
			id INTEGER PRIMARY KEY,
			cal_id INTEGER REFERENCES Calendars(id) ON DELETE CASCADE,
			uid INTEGER NOT NULL,
			start TEXT NOT NULL,
			end TEXT NOT NULL,
			rrule TEXT NOT NULL,
			rend INTEGER,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			UNIQUE(cal, uid)
		) STRICT`
	).run();

	/**
	 * Holds the categories that an event belongs to. An event can be assigned to multiple categories.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${EVENT_CATEGORIES_TBL} (
			id INTEGER PRIMARY KEY,
			event_id INTEGER NOT NULL REFERENCES Events(id) ON DELETE CASCADE,
			cat_id INTEGER NOT NULL REFERENCES Categories(id) ON DELETE CASCADE,
			UNIQUE(event_id, cat_id)
		) STRICT`
	).run();
}

init();

const QUERY_GET_CALENDAR = database.prepare(`SELECT * FROM ${CALENDARS_TBL} WHERE id = ?`);
const QUERY_CALENDAR_CATEGORIES = database.prepare(`SELECT * FROM ${CATEGORIES_TBL} WHERE cal_id = ?`);
const QUERY_GET_CALENDAR_EVENTS_IN_RANGE = database.prepare(`
	SELECT * FROM ${EVENTS_TBL} WHERE cal_id = ? AND (
		((end >= ?) OR (rend >= ?)) AND ${/** Checks that the event ends after the start time. */''}
		(start <= ?) ${/** Checks that the event starts before the end time. */''}
	)`
);

export function getCalendar(id: number): Calendar | null {
	const calendar = QUERY_GET_CALENDAR.get(id);
	if (!calendar) return null;

	const categories = QUERY_CALENDAR_CATEGORIES.all(id);
	return {
		...calendar,
		categories
	};
}

export function getEventsInRange(cal: number, start: number, end: number): Event[] {
	const dbStart = Math.floor(start / 1000);
	const dbEnd = Math.floor(end / 1000);

	const events = QUERY_GET_CALENDAR_EVENTS_IN_RANGE.all(cal, dbStart, dbStart, dbEnd) as DatabaseEvent[];
	return events.map(event => ({
		...event,
		rrule: event.rrule ? (rrulestr(event.rrule, { forceset: true })) as any as RRuleSet : null
	}));
}

export function addEvent(event: Omit<Event, 'id' | 'uid' | 'rrule' | 'location' | 'rend'> &
	{ uid?: string, rrule?: RRuleSet, location?: string }) {

	// const rend =

	// const dbEvent: Omit<DatabaseEvent, 'id'> = {
	// 	...event,
	// 	uid: event.uid ?? `auriserve:${Date.now()}:${Math.random()}`,
	// 	location: event.location ?? '',
	// 	rrule: event.rrule ? event.rrule.toString() : null,
	// 	rend: 0
	// };
}
