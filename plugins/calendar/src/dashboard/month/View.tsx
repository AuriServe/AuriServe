import { h } from 'preact';
import { tw, Svg, Icon, Button } from 'dashboard';
import { useEffect, useRef, useState } from 'preact/hooks';

import Row from './Row';
import { PopulatedCalendar, PopulatedEvent } from '../../common/Calendar';

const MONTH = [ 'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December' ];

interface Props {
	calendar: PopulatedCalendar;
	activeEvent?: string;

	saved?: boolean;
	onSave?: () => void;

	onClickCell?: (date: Date) => void;
	onClickEvent?: (event: PopulatedEvent) => void;
}

export default function MonthView(props: Props) {
	const viewRef = useRef<HTMLDivElement>(null);

	const [ start, setStart ] = useState<Date>(() => {
		const now = new Date();
		const date = new Date(now.getFullYear(), now.getMonth(), 0);
		date.setDate(date.getDate() - date.getDay());
		return date;
	});

	const [ containerHeight, setContainerHeight ] = useState(0);

	useEffect(() => {
		const elem = viewRef.current;
		if (!elem) return;

		setContainerHeight(elem.clientHeight - elem.children[0].clientHeight);

		const onScroll = (evt: any) => {
			const dir = evt.deltaY > 0 ? 1 : -1;
			setStart(start => {
				const newStart = new Date(start);
				newStart.setDate(newStart.getDate() + dir * 7);
				return newStart;
			});
		}

		elem.addEventListener('wheel', onScroll);
		return () => elem.removeEventListener('wheel', onScroll);
	}, []);

	const headDate = new Date(start);
	headDate.setDate(headDate.getDate() + 6);

	const rows = [];
	const buffer = 6;

	const date = new Date(start);
	date.setDate(date.getDate() - buffer * 7);
	const end = new Date(start);
	end.setDate(end.getDate() + 7 * (5 + buffer) - 1);

	while (date < end) {
		rows.push(new Date(date));
		date.setDate(date.getDate() + 7);
	}

	const cellHeight = containerHeight / 5;

	return (
		<div ref={viewRef} class={tw`grow flex-(& col)`}>
			<div class={tw`shrink-0 flex justify-between items-center px-2 py-3`}>
				<div class={tw`flex items-center`}>
					<Svg src={Icon.calendar} size={6}/>
					<h2 class={tw`text-xl leading-none font-medium ml-2 my-1.5`}>
						{MONTH[headDate.getMonth()]} {headDate.getFullYear()}
					</h2>
				</div>
				{!props.saved && <div class={tw`flex gap-3`}>
					<p class={tw`text-gray-200 font-medium mt-1`}>You have unsaved changes.</p>
					<Button.Secondary small icon={Icon.save} label='Save' onClick={props.onSave}/>
				</div>}
			</div>
			<div class={tw`relative grow h-full overflow-hidden group rounded-lg isolate`}>
				{cellHeight !== 0 && rows.map((date) =>
					<div key={+date} class={tw`absolute w-full transition duration-150 px-2`} style={{
						transform: `translateY(${Math.floor((+date / 1000 / 60 / 60 / 24 / 7) -
							(+start / 1000 / 60 / 60 / 24 / 7)) * cellHeight}px)`
					}}>
						<Row
							start={date}
							height={cellHeight - 6}
							calendar={props.calendar}
							activeEvent={props.activeEvent}

							onClickCell={props.onClickCell}
							onClickEvent={props.onClickEvent}
						/>
					</div>
				)}
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
