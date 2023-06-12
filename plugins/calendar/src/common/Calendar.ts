/**
 * A calendar event that can be serialized into a JSON format.
 */

 export interface Event {
	uid: string;
	start: number;
	end: number;

	title?: string;
	description?: string;
	category: string;

	location?: string;
	rrule?: string;
}

// Events

// id   -- primary key
// cal  \ -- foreign key
// uid  // unique index

// start
// end
// rrule

// title
// description

// EventCategories

// id -- primary foreign key \
// cat -- foreign key        // unique index

// Categories

// id -- primary key
// cal -- foreign key

// name
// color

// Calendars

// id -- primary key
// name
// description



export interface PopulatedEvent extends Event {
	dates: number[];
	last: number;
}

export interface Category {
	uid: string;
	name: string;
	color: string;
}

/**
 * Auriserve Calendar Object
 */

export interface Calendar {
	title?: string;
	events: Record<string, Event>;
	categories: Record<string, Category>;
}

export interface PopulatedCalendar {
	title?: string;
	events: Record<string, PopulatedEvent>;
	categories: Record<string, Category & { enabled: boolean }>;
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
