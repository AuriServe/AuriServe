import { h } from 'preact';
import { hydrate } from 'hydrated';
import { useMemo } from 'preact/hooks';

import Row from './calendar/Row';
import VirtualScroll from '../common/VirtualScroll';

import { PopulatedCalendar } from '../common/Calendar';

const identifier = 'calendar:calendar';

const MONTH = [ 'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December' ];

function getWeekDate(start: number, offset: number) {
	const date = new Date(start);
	date.setDate(date.getDate() + offset * 7);
	return date;
}

interface Props {
	calendar: string;
}

function RawCalendar(_props: Props) {
	const calendar: PopulatedCalendar = { events: {}, categories: {} };

	const start = useMemo(() => {
		const now = new Date();
		const date = new Date(now.getFullYear(), now.getMonth(), 0);
		date.setDate(date.getDate() - date.getDay());
		return +date;
	}, []);

	return (
		<div class={identifier}>
			<div class='page_header'>
				<span class='month'>May</span>
				<span class='year'>2025</span>
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
					itemHeight={100} snap
					// onScroll={(i) => setCurrent(+getWeekDate(start, i + 1))}
					>
					{(i) =>
						<Row
							start={getWeekDate(start, i)}
							height={100}
							calendar={calendar}
							onClickEvent={() => {/**/}}
						/>
					}
				</VirtualScroll>
			</div>
		</div>
	)
}

const Calendar = hydrate(identifier, RawCalendar);

export default { identifier, component: Calendar };
