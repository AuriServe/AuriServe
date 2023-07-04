import { RRuleSet, rrulestr } from 'rrule';
import { database } from 'auriserve';
import assert from 'assert';

const CALENDARS_TBL = 'calendar_calendars';
const EVENTS_TBL = 'calendar_events';
const TIMEZONES_TBL = 'calendar_timezones';

/** A calendar item in the database. */
export interface DatabaseCalendar {
	id: number;
	name: string;
	description?: string;
	color?: string;
}

/** A calendar outside of the database. */
export type Calendar = Omit<DatabaseCalendar, 'id'> & { id?: number; };

/** An event item in the database. */
export interface DatabaseEvent {
	/** The database ID of the event. */
	id: number;

	/** The database ID of the calendar this event is for. */
	cal: number;

	/** The event UUID, unique relative to the calendar. */
	uid: string;

	/** The event type, whether it be an all day event, or a timed event. */
	type: 'event-day' | 'event-timed';

	/** The start time of the 1st event in the series. */
	start: number;

	/** The end time of the 1st event in the series. */
	end: number;

	/** The recurrence string of the event. Null if not recurring. */
	rrule: string | null;

	/** The database ID for the timezone of the event, only needed if the event is recurring, used to honor DST. */
	timezone: number | null;

	/** The end time of the last event in the series. null if infinite, or if there is no recurrence. */
	rend: number | null;

	/** The title of the event. */
	title?: string;

	/** The description of the event. */
	description?: string;

	/** The location at which the event takes place. */
	location?: string;
}

/** An event item outside of the database, that could be made into a database event. */
export type CalendarEvent = Omit<DatabaseEvent, 'cal' | 'id' | 'rend' | 'rrule'> & {
	/** The database ID of the event. May be omitted if inserting. */
	id?: number;

	/** The calendar ID of the event. May be omitted if inserting. */
	cal?: number;

	/** The recurrence rule(s) of the event. Null if not recurring. */
	rrule: RRuleSet | null;
};

/** A timezone in the Database. Used for computing DST for recurring events. */
export type DatabaseTimezone = {
	/** The database ID of the timezone. */
	id: number;

	/** The database calendar ID of the timezone. */
	cal: number;

	/** The calendar ID for the timezone (TZID in iCal). */
	tzid: string;

	/**
	 * The recurrence rule for when Daylight Savings Time starts in the timezone. Will be null if no DST.
	 * Recurrence rules for DST MUST have a YEARLY frequency. It is invalid behaviour to do otherwise.
   */
	dstStart: string | null;

	/**
	 * The recurrence rule for when Daylight Savings Time ends in the timezone. Will be null if no DST.
	 * Recurrence rules for DST MUST have a YEARLY frequency. It is invalid behaviour to do otherwise.
   */
	dstEnd: string | null;

	/** The timezone offset change (in minutes) from regular time when DST is active. */
	dstChange: number;

	/** The standard (non DST) timezone offset (in minutes) for this timezone. */
	stdOffset: number;

	/** The DST timezone offset (in minutes) for this timezone. */
	dstOffset: number;
}

