import { Fragment, h } from 'preact';
import { hydrate, useHydrated } from 'hydrated';
import { useMemo, useState } from 'preact/hooks';

import Row from './calendar/Row';
import VirtualScroll from '../common/VirtualScroll';

import { PopulatedCalendar } from '../common/Calendar';
import { view } from 'dashboard/types/dashboard/Icon';

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
	const hydrated = useHydrated();
	const calendar: PopulatedCalendar = { events: {}, categories: {} };

	const start = useMemo(() => {
		const now = new Date();
		const date = new Date(now.getFullYear(), now.getMonth(), 0);
		date.setDate(date.getDate() - date.getDay());
		return +date;
	}, []);


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
					onScroll={(i) => setCurrent(+getWeekDate(start, i + 1))}
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
							height={100}
							calendar={calendar}
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
