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

/**
 * Removes populated details from an ACAL.
 */

export function unpopulateACAL(calendar: PopulatedCalendar): Calendar {
	const cal: Calendar = JSON.parse(JSON.stringify(calendar));

	for (const key of Object.keys(cal.events)) {
		const event = cal.events[key];
		delete (event as Partial<PopulatedEvent>).dates;
		delete (event as Partial<PopulatedEvent>).last;
	}

	return cal;
}
