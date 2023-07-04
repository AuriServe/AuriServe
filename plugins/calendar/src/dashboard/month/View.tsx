import { h } from 'preact';
import { tw, Svg, Icon } from 'dashboard';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import Row from './Row';
import VirtualScroll from '../../common/VirtualScroll';
import { CalendarEvent } from '../../server/Database';

const MONTH = [ 'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December' ];

interface Props {
	events: CalendarEvent[];
	activeEvent?: string;

	onSave?: () => void;
	onScroll?: (i: number, date: Date) => void;
	onClickCell?: (date: Date) => void;
	onClickEvent?: (event: CalendarEvent) => void;
}

function getWeekDate(start: number, offset: number) {
	const date = new Date(start);
	date.setDate(date.getDate() + offset * 7);
	return date;
}

export default function MonthView(props: Props) {
	const viewRef = useRef<HTMLDivElement>(null);

	const [ containerHeight, setContainerHeight ] = useState(0);

	const start = useMemo(() => {
		const now = new Date();
		const date = new Date(now.getFullYear(), now.getMonth(), 0);
		date.setDate(date.getDate() - date.getDay());
		return +date;
	}, []);

	const [ current, setCurrent ] = useState(start);

	useEffect(() => {
		const elem = viewRef.current;
		if (!elem) return;

		setContainerHeight(elem.clientHeight - elem.children[0].clientHeight);
	}, []);

	function handleScroll(i: number) {
		props.onScroll?.(i, getWeekDate(start, i));
		setCurrent(+getWeekDate(start, i + 1));
	}

	const cellHeight = Math.floor(containerHeight / 5);

	return (
		<div ref={viewRef} class={tw`grow flex-(& col) h-full`}>
			<div class={tw`shrink-0 flex justify-between items-center px-2 py-3`}>
				<div class={tw`flex items-center`}>
					<Svg src={Icon.calendar} size={6}/>
					<h2 class={tw`text-xl leading-none font-medium ml-2 my-1.5`}>
						{MONTH[new Date(current).getMonth()]} {new Date(current).getFullYear()}
					</h2>
				</div>
			</div>
			<div class={tw`relative grow grid h-full overflow-hidden group rounded-lg isolate max-h-[${cellHeight * 5}px]`}>
				{cellHeight !== 0 &&
					<VirtualScroll
						snap
						itemHeight={cellHeight}
						minRow={-Infinity}
						onScroll={handleScroll}
						position={0}
						class={tw`p-2 pt-0`}>
						{(i) => {
							const date = +getWeekDate(start, i);
							return (
								<Row
									key={date}
									start={date}
									height={cellHeight - 6}
									events={props.events}
									activeEvent={props.activeEvent}
									onClickCell={props.onClickCell}
									onClickEvent={props.onClickEvent}
								/>
							);
						}}
					</VirtualScroll>
				}
				<div aria-hidden class={tw`absolute top-0 left-2 right-2 grid-(& cols-7) interact-none`}>
					{[ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ].map(day =>
						<p key={day} class={tw`mt-2 ml-10 pt-px text-gray-300 font-bold text-xs uppercase tracking-widest`}>
							{day}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
