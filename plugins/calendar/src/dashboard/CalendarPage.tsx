import { h } from 'preact';
import { useContext, useEffect, useLayoutEffect, useState } from 'preact/hooks';
import { tw, executeQuery, AppContext, Button, Icon, Form, Field } from 'dashboard';

import { PopulatedCalendar } from '../common/Calendar';
import { populateACAL } from './PopulateCalendar';

import MonthView from './MonthView';

export default function CalendarPage() {
	const app = useContext(AppContext);
	useLayoutEffect(() => (app.setHijackScrollbar(false), () => app.setHijackScrollbar(true)));

	const [ calendar, setCalendar ] = useState<PopulatedCalendar | null>(null);

	useEffect(() => {
		(async () => {
			const calendar = JSON.parse(
				(await executeQuery('query($name: String!) { calendar(name: $name) }', { name: 'calendar' })).calendar);
			setCalendar(populateACAL(calendar));
		})();
	}, []);

	// const calendars = new Map([ [ 'personal', 'Personal' ], [ 'events', 'Events' ], [ 'home_page', 'Home Page' ] ]);

	return (
		<div class={tw`flex -mb-14`}>
			<div class={tw`shrink-0 w-80 p-4 pt-5 bg-gray-800 rounded-r-xl shadow-md relative z-10`}>
				<Form value={{ calendar: 'personal' }}>
					<p class={tw`text-(xs gray-200) tracking-widest font-bold`}>CALENDAR</p>
					{/* <div class={tw`flex gap-2 mt-1.5`}>
						<Field.Option hideLabel path='calendar' options={calendars}/>
						<Button.Secondary icon={Icon.add} iconOnly class={tw`shrink-0`}/>
					</div> */}
				</Form>

			</div>
			<div class={tw`grow flex-(& col)`}>
				{calendar && <MonthView calendar={calendar}/>}
			</div>
		</div>
	);
}
