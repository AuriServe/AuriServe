import path from 'path';
import { promises as fs } from 'fs';
import { dataPath } from 'auriserve';
import { gqlResolver, extendGQLSchema } from 'dashboard';

import { parseICAL } from './LoadCalendar';

// const calendars = [ 'birthdays', 'calendar', 'classes', 'testing' ];
const calendars = [ [ 'maxcameron', 'Max Cameron' ], [ 'testing', 'Test Calendar' ], [ 'calendar', 'Personal' ] ];

// calendars.forEach(async ([ name ]) => {
// 	const calendar = await parseICAL(path.join(dataPath, `${name}.ics`));
// 	fs.writeFile(path.join(dataPath, `${name}.acal.json`), JSON.stringify(calendar, null, 2));
// });

extendGQLSchema(`
	extend type Query {
		calendar(name: String!): String,
		calendars: [[String!]!]!,
	}
`);

gqlResolver.calendar = ({ name }: { name: string }) => {
	return fs.readFile(path.join(dataPath, `${name}.acal.json`), 'utf8');
};

gqlResolver.calendars = calendars;
