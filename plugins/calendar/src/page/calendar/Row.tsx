import { h } from 'preact';
import { useMemo } from 'preact/hooks';

import Cell, { Placeholder } from './Cell';

import { PopulatedCalendar, PopulatedEvent } from '../../common/Calendar';

interface Props {
	start: Date;
	height: number;
	calendar: PopulatedCalendar;

	onClickEvent?: (event: PopulatedEvent) => void;
}

function getDate(date: number) {
	const dateObj = new Date(date);
	dateObj.setHours(0, 0, 0, 0);
	return +dateObj;
}

export default function Row(props: Props) {
	const end = new Date(props.start.getFullYear(), props.start.getMonth(), props.start.getDate() + 6, 23, 59, 59, 999);

	const events = useMemo(() => Object.values(props.calendar.events)
		.filter((event) => event.end >= +props.start && event.start <= +end)
		.sort((a, b) => getDate(a.start) - getDate(b.start) || (
			getDate(b.end) - getDate(b.start)) - (getDate(a.end) - getDate(a.start)) ||
			(a.title ?? '').localeCompare(b.title ?? '')),
		[ +props.start, +end, props.calendar ]); // eslint-disable-line react-hooks/exhaustive-deps

	const eventMap: (PopulatedEvent | typeof Placeholder)[][] = [ [], [], [], [], [], [], [] ];

	for (const event of events) {
		const startDay = event.start < +props.start ? 0 : new Date(event.start).getDay();
		const endDay = event.end > +end ? 6 : new Date(event.end).getDay();

		let row = 0;
		let found = null;

		loop:
		while (found == null) {
			for (let i = startDay; i <= endDay; i++) {
				if (eventMap[i][row]) {
					row++;
					continue loop;
				};
			}
			found = row;
		}

		eventMap[startDay][row] = event;
		for (let i = startDay + 1; i <= endDay; i++) {
			eventMap[i][row] = Placeholder;
		}
	}

	let date = new Date(props.start);

	const cells = [];
	while (date <= end) {
		cells.push(<Cell
			date={date}
			calendar={props.calendar}
			events={eventMap[date.getDay()]}
			onClickEvent={props.onClickEvent}
		/>);
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		date = newDate;
	}

	return (
		<div class='row' style={{ height: props.height }}>
			{cells}
		</div>
	);
}
