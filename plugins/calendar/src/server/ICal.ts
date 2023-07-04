import fs from 'fs';
import { once } from 'events';
import { assert } from 'common';
import readline from 'readline';

import { Calendar, CalendarEvent, DatabaseTimezone } from './Database';
import { RRuleSet, rrulestr } from 'rrule';
import { log } from 'auriserve';

const DAY_EVENT_OFFSET = 1000 * 60 * 60 * 12;

export interface ParsedICal extends Calendar {
	events: Record<string, Omit<CalendarEvent, 'timezone'> & { timezone?: string }>;
	timezones: Record<string, Omit<DatabaseTimezone, 'id' | 'cal' | 'dstChange'>>;
}

/**
 * Converts a date from funky ICAL format into a JS unix timestamp.
 * @param date - ICAL formatted date.
 * @returns a unix timestamp (with milliseconds).
 */

function parseDatestamp(date: string) {
	const match = /^(\d{4})(\d{2})(\d{2})$/gm.exec(date)!;
	return +new Date(+match[1], +match[2] - 1, +match[3]);
}

/**
 * Converts a datetime from funky ICAL format into a JS unix timestamp.
 * @param date - ICAL formatted datetime.
 * @returns a unix timestamp (with milliseconds).
 */

function parseTimestamp(date: string) {
	if (date.indexOf('T') === -1) return parseDatestamp(date.slice(0, 8))
	const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/gm.exec(date)!;
	return Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6]);
}

/**
 * Parses a timezone offset code (-0800, +0530) into a numeric offset from UTC in minutes.
 * @param tz - the timezone offset.
 * @returns a numeric offset from UTC time in minutes for this timezone.
 */

function parseTZOffset(tz: string) {
	const negative = tz.startsWith('-');
	tz = tz.replace(/^[+-]/, '').padStart(4, '0');
	const hours = Number.parseInt(tz.slice(0, 2), 10);
	const minutes = Number.parseInt(tz.slice(2, 4), 10);
	return (hours * 60 + minutes) * (negative ? -1 : 1);
}

/**
 * Indexes into the timezones for a calendar to find the timezone offset in milliseconds of the given tzid.
 * @param timezones - The timezones for the calendar.
 * @param tzid - The timezone ID to find the offset for.
 * @returns the timezone offset in milliseconds.
 */

function getTZDateOffset(timezones: Record<string, { stdOffset: number }>, tzid: string) {
	const tz = timezones[tzid];
	if (!tz) return 0;
	return tz.stdOffset * 60 * 1000;
}

/**
 * Parses an ICAL line for a key, value, and optional type and typeValue.
 * @param line - The line to parse.
 * @returns an object containing the line's data.
 */

function parseLine(line: string): { key: string, value: string, type?: string, typeValue?: string } {
	const match = /^([^;=:]+)(?:;([^;=:]+)=([^;=:]+))*:(.*)$/gm.exec(line)!;
	return { key: match[1], value: match[4], type: match[2], typeValue: match[3] };
}

/**
 * Parses an ICAL file into a ACAL formatted Javascript object.
 * @param calPath - The path to the ICAL file.
 * @returns a promise that resolves to the parsed calendar.
 */

