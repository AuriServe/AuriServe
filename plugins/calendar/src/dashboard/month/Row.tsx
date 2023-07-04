import { h } from 'preact';
import { tw } from 'dashboard';
import { useMemo } from 'preact/hooks';

import Cell, { Placeholder } from './Cell';

import { CalendarEvent } from '../../server/Database';

interface Props {
	start: number;
	height: number;
	events: CalendarEvent[];
	activeEvent?: string;

	onClickCell?: (date: Date) => void;
	onClickEvent?: (event: CalendarEvent) => void;
}

function getDate(date: number) {
	const dateObj = new Date(date);
	dateObj.setHours(0, 0, 0, 0);
	return +dateObj;
}

export default function Row(props: Props) {
	const start = useMemo(() => new Date(props.start), [ props.start ]);
	const end = useMemo(() => new Date(start.getFullYear(),
		start.getMonth(), start.getDate() + 6, 23, 59, 59, 999), [ start ]);

	const eventMap = useMemo(() => {
		const events = props.events
			.filter(evt => evt.end >= +start && evt.start <= +end)
			.sort((a, b) => getDate(a.start) - getDate(b.start) || (
				getDate(b.end) - getDate(b.start)) - (getDate(a.end) - getDate(a.start)) ||
				(a.title ?? '').localeCompare(b.title ?? ''));

		const eventMap: (CalendarEvent | typeof Placeholder)[][] = [ [], [], [], [], [], [], [] ];

		for (const event of events) {
			const startDay = event.start < +start ? 0 : new Date(event.start).getDay();
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

		return eventMap;
	}, [ start, end, props.events ]);

	let date = new Date(props.start);

	const cells = [];
	while (date <= end) {
		cells.push(<Cell
			date={date}
			events={eventMap[date.getDay()]}
			activeEvent={props.activeEvent}
			onClickCell={props.onClickCell}
			onClickEvent={props.onClickEvent}
		/>);
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		date = newDate;
	}

	return (
		<div class={tw`bg-gray-900 grid-(& cols-7) gap-1.5 px-2`}
			style={{ height: props.height }}>
			{cells}
		</div>
	);
}
