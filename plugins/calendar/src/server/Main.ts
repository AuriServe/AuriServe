import path from 'path';
import { promises as fs } from 'fs';
import { dataPath } from 'auriserve';

import { parseICAL, populateACAL } from '../common/Calendar';


parseICAL(path.join(dataPath, 'birthdays.ics')).then(calendar => {
	populateACAL(calendar);
	fs.writeFile(path.join(dataPath, 'birthdays.acal.json'), JSON.stringify(calendar, null, 2));
});

parseICAL(path.join(dataPath, 'calendar.ics')).then(calendar => {
	populateACAL(calendar);
	fs.writeFile(path.join(dataPath, 'calendar.acal.json'), JSON.stringify(calendar, null, 2));
});

// (async () => {()
// 	const calPath = path.join(dataPath, 'cal.ics');

// 	const calFile = await fs.readFile(calPath, 'utf8');

// 	const cal = ical.parseICS(calFile);

// 	await fs.writeFile(path.join(dataPath, 'cal.json'), JSON.stringify(cal, null, 2));

// 	console.log(cal['ccq3cd9p6os36b9pc4pjcb9kchh30b9oc9j36b9k64sj4dj475gj2e35cg@google.com']);
// })();
