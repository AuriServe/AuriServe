import path from 'path';
import assert, { AssertionError } from 'assert';
import auriserve, { router } from 'auriserve';
import { gqlResolver as resolver, extendGQLSchema } from 'dashboard';
import { addElement, removeElement, addStylesheet, removeStylesheet } from 'elements';
import * as Database from './Database';
// import { parseICAL } from './LoadCalendar';

// const calendars = [ 'birthdays', 'calendar', 'classes', 'testing' ];
// const calendars = [ [ 'maxcameron', 'Max Cameron' ], [ 'testing', 'Test Calendar' ], [ 'calendar', 'Personal' ] ];

// calendars.forEach(async ([ name ]) => {
// 	// fs.writeFile(path.join(dataPath, `${name}.acal.json`), JSON.stringify(calendar, null, 2));
// });
// parseICAL(path.join(dataPath, `classes.ics`)).then(r => console.log(r));
// console.log(calendar);


// extend type Mutation {
// 	calendar(name: String!, calendar: String!): Boolean
		// calendar(name: String!): String,
// }

extendGQLSchema(`
	type CalendarEvent {
		id: Int!
		cal: Int!
		uid: String!
		type: String!

		start: Float!
		end: Float!
		rrule: String
		rend: Float
		timezone: Int

		title: String
		description: String
		location: String
	}

	type CalendarQueryAPI {
		calendars: [[String!]!]!
	}

	type CalendarMutationAPI {
		_nothing: Boolean
	}

	extend type Query { calendar: CalendarQueryAPI! }
	extend type Mutation { calendar: CalendarMutationAPI! }

`);

resolver.calendar = {};

resolver.calendar.calendars = () =>
	[ ...Database.getCalendars().entries() ].map(([ id, name ]) => [ id.toString(), name ]);

const handlers = [
	router.post('/dashboard/calendar/import', async (req, res) => {
		try {
			const token = req.headers.token as string;
			assert(token && typeof token === 'string', 'Missing required information.');
			getUser(token);
			assert(typeof req.body.name === 'string', 'Name is required.');
			assert((req as any).files.calendar, 'Calendar is required.');

			const calendar = await parseICAL((req as any).files.calendar!.tempFilePath);
			const id = Database.addCalendar({ name: req.body.name });

			const timezoneIDs: Record<string, number> = {};

			for (const tz of Object.values(calendar.timezones))
				timezoneIDs[tz.tzid] = Database.addTimezone({ ...tz, cal: id });

			for (const event of Object.values(calendar.events)) Database.addEvent({
				...event,
				cal: id,
				timezone: event.timezone ? timezoneIDs[event.timezone] : null,
			});

			return res.status(200).send(id.toString());
		}
		catch (e) {
			console.error(e);
			res.status(400).send((e as any).toString());
		}
	}),
	router.get('/api/calendar/events', async (req, res) => {
		try {
			const calendars = req.query.calendars.split(',').map((s) => Number.parseInt(s, 10));
			assert(calendars.length && calendars.findIndex(c => Number.isNaN(c)) === -1, '`calendars` param required.');

			const from = Number.parseInt(req.query.from, 10);
			assert(!Number.isNaN(from), '`from` param required.');

			const to = Number.parseInt(req.query.to, 10);
			assert(!Number.isNaN(to), '`to` param required.');

			assert(from < to, '`from` must be before `to`.');
			assert(to - from <= 1000 * 60 * 60 * 24 * 365, 'Range must be <= 1 year.')

			const events = Database.getEventsInRange(calendars, from, to);
			res.status(200).send(JSON.stringify({ events }));
		}
		catch (e) {
			if (e instanceof AssertionError) {
				res.status(400).send(JSON.stringify({ error: e.message }));
			}
			else {
				res.sendStatus(500);
			}
		}
	})
]

auriserve.once('cleanup', () => {
	handlers.forEach((handler) => router.remove(handler));
});



// resolver.calendar = ({ name, calendar }: { name: string, calendar: string | undefined }) => {
// 	// if (calendar === undefined) {
// 	// 	return fs.readFile(path.join(auriserve.dataPath, `${name}.acal.json`), 'utf8');
// 	// }

// 	// try {
// 	// 	fs.writeFile(path.join(auriserve.dataPath, `${name}.acal.json`), calendar);
// 	// 	return true;
// 	// }
// 	// catch (e) {
// 	// 	return false;
// 	// }
// };

// gqlResolver.calendars = calendars;

import '../page/Style.pcss';
import * as Elements from '../page';
import { parseICAL } from './ICal';
import { getUser } from 'users';

const styles = path.join(__dirname, 'style.css');
addStylesheet(styles);

Object.values(Elements).forEach((elem) => addElement(elem));
auriserve.once('cleanup', () => {
	Object.values(Elements).forEach((elem) => removeElement(elem.identifier));
	removeStylesheet(styles);
});
