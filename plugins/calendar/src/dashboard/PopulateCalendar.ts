import { rrulestr } from 'rrule';

import { Calendar, PopulatedCalendar, Event, PopulatedEvent } from '../common/Calendar';

export function populateEvent(event: Event): PopulatedEvent {
	const popEvent = { ...event } as PopulatedEvent;

	if (popEvent.rrule) popEvent.dates =
		[ ...rrulestr(popEvent.rrule, { dtstart: new Date(event.start) })
			.between(new Date(0), new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2)) ]
			.map(date => +date);
	else popEvent.dates = [ event.start ];

	popEvent.last = popEvent.dates[popEvent.dates.length - 1] + (popEvent.end - popEvent.start);
	return popEvent;
}

/**
 * Populates an ACAL object with recurrence information.
 *
 * @param calendar The ACAL object to populate.
 */

export function populateACAL(calendar: Calendar): PopulatedCalendar {
	const cal: PopulatedCalendar = JSON.parse(JSON.stringify(calendar));

	for (const key of Object.keys(cal.events)) cal.events[key] = populateEvent(cal.events[key]);
	for (const category in cal.categories) cal.categories[category].enabled = true;

	return cal;
}

export function getEventsInRange(calendar: PopulatedCalendar, start: number, end: number): PopulatedEvent[] {
	const events: PopulatedEvent[] = [];

	Object.values(calendar.events).forEach((event) => {
		if (event.last >= start && event.start <= end) {
			event.dates.forEach((date) => {
				if (date + (event.end - event.start) >= start && date <= end) {
					const instance = { ...event } as any;
					// delete instance.dates;
					// delete instance.last;
					instance.start = date;
					instance.end = date + (event.end - event.start);
					events.push(instance);
				}
			})
		}
	});

	return events;
}