export function init() {
	/**
	 * Clean-up databases, for testing.
	 */

	// database.prepare(`DROP TABLE IF EXISTS ${CALENDARS_TBL}`).run();
	// database.prepare(`DROP TABLE IF EXISTS ${EVENTS_TBL}`).run();
	// database.prepare(`DROP TABLE IF EXISTS ${TIMEZONES_TBL}`).run();

	/**
	 * Holds calendars. Calendars primarily are used as categories, with each one holding a set of events,
	 * and having a default color. Multiple calendars may be displayed at once.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${CALENDARS_TBL} (
			id INTEGER PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT,
			color TEXT
		) STRICT`
	).run();

	/**
	 * Holds timezones. Timezones are used to calculate DST for recurring events. They are stored as a recurrence rule
	 * for when DST starts and ends, and the change from regular time when DST is active. These are used by recurring
	 * events to keep their times consistent to the region they were created in.
	 * e.g. A recurring event for 12:00pm should always be at 12:00pm, even if DST shifts the clock forward by an hour.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${TIMEZONES_TBL} (
			id INTEGER PRIMARY KEY,
			cal INTEGER REFERENCES ${CALENDARS_TBL}(id) ON DELETE CASCADE,
			tzid TEXT NOT NULL,
			dstStart TEXT,
			dstEnd TEXT,
			dstChange REAL NOT NULL,
			stdOffset REAL NOT NULL,
			dstOffset REAL NOT NULL,
			UNIQUE(cal, tzid)
		) STRICT`
	).run();

	/**
	 * Holds calendar events. Calendar events are either singular or recurring events that display on a calendar.
	 * They may have a description and a location. They will have a unique ID that should not overlap with any other
	 * event in the same calendar.
	 * A recurring event may have a timezone specified. If so, DST will be considered when calculating recurring events.
	 * Non-recurring events do not get affected by timezone, as they are converted into UTC time when stored.
	 * Events may be all-day, which means they will be displayed across one or more days, and will not have a specific
	 * time associated with them. These events will internally be stored as having a start and end time both set to noon.
	 */

	database.prepare(
		`CREATE TABLE IF NOT EXISTS ${EVENTS_TBL} (
			id INTEGER PRIMARY KEY,
			cal INTEGER REFERENCES ${CALENDARS_TBL}(id) ON DELETE CASCADE,
			uid TEXT NOT NULL,
			type TEXT NOT NULL,
			start REAL NOT NULL,
			end REAL NOT NULL,
			rrule TEXT,
			timezone INTEGER REFERENCES ${TIMEZONES_TBL}(id) ON DELETE SET NULL,
			rend REAL,
			title TEXT,
			description TEXT,
			location TEXT,
			UNIQUE(cal, uid)
		) STRICT`
	).run();
}

init();

const QUERY_INSERT_CALENDAR = database.prepare(
	`INSERT INTO ${CALENDARS_TBL} (name, description, color) VALUES (?, ?, ?)`);
const QUERY_INSERT_TIMEZONE = database.prepare(
	`INSERT INTO ${TIMEZONES_TBL} (cal, tzid, dstStart, dstEnd, dstChange, stdOffset, dstOffset) VALUES
		(@cal, @tzid, @dstStart, @dstEnd, @dstChange, @stdOffset, @dstOffset)`);
const QUERY_INSERT_EVENT = database.prepare<Omit<DatabaseEvent, 'id'> & { id?: number }>(
	`INSERT INTO ${EVENTS_TBL} (cal, uid, type, start, end, rrule, timezone, rend, title, description, location) VALUES
		(@cal, @uid, @type, @start, @end, @rrule, @timezone, @rend, @title, @description, @location)`);
const QUERY_GET_CALENDAR = database.prepare(`SELECT * FROM ${CALENDARS_TBL} WHERE id = ?`);
const QUERY_GET_CALENDAR_EVENTS_IN_RANGE = database.prepare<{ start: number, end: number, cal: number }>(`
	SELECT * FROM ${EVENTS_TBL} WHERE cal = @cal AND (((end >= @start) OR (rend >= @start) OR (rend IS NULL))
	AND (start <= @end))`);
const QUERY_GET_CALENDAR_NAMES = database.prepare(`SELECT id, name FROM ${CALENDARS_TBL}`);
const QUERY_GET_TIMEZONES_BY_CALENDAR = database.prepare(`SELECT * FROM ${TIMEZONES_TBL} WHERE cal = ?`);

export function getCalendar(id: number): Calendar | null {
	return QUERY_GET_CALENDAR.get(id);
}

export function getCalendars(): Map<number, string> {
	const calendars = QUERY_GET_CALENDAR_NAMES.all() as { id: number, name: string }[];
	return new Map(calendars.map(({ id, name }) => [id, name]));
}

