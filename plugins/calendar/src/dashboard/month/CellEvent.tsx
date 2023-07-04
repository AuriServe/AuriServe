import { h } from 'preact';
import { tw } from 'dashboard';

import { CalendarEvent } from '../../server/Database';

interface Props {
	date: Date;
	active: boolean;
	event: CalendarEvent;

	onClick: () => void;
}

function cellProps(event: CalendarEvent, start: Date): { extendLeft: boolean, extendRight: boolean, length: number } {
	const lengthRaw = Math.ceil((event.end - +start) / (1000 * 60 * 60 * 24));
	const extendRight = (lengthRaw > 7 - start.getDay());
	const extendLeft = event.start < +start;
	const length = Math.min(lengthRaw, 7 - start.getDay());
	return { extendLeft, extendRight, length };
}

export default function CellEvent(props: Props) {
	function handleClick(evt: MouseEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		props.onClick?.();
	}

	const startDate = new Date(props.event.start);
	const time = props.event.type === 'event-day' ? '' :
		startDate.toLocaleTimeString('en-us', { timeStyle: 'short' }).toLowerCase().replace(' ', '');

	const { extendLeft, extendRight, length } = cellProps(props.event, props.date);

	return (
		<button
			onClick={handleClick}
			class={tw`relative rounded py-1.5 pr-2.5 flex items-center gap-1.5 z-10 transition duration-75 cursor-pointer
				${props.active
					? 'shadow-lg bg-gray-600 text-gray-50'
					: 'shadow-md bg-gray-(750 hover:700) text-gray-(100 hover:50)'}`}
			style={{
				width: `calc(${length} * (100% + 10px) + ${length - 1 + (extendLeft ? 2.5 : 0)
					+ (extendRight ? 2.5 : 0)} * 8px - 10px`,
				left: extendLeft ? '-1.25rem' : undefined,
				paddingLeft: extendLeft ? '1.875rem' : '0.625rem',
			}}>

			<div class={tw`relative z-10 w-2 h-2 shrink-0 ring-(& ${props.active ? 'accent-300/25' : 'accent-400/25'})
				bg-${props.active ? 'accent-300' : 'accent-400'} rounded-full mr-1`}/>

			{time && <p class={tw`relative z-10 text-xs pt-px -mb-px ${props.active ? 'text-gray-100' : 'text-accent-200'}`}>
				{time}
			</p>}
			<p class={tw`truncate text-xs pt-px -mb-px font-bold`}>{props.event.title || '(Untitled)'}</p>

			<div class={tw`absolute w-16 h-full left-0 rounded-l bg-gradient-to-r to-transparent interact-none
				from-accent-400/20 via-accent-400/5`}
			/>
		</button>
	);
}
