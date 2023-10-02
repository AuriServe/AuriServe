import { h } from 'preact';
import { tw } from 'dashboard';

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
	activeEvent?: string;
	events: (CalendarEvent | typeof Placeholder)[];

	onClickCell?: (date: Date) => void;
	onClickEvent?: (event: CalendarEvent) => void;
}

export default function Cell(props: Props) {
	const dark = props.date.getMonth() % 2 === 0;
	const isCurrentDate = isSameDate(props.date, new Date());

	const eventElements = [];
	for (const event of props.events.slice(0, 4)) {
		if (!event || event === Placeholder) {
			eventElements.push(<div class={tw`h-7`}/>);
			continue;
		}

		eventElements.push(
			<CellEvent
				key={event.uid}
				active={props.activeEvent === event.uid}
				event={event}
				date={props.date}
				onClick={() => props.onClickEvent?.(event)}
			/>
		);
	}

	return (
		<button class={tw`relative rounded-md p-1.5 pt-8 flex-(& col)
			${dark ? 'bg-gray-800/[55%]' : 'bg-gray-800/30'}`}
			onClick={() => props.onClickCell?.(props.date)}>

			<p class={tw`absolute top-1.5 left-1.5 w-5 h-5 mr-auto pt-[3px] text-gray-100 text-center font-bold text-xs
				${isCurrentDate && `rounded-full bg-accent-400 text-gray-900 ring-(& accent-500/25 offset-gray-900)`}`}>
				{props.date.getDate()}
			</p>

			{eventElements}

			{props.events.length > 4 && <p class={tw`text-gray-300 text-xs font-bold pt-1`}>
				+{props.events.length - 4} more
			</p>}
		</button>
	);
}
