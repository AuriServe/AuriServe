import { h } from 'preact';

import CellEvent from './CellEvent';

import { CalendarEvent } from '../../server/Database';

export const Placeholder = Symbol('placeholder');

function isSameDate(a: Date, b: Date) {
	return a.getDate() === b.getDate() &&
		a.getMonth() === b.getMonth() &&
		a.getFullYear() === b.getFullYear();
}

interface Props {
	date: Date;
	events: (CalendarEvent | typeof Placeholder)[];
	maxEventsPerDay: number;

	onClickEvent?: (event: CalendarEvent) => void;
}

export default function Cell(props: Props) {
	const dark = props.date.getMonth() % 2 === 0;
	const isCurrentDate = isSameDate(props.date, new Date());

	const eventElements = [];
	for (const event of props.events.slice(0, props.maxEventsPerDay)) {
		if (!event || event === Placeholder) {
			eventElements.push(<div class='placeholder'/>);
			continue;
		}

		eventElements.push(
			<CellEvent
				event={event}
				key={event.uid}
				date={props.date}
				onClick={() => props.onClickEvent?.(event)}
			/>
		);
	}

	return (
		<div class={`cell ${dark && 'dark'}`}>
			<p class={`date ${isCurrentDate && 'current'}`}>{props.date.getDate()}</p>
			{eventElements}
			{props.events.length > props.maxEventsPerDay && <p class='more_indicator'>
				<span class='sign'>+</span>
				<span class='amount'>{props.events.length - props.maxEventsPerDay}</span>
				<span class='suffix'> more</span>
			</p>}
		</div>
	);
}
