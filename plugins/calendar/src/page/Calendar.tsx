import { Fragment, h } from 'preact';
import { hydrate, useHydrated } from 'hydrated';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import Row from './calendar/Row';
import VirtualScroll from '../common/VirtualScroll';
import { CalendarEvent } from '../server/Database';

const identifier = 'calendar:calendar';

const MONTH = [ 'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December' ];

function getWeekDate(start: number, offset: number) {
	const date = new Date(start);
	date.setDate(date.getDate() + offset * 7);
	return date;
}

interface Props {
	maxEventsPerDay?: number;
	calendars: number[];
}

const SCROLL_WEEK_INTERVAL = 3;
const BUFFER_WEEKS = 6;

function RawCalendar(props: Props) {
	const hydrated = useHydrated();
	const [ events, setEvents ] = useState<CalendarEvent[]>([]);
	const lastQueriedDate = useRef<Date>(new Date());
	const refreshAbortController = useRef<AbortController>(new AbortController());

	const start = useMemo(() => {
		const now = new Date();
		const date = new Date(now.getFullYear(), now.getMonth(), 0);
		date.setDate(date.getDate() - date.getDay());
		return +date;
	}, []);

	async function refreshEvents(date: Date, calendars: number[]) {
		console.log('events are refreshing');
		if (calendars.length === 0) return;

		const from = Math.floor(+date) - 1000 * 60 * 60 * 24 * 7 * BUFFER_WEEKS;
		const to = Math.floor(+date) + 1000 * 60 * 60 * 24 * 7 * BUFFER_WEEKS * 2;

		refreshAbortController.current.abort();
		const controller = new AbortController();
		refreshAbortController.current = controller;

		const res = await fetch(`/api/calendar/events?from=${encodeURIComponent(from)}&to=${
			encodeURIComponent(to)}&calendars=${encodeURIComponent(calendars.join(','))}`, {
				signal: controller.signal,
				method: 'GET',
				cache: 'no-cache'
		});

		if (controller.signal.aborted) return;
		const json = await res.json();

		if (controller.signal.aborted) return;
		setEvents(json.events);
	}

	useEffect(() => {
		const date = new Date();
		lastQueriedDate.current = date;
		refreshEvents(date, props.calendars);
	}, [ props.calendars ]);

	const [ current, setCurrent ] = useState(start);
	const [ viewOffset, setViewOffset ] = useState(0);

	const handleNext = () => {
		const currentDate = new Date(current);
		const nextStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
		nextStart.setDate(nextStart.getDate() - nextStart.getDay());

		const diff = +nextStart - current;
		const diffWeeks = Math.round(diff / (1000 * 60 * 60 * 24 * 7) + 1);
		console.log(nextStart, diffWeeks);
		setViewOffset(v => v + diffWeeks);
	}

	const handlePrevious = () => {
		const currentDate = new Date(current);
		const nextStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
		nextStart.setDate(nextStart.getDate() - nextStart.getDay());

		const diff = +nextStart - current;
		const diffWeeks = Math.round(diff / (1000 * 60 * 60 * 24 * 7) + 1);
		console.log(nextStart, diffWeeks);
		setViewOffset(v => v + diffWeeks);
	}

	const handleScroll = (i: number) => {
		const date = getWeekDate(start, i);
		setCurrent(+getWeekDate(start, i + 1));

		const diff = Math.abs(+lastQueriedDate.current - +date);
		if (diff >= 1000 * 60 * 60 * 24 * 7 * SCROLL_WEEK_INTERVAL) {
			lastQueriedDate.current = date;
			refreshEvents(date, props.calendars);
		}
	}

	return (
		<div class={identifier}>
			<div class='page_header'>
				<span class='month'>{MONTH[new Date(current).getMonth()]}</span>
				<span class='year'>{new Date(current).getFullYear()}</span>

				{hydrated && <Fragment>
					<button class='page_button previous' onClick={handlePrevious}>Previous Month</button>
					<button class='page_button next' onClick={handleNext}>Next Month</button>
				</Fragment>}

			</div>
			<div class='weekday_header'>
				<span>Sunday</span>
				<span>Monday</span>
				<span>Tuesday</span>
				<span>Wednesday</span>
				<span>Thursday</span>
				<span>Friday</span>
				<span>Saturday</span>
			</div>
			<div class='page'>
				<VirtualScroll
					snap
					position={viewOffset}
					minRow={0}
					onScroll={handleScroll}
					itemHeight={100}
					>
					{(i) => {
						if (i === -1) {
							return <div style={{ height: '100px', padding: '32px', textAlign: 'center', color: '#333' }}>
								<p>Testing testing 123</p>
							</div>
						}

						return <Row
							start={getWeekDate(start, i)}
							maxEventsPerDay={props.maxEventsPerDay ?? 4}
							height={100}
							events={events}
							onClickEvent={() => {/**/}}
						/>
					}}
				</VirtualScroll>
			</div>
		</div>
	)
}

const Calendar = hydrate(identifier, RawCalendar);

export default { identifier, component: Calendar };
