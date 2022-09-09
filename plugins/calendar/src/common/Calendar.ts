import fs from 'fs';
import { once } from 'events';
import { assert } from 'common';
import readline from 'readline';
import { rrulestr } from 'rrule';

/**
 * Converts a date from funky ICAL format into a JS unix timestamp.
 * @param date - ICAL formatted date.
 * @returns a unix timestamp (with milliseconds).
 */

function parseDate(date: string) {
	const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/gm.exec(date)!;
	return Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6]);
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
 * A calendar event that can be serialized into a JSON format.
 */

export interface Event {
	uid: string;
	start: number;
	end: number;
	title?: string;
	description?: string;
	location?: string;
	rrule?: string;

	// Recurrence dates.
	dates?: number[];

	// Last instance of the recurring event.
	last?: number;
}

/**
 * Auriserve Calendar Object
 */

export interface Calendar {
	title?: string;
	events: Event[];
}

/**
 * Parses an ICAL file into a ACAL formatted Javascript object.
 * @param calPath - The path to the ICAL file.
 * @returns a promise that resolves to the parsed calendar.
 */

export function parseICAL(calPath: string): Promise<Calendar> {
	const fileStream = fs.createReadStream(calPath);
	const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

	const events: Event[] = [];

	/**
	 * Skips an unknown block of lines, from the current line
	 * (starting with BEGIN:) to the matching end line.
	 * Returns to the delegator when the end line is reached.
	 */

	function* skipBlock(): any {
		const { value } = parseLine(yield);
		console.warn(`Skipping '${value}' block.`);
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
		}
	}

	/*
	 * Parses a calendar event block.
	 */

	function* parseCalEvent(): any {
		let line: string = yield;
		assert(line === 'BEGIN:VEVENT', 'Expected BEGIN:VEVENT');

		let uid: string | undefined;
		let start: number | undefined;
		let end: number | undefined;
		let title: string | undefined;
		let description: string | undefined;
		let location: string | undefined;
		let rrule: string | undefined;

		while (true) {
			line = yield;
			const { key, type, typeValue, value } = parseLine(line);

			switch (key) {
				case 'UID':
					uid = value;
					break;
				case 'DTSTART':
					switch (type) {
					case undefined:
					case 'TZID':
						start = parseDate(value);
						break;
					case 'VALUE':
						assert(typeValue === 'DATE', 'Unknown DTSTART type');
						start = parseDate(`${value}T000000Z`);
					}
					break;
				case 'DTEND':
					switch (type) {
					case undefined:
					case 'TZID':
						end = parseDate(value);
						break;
					case 'VALUE':
						assert(typeValue === 'DATE', 'Unknown DTEND type');
						end = parseDate(`${value}T000000Z`);
					}
					break;
				case 'RRULE':
					rrule = value;
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
				assert(uid != null && start != null && end != null, 'Missing required fields.');
				events.push({ uid, start, end, title, description, location, rrule });
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

			if (line.startsWith('BEGIN:VEVENT')) {
				assert(foundVersion, 'Expected VERSION:2.0 before BEGIN:VEVENT');
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

			resolve({ events });
		});
	});
}

/**
 * Populates an ACAL object with recurrence information.
 *
 * @param calendar The ACAL object to populate.
 */

export function populateACAL(calendar: Calendar) {
	for (const event of calendar.events) {
		if (!event.rrule) continue;

		event.dates = [...rrulestr(event.rrule, { dtstart: new Date(event.start) })
			.between(new Date(0), new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2))]
			.map(date => +date);
		event.last = event.dates[event.dates.length - 1] + (event.end - event.start);
	}
}