export function addCalendar(calendar: Calendar) {
	return QUERY_INSERT_CALENDAR.run(calendar.name ?? 'Untitled Calendar',
		calendar.description, calendar.color).lastInsertRowid as number;
}

/**
 * All day events should be honored on the client side!
 */

export function getEventsInRange(calendars: number | number[], start: number, end: number): CalendarEvent[] {

	const events = (Array.isArray(calendars) ? calendars : [ calendars ])
		.map(cal => {
			/** A map of timezones that are used by this calendar. */
			const timezones = Object.fromEntries((QUERY_GET_TIMEZONES_BY_CALENDAR.all(cal) as DatabaseTimezone[])
				.map(tz => [ tz.id, tz ]));

			/** A map of `${tzid}-${year} paired with the start and end dates for DST. */
			const cachedDSTRanges: Record<string, [ Date, Date ]> = {};

			return (QUERY_GET_CALENDAR_EVENTS_IN_RANGE.all({ cal, start, end }) as DatabaseEvent[])
				.map(event => (event.rrule ? rrulestr(event.rrule, { dtstart: new Date(event.start) })
					.between(new Date(start), new Date(end), true) : [ new Date(event.start) ])
					.map<CalendarEvent>(date => {
						// If the event has a timezone (which will only happen if it's recurring), we may need to factor in a
						// DST offset. Pull the event's timezone, find the DST start and end ranges, and then offset the date
						// by the DST offset if necessary.
						if (event.timezone) {
							const yearSpec = `${event.timezone}-${date.getFullYear()}`;
							let range = cachedDSTRanges[yearSpec];
							if (!range) {
								const timezone = timezones[event.timezone];
								assert(timezone, 'Could not find timezone!');
								assert(timezone.dstStart && timezone.dstEnd, 'Timezone does not have DST dates!');
								const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
								const dstStart = rrulestr(timezone.dstStart!).after(firstDayOfYear, true);
								const dstEnd = rrulestr(timezone.dstEnd!).after(firstDayOfYear, true);
								assert(dstStart && dstEnd, 'Could not find DST dates for timezone!');
								range = [ dstStart, dstEnd ];
								cachedDSTRanges[yearSpec] = range;
							}

							if (date >= range[0] && date <= range[1]) {
								date = new Date(+date - timezones[event.timezone].dstChange * 60 * 1000);
							}
						}

						return {
							...event,
							start: +date,
							end: +date + (event.end - event.start),
							rrule: null
						}
					}
				))
			}
		)
		.flat(2);

	return events;
}

const DATE_CONSIDERED_INFINITE = new Date();
DATE_CONSIDERED_INFINITE.setFullYear(DATE_CONSIDERED_INFINITE.getFullYear() + 9999);


export function addTimezone(timezone: Omit<DatabaseTimezone, 'id' | 'dstChange'>) {
	const dstChange = timezone.dstOffset - timezone.stdOffset;
	const res = QUERY_INSERT_TIMEZONE.run({ ...timezone, dstChange });
	if (res.changes === 0) throw new Error('Could not add timezone! Perhaps it already exists?');
	return res.lastInsertRowid as number;
}

export function addEvent(event: CalendarEvent & { cal: number }) {
	const isInfinite = event.rrule && !!event.rrule.rrules().find((r) =>
		(!r.options.until || r.options.until >= DATE_CONSIDERED_INFINITE) && ((r.options.count ?? Infinity) >= Infinity));

	let rruleStr = event.rrule?.toString() ?? null;
	if (rruleStr != null && Array.isArray(rruleStr)) {
		assert(rruleStr.length === 1, 'Multiple rrules found! This cannot be handled yet!');
		rruleStr = rruleStr[0];
	}

	QUERY_INSERT_EVENT.run({
		...event,
		rrule: rruleStr,
		rend: isInfinite ? null : +(event.rrule?.all()?.pop() ?? event.start) + (event.end - event.start)
	} as any);
}
