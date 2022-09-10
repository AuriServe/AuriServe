import { rrulestr } from 'rrule';

import { Calendar, PopulatedCalendar } from '../common/Calendar';

/**
 * Populates an ACAL object with recurrence information.
 *
 * @param calendar The ACAL object to populate.
 */

export function populateACAL(calendar: Calendar): PopulatedCalendar {
	const cal: PopulatedCalendar = JSON.parse(JSON.stringify(calendar));

	for (const event of cal.events) {
		if (event.rrule) {
			event.dates = [...rrulestr(event.rrule, { dtstart: new Date(event.start) })
				.between(new Date(0), new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2))]
				.map(date => +date);
		}
		else {
			event.dates = [ event.start ];
		}

		event.last = event.dates[event.dates.length - 1] + (event.end - event.start);
	}

	return cal;
}

export function getEventsInRange(calendar: PopulatedCalendar, start: number, end: number): Event[] {
	const events: Event[] = [];

	calendar.events.forEach((event) => {
		if (event.last >= start && event.start <= end) {
			event.dates.forEach((date) => {
				if (date + (event.end - event.start) >= start && date <= end) {
					const instance = { ...event } as any;
					delete instance.dates;
					delete instance.last;
					instance.start = date;
					instance.end = date + (event.end - event.start);
					events.push(instance);
				}
			})
		}
	});

	return events;
}
