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
		startDate.toLocaleTimeString('en-us', { timeStyle: 'short' }).toLowerCase().replace(' ', '')
		.replace(/:00([ap]m)/, '$1');
	// if (time.endsWith(':00')) time = time.slice(0, -3);

	const { extendLeft, extendRight, length } = cellProps(props.event, props.date);

	if (time === '' || (new Date(props.event.end).getDate() !== startDate.getDate() &&
		new Date(props.event.end).getHours() >= 12)) {

		return (
			<button
				onClick={handleClick}
				class={tw`relative rounded py-[5px] pr-2.5 flex items-center gap-1.5 z-10 transition duration-75 cursor-pointer mb-0.5
					${props.active
						? 'shadow-lg bg-gray-600 text-gray-50'
						: 'shadow-md bg-gray-(750 hover:700) text-gray-(100 hover:50)'}`}
				style={{
					width: `calc(${length} * (100% + 10px) + ${length - 1 + (extendLeft ? 2.5 : 0)
						+ (extendRight ? 2.5 : 0)} * 8px - 10px`,
					left: extendLeft ? '-1.25rem' : undefined,
					paddingLeft: extendLeft ? '1.875rem' : '0.625rem',
				}}>

				<div class={tw`relative z-10 w-2 h-2 -ml-0.5 shrink-0 bg-accent-300 ring-(& [2.5px] accent-400/50) rounded-full mr-[3px]`}/>

				{time && <p class={tw`relative z-10 text-xs pt-px -mb-px ${props.active ? 'text-gray-100' : 'text-accent-200'}`}>
					{time}
				</p>}
				<p class={tw`truncate text-xs pt-px -mb-px font-bold relative z-10 text-accent-50/90`}>{props.event.title || '(Untitled)'}</p>

				<div class={tw`absolute w-32 h-full left-0 rounded-l bg-gradient-to-r to-transparent interact-none
					from-accent-400/30 via-accent-500/10 z-0`}
				/>
			</button>
		);
	}

	return (
		<button
			onClick={handleClick}
			class={tw`relative rounded p-2.5 pl-2 py-[5px] flex items-center gap-1 z-10 transition duration-75 cursor-pointer hover:bg-gray-700/50 mb-0.5
				${props.active ? 'text-gray-50' : 'text-gray-(100 hover:50)'}`}
			style={{ width: `calc(${length} * (100% + 10px) + ${length - 1 + (extendLeft ? 2.5 : 0)
				+ (extendRight ? 2.5 : 0)} * 8px - 10px` }}>

			<div class={tw`relative z-10 w-2 h-2 shrink-0
					bg-${props.active ? 'accent-300' : 'accent-400'} rounded-full mr-1`}/>

			{time && <p class={tw`relative z-10 text-xs pt-px -mb-px mr-0.5
				${props.active ? 'text-gray-100' : 'text-accent-300'}`}>
				{time}
			</p>}

			<p class={tw`truncate text-xs pt-px -mb-px font-medium text-gray-100/90`}>{props.event.title || '(Untitled)'}</p>

			{/* <div class={tw`absolute w-12 h-full left-0 rounded-l bg-gradient-to-r to-transparent interact-none
				from-accent-400/10 via-accent-400/5`}
			/> */}
		</button>
	)


}
