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
}

export interface PopulatedEvent extends Event {
	dates: number[];
	last: number;
}

/**
 * Auriserve Calendar Object
 */

export interface Calendar {
	title?: string;
	events: Event[];
}

export interface PopulatedCalendar {
	title?: string;
	events: PopulatedEvent[];
}
