import { h } from 'preact';

import { PopulatedEvent, Category } from '../../common/Calendar';

interface Props {
	date: Date;
	event: PopulatedEvent;
	categories: Record<string, Category>;

	onClick: () => void;
}

function cellProps(event: PopulatedEvent, start: Date): { extendLeft: boolean, extendRight: boolean, length: number } {
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
	const time = startDate.getHours() === 0 && startDate.getMinutes() === 0 ? '' :
		startDate.toLocaleTimeString('en-us', { timeStyle: 'short' }).toLowerCase().replace(' ', '');

	const { extendLeft, extendRight, length } = cellProps(props.event, props.date);

	return (
		<button
			onClick={handleClick}
			class={`event ${extendLeft && 'extend_left'} ${extendRight && 'extend_right'}`}
			style={{ '--length': length }}>

			{/* <div class={tw`relative z-10 w-2 h-2 shrink-0 ring-(& ${props.active ? 'accent-300/25' : 'accent-400/25'})
				bg-${props.active ? 'accent-300' : 'accent-400'} rounded-full mr-1`}/> */}

			{time && <p class='time'>{time}</p>}
			<p class='title'>{props.event.title || '(Untitled)'}</p>
		</button>
	);
}