export function parseICAL(calPath: string): Promise<ParsedICal> {
	const fileStream = fs.createReadStream(calPath);
	const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

	const events: Record<string, Omit<CalendarEvent, 'timezone'> & { timezone?: string }> = {};
	const timezones: Record<string, Omit<DatabaseTimezone, 'id' | 'cal' | 'dstChange'>> = {};

	/**
	 * Skips an unknown block of lines, from the current line
	 * (starting with BEGIN:) to the matching end line.
	 * Returns to the delegator when the end line is reached.
	 */

	function* skipBlock(): any {
		const { value } = parseLine(yield);
		log.warn(`[iCal] Skipping unknown block '${value}'.`);
		const endLine = `END:${value}`;

		let line: string = yield;
		while (true) {
			line = yield;

			if (line === endLine) {
				yield;
				return delegate();
			}
		}
	}

	/**
	 * Runs the appropriate generator when a new block is found.
	 */

	function* delegate(): any {
		const line: string = yield;

		switch (line) {
			default:
				if (line.startsWith('BEGIN:')) return skipBlock();
				assert(false, `Unknown line found: ${line}`);
				break;

			case 'END:VCALENDAR':
				return null;
			case 'BEGIN:VEVENT':
				return parseCalEvent();
			case 'BEGIN:VTIMEZONE':
				return parseCalTimezone();
		}
	}

	/*
	 * Parses a calendar event block.
	 */

	function* parseCalEvent(): any {
		let line: string = yield;
		assert(line === 'BEGIN:VEVENT', 'Expected BEGIN:VEVENT');

		let uid: string | undefined;
		let type: 'event-day' | 'event-timed' = 'event-timed';
		let start: number | undefined;
		let end: number | undefined;
		let tzid: string | undefined;
		let title: string | undefined;
		let description: string | undefined;
		let location: string | undefined;
		const rrule: RRuleSet = new RRuleSet();
		const tmpRRules: string[] = [];
		const tmpEXRules: string[] = [];

		while (true) {
			line = yield;
			const { key, type: valueType, typeValue: valueTypeValue, value } = parseLine(line);

			switch (key) {
				case 'UID':
					uid = value;
					break;
				case 'DTSTART':
					switch (valueType) {
						case 'TZID':
							tzid = valueTypeValue;
							// fallthrough to assign the start time
					case undefined:
					case 'VALUE':
						if (valueType === 'VALUE' && valueTypeValue === 'DATE') type = 'event-day';
						else if (valueType === 'VALUE' && valueTypeValue === 'DATE-TIME') type = 'event-timed';
						else if (valueType === 'VALUE' && valueTypeValue != null)
							assert(false, `Unknown DTSTART VALUE '${valueTypeValue}'`);

						start = parseTimestamp(value)
							- getTZDateOffset(timezones, valueTypeValue ?? '')
							+ (type === 'event-day' ? DAY_EVENT_OFFSET : 0);
					}
					break;
				case 'DTEND':
					switch (valueType) {
						case 'TZID':
							tzid = valueTypeValue;
							// fallthrough to assign the end time
					case undefined:
					case 'VALUE':
						if (valueType === 'VALUE' && valueTypeValue === 'DATE') type = 'event-day';
						else if (valueType === 'VALUE' && valueTypeValue === 'DATE-TIME') type = 'event-timed';
						else if (valueType === 'VALUE' && valueTypeValue != null)
							assert(false, `Unknown DTEND VALUE '${valueTypeValue}'`);

						end = parseTimestamp(value)
							- getTZDateOffset(timezones, valueTypeValue ?? '')
							+ (type === 'event-day' ? DAY_EVENT_OFFSET : 0);
					}
					break;
				case 'RRULE':
					tmpRRules.push(value);
					break;
				case 'RDATE':
					rrule.rdate(new Date(parseTimestamp(value)));
					break;
				case 'EXRULE':
					tmpEXRules.push(value);
					break;
				case 'EXDATE':
					rrule.exdate(new Date(parseTimestamp(value)));
					break;
				case 'SUMMARY':
					title = value;
					break;
				case 'DESCRIPTION':
					description = value;
					break;
				case 'LOCATION':
					location = value;
					break;
			}

			if (line === 'END:VEVENT') {
				tmpRRules.forEach(r => rrule.rrule(rrulestr(r, { dtstart: new Date(start!) })));
				tmpEXRules.forEach(r => rrule.exrule(rrulestr(r, { dtstart: new Date(start!) })));

				const isRecurring = (rrule.rrules().length > 0 || rrule.rdates().length > 0);

				assert(uid != null && start != null && end != null, `Event '${title}' is missing required fields.`);
				assert(!isRecurring || tzid != null || type === 'event-day', `Event '${title}' is missing required fields.`);

				if (type === 'event-day') end -= 1000 * 60 * 60 * 24;

				events[uid] = {
					uid,
					type,
					start,
					end,
					title,
					description,
					location,
					rrule: isRecurring ? rrule : null,
					timezone: tzid
				};
				yield;
				return delegate();
			}
		}
	}

	/*
	 * Parses a calendar timezone block.
	 */

	function* parseCalTimezone(): any {
		let line: string = yield;
		assert(line === 'BEGIN:VTIMEZONE', 'Expected BEGIN:VTIMEZONE');

		let ctx: 'dst' | 'std' = 'std';

		let tzid: string | undefined;
		let dstDtStart: string | undefined;
		let dstRrule: string | undefined;
		let dstOffset: number | undefined;
		let stdDtStart: string | undefined;
		let stdRrule: string | undefined;
		let stdOffset: number | undefined;

		while (true) {
			line = yield;
			const { key, value } = parseLine(line);

			switch (key) {
				case 'TZID':
					tzid = value;
					break;
				case 'BEGIN':
					if (value === 'STANDARD') ctx = 'std';
					else if (value === 'DAYLIGHT') ctx = 'dst';
					break;
				case 'TZOFFSETTO':
					if (ctx === 'dst') dstOffset = parseTZOffset(value);
					else stdOffset = parseTZOffset(value);
					break;
				case 'DTSTART':
					if (ctx === 'dst') dstDtStart = value;
					else stdDtStart = value;
					break;
				case 'RRULE':
					if (ctx === 'dst') dstRrule = value;
					else stdRrule = value;
					break;
			}

			if (line === 'END:VTIMEZONE') {
				assert(tzid != null && dstRrule != null && dstOffset != null &&
					stdRrule != null && stdOffset != null, 'Missing required fields.');

				const dstStart = dstDtStart
					? rrulestr(dstRrule, { dtstart: new Date(parseTimestamp(dstDtStart)) }).toString()
					: dstRrule;

				const dstEnd = stdDtStart
					? rrulestr(stdRrule, { dtstart: new Date(parseTimestamp(stdDtStart)) }).toString()
					: stdRrule;

				timezones[tzid] = {
					tzid,
					dstEnd,
					dstStart,
					dstOffset,
					stdOffset
				};

				yield;
				return delegate();
			}
		}
	}

	/*
	 * Parses the calendar header.
	 */

	function* parseCalHeader(): any {
		let line: string = yield;
		assert(line === 'BEGIN:VCALENDAR', 'Expected BEGIN:VCALENDAR');

		let foundVersion = false;

		while (true) {
			line = yield;
			const { key, value } = parseLine(line);
			if (key === 'VERSION') {
				assert(value === '2.0', 'Expected VERSION:2.0');
				foundVersion = true;
			}

			if (line.startsWith('BEGIN:VEVENT') || line.startsWith('BEGIN:VTIMEZONE')) {
				assert(foundVersion, 'Expected VERSION:2.0 before calendar content.');
				return delegate();
			}
		}
	}

	let gen = parseCalHeader();
	gen.next();

	let accLine = '';
	function onLine(line: string) {
		if (!line.startsWith(' ') && !line.startsWith('\t')) {
			if (accLine) doLine(accLine);
			accLine = line;
		}
		else {
			accLine += line.slice(1);
		}
	};

	rl.on('line', onLine);

	function doLine(line: string) {
		let { value, done } = gen.next(line);
		while (done) {
			if (!value) {
				rl.off('line', onLine);
				return;
			}

			gen = value;
			gen.next();
			const res = { value, done } = gen.next(line);
			value = res.value;
			done = res.done;
		}
	}

	return new Promise((resolve) => {
		once(rl, 'close').then(() => {
			if (accLine) doLine(accLine);
			resolve({ name: '', events, timezones });
		});
	});
}
