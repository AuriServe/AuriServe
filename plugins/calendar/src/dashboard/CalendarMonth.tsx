import { h } from 'preact';
import { tw } from 'dashboard';
import { useMemo } from 'preact/hooks';

import { getEventsInRange } from './PopulateCalendar';
import { PopulatedCalendar, Event } from '../common/Calendar';

interface Props {
	month: number;
	year: number;

	calendar: PopulatedCalendar;
}

const WEEKDAYS = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

function isSameDate(a: Date, b: Date) {
	return a.getDate() === b.getDate() &&
		a.getMonth() === b.getMonth() &&
		a.getFullYear() === b.getFullYear();
}

// const EVENTS = [{
	// pageFirstDate.setMinutes(pageFirstDate.getMinutes() - pageFirstDate.getTimezoneOffset());
	// pageLastDate.setMinutes(pageLastDate.getMinutes() - pageLastDate.getTimezoneOffset());
	// currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
// 	title: 'At Your Service',
// 	theme: 'amber'
// }, {
// 	ind: 8,
// 	len: 1,
// 	title: 'Tiller\'s Folly',
// 	theme: 'amber'
// }, {
// 	ind: 16,
// 	len: 3,
// 	title: 'The Wardens'
// }, {
// 	ind: 16,
// 	len: 2,
// 	title: 'Early Morning Rain',
// 	theme: 'amber'
// }];

interface CalendarCellProps {
	cellDate: Date;
	currentDate: Date;
	pageMonth: number;

	events: Event[];

	inverted: boolean;
	showWeekday: boolean;
}

function CalendarCell(props: CalendarCellProps) {
	const isWithinMonth = props.cellDate.getMonth() === props.pageMonth - 1;
	const isCurrentDate = isSameDate(props.cellDate, props.currentDate);

	const dark = (props.inverted ? isWithinMonth : !isWithinMonth);

	const testDate = new Date(props.cellDate);
	// testDate.setMinutes(testDate.getMinutes() - testDate.getTimezoneOffset());

	const events = props.events.filter(evt => isSameDate(new Date(evt.start), testDate));

	for (const event of events) {
		if (event.title?.startsWith("Meeting with ") || event.title === 'Pay Rent!') {
			console.log(event.title, new Date(event.start));
		}
	}

	// if (props.cellDate.getDate() === 6) console.log(events);

	return (
		<div class={tw`relative rounded-md p-2 pt-9 flex-(& col) gap-2
			${dark ? 'bg-gray-800/30' : 'bg-gray-800/[55%]'}`}>

			<p class={tw`absolute top-2 left-2 w-5 h-5 mr-auto pt-px text-gray-100 text-center font-bold text-sm
				${isCurrentDate && `rounded-full bg-accent-400 text-gray-900 ring-(& accent-500/25 offset-gray-900)`}`}>
				{props.cellDate.getDate()}
			</p>

			{props.showWeekday && <p class={
				tw`absolute top-2.5 left-10 pt-px text-gray-300 font-bold text-xs uppercase tracking-widest`}>
				{WEEKDAYS[props.cellDate.getDay()]}
			</p>}

			{events.slice(0, 3).map(event => <div key={event.title} class={tw`
				bg-gray-750 rounded theme-${false ?? 'blue'} relative
				p-1 px-2.5 text-sm font-bold flex gap-2.5 items-center relative z-10 shadow-md text-accent-100
				hover:(bg-gray-700 text-accent-50) transition duration-75 cursor-pointer`}
				style={{ width: `calc(${1} * (100% + 14px) + ${0} * (8px) - 14px`}}>
				<div class={tw`w-2 h-2 shrink-0 ring-(& accent-400/25) bg-accent-400 rounded-full`}/>
				<p class={tw`truncate`}>{event.title}</p>
				<div class={tw`absolute w-16 h-full left-0 rounded-l bg-gradient-to-r from-accent-400/20 via-accent-400/5 to-transparent interact-none`}/>
			</div>)}
			{events.length > 3 && <p class={tw`text-gray-300 text-sm font-bold`}>+{events.length - 3} more</p>}
		</div>
	);
}

export default function CalendarMonth(props: Props) {
	const firstDayInMonth = new Date(props.year, props.month - 1, 1).getDay();
	const lastDayInMonth = new Date(props.year, props.month, 0).getDay();
	const lastDateInMonth = new Date(props.year, props.month, 0).getDate();

	const pageFirstDate = new Date(props.year, props.month - 1, 1 - firstDayInMonth);
	const pageLastDate = new Date(props.year, props.month - 1, lastDateInMonth + (6 - lastDayInMonth));

	const currentDate = new Date();

	let date = new Date(pageFirstDate);

	// TODO: Use UTC Dates
	const events = useMemo(() => getEventsInRange(props.calendar, +pageFirstDate, +pageLastDate),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ +pageFirstDate, +pageLastDate, props.calendar ]);

	const cells = [];
	while (date <= pageLastDate) {
		cells.push(<CalendarCell
			key={date.getTime()}
			cellDate={date}
			currentDate={currentDate}
			pageMonth={props.month}
			events={events}
			inverted={props.month % 2 === 0}
			showWeekday={cells.length < 7}
		/>);
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		date = newDate;
	}

	return (
		<div class={tw`bg-gray-900 grid-(& cols-7) auto-rows-fr gap-1.5 p-2 pt-0`}>
			{cells}
		</div>
	);
}
