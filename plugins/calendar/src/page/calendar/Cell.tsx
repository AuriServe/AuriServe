import { h } from 'preact';

import CellEvent from './CellEvent';

import { PopulatedEvent, Calendar } from '../../common/Calendar';

export const Placeholder = Symbol('placeholder');

function isSameDate(a: Date, b: Date) {
	return a.getDate() === b.getDate() &&
		a.getMonth() === b.getMonth() &&
		a.getFullYear() === b.getFullYear();
}

interface Props {
	date: Date;
	calendar: Calendar;
	events: (PopulatedEvent | typeof Placeholder)[];

	onClickEvent?: (event: PopulatedEvent) => void;
}

export default function Cell(props: Props) {
	// const dark = props.date.getMonth() % 2 === 0;
	const isCurrentDate = isSameDate(props.date, new Date());

	const eventElements = [];
	for (const event of props.events.slice(0, 3)) {
		if (!event || event === Placeholder) {
			eventElements.push(<div class='placeholder'/>);
			continue;
		}

		eventElements.push(
			<CellEvent
			event={event}
			key={event.uid}
				date={props.date}
				categories={props.calendar.categories}
				onClick={() => props.onClickEvent?.(event)}
			/>
		);
	}

	return (
		<div class='cell'>
			<p class={`date ${isCurrentDate && 'current'}`}>{props.date.getDate()}</p>
			{eventElements}
			{props.events.length > 3 && <p class='more_indicator'>+{props.events.length - 3} more</p>}
		</div>
	);
}
