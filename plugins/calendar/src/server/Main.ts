import path from 'path';
import { promises as fs } from 'fs';
import auriserve from 'auriserve';
import { gqlResolver, extendGQLSchema } from 'dashboard';
import { addElement, removeElement, addStylesheet, removeStylesheet } from 'elements';

// import { parseICAL } from './LoadCalendar';

// const calendars = [ 'birthdays', 'calendar', 'classes', 'testing' ];
const calendars = [ [ 'maxcameron', 'Max Cameron' ], [ 'testing', 'Test Calendar' ], [ 'calendar', 'Personal' ] ];

// calendars.forEach(async ([ name ]) => {
// 	const calendar = await parseICAL(path.join(dataPath, `${name}.ics`));
// 	fs.writeFile(path.join(dataPath, `${name}.acal.json`), JSON.stringify(calendar, null, 2));
// });

extendGQLSchema(`
	extend type Query {
		calendar(name: String!): String,
		calendars: [[String!]!]!
	}

	extend type Mutation {
		calendar(name: String!, calendar: String!): Boolean
	}
`);

gqlResolver.calendar = ({ name, calendar }: { name: string, calendar: string | undefined }) => {
	if (calendar === undefined) {
		return fs.readFile(path.join(auriserve.dataPath, `${name}.acal.json`), 'utf8');
	}

	try {
		fs.writeFile(path.join(auriserve.dataPath, `${name}.acal.json`), calendar);
		return true;
	}
	catch (e) {
		return false;
	}
};

gqlResolver.calendars = calendars;

import '../page/Style.pcss';
import * as Elements from '../page';

const styles = path.join(__dirname, 'style.css');
addStylesheet(styles);

Object.values(Elements).forEach((elem) => addElement(elem));
auriserve.once('cleanup', () => {
	Object.values(Elements).forEach((elem) => removeElement(elem.identifier));
	removeStylesheet(styles);
});
