import { h } from 'preact';
import { tw } from '../../../../Twind';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import Row from './Row';
import { Icon, Svg, Tooltip } from '../../../../Main';

const MONTH = [ 'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December' ];

interface Props {
	selected: Date | null;
	min?: Date;
	max?: Date;
	defaultTime?: 'start' | 'end';
	onSelect: (date: Date | null) => void;
}

export default function CalendarSelector(props: Props) {
	const selected = props.selected ?? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

	const viewRef = useRef<HTMLDivElement>(null);

	const [ start, setStart ] = useState<Date>(() => {
		const now = selected || new Date();
		const date = new Date(now.getFullYear(), now.getMonth(), 1);
		date.setDate(date.getDate() - date.getDay());
		return date;
	});

	const [ monthSelectLength, setMonthSelectLength ] = useState<number>(0);

	useEffect(() => {
		const elem = viewRef.current;
		if (!elem) return;

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

	function handleSetScrollMonth(ind: number) {
		const date = new Date(start.getFullYear(), ind, 1);
		date.setDate(date.getDate() - date.getDay());
		setStart(date);
	}

	function handleSetScrollYear(ind: number) {
		const date = new Date(ind, start.getMonth() + 1, 1);
		date.setDate(date.getDate() - date.getDay());
		setStart(date);
	}

	function handleSetDate(newDate: Date) {
		const date = new Date(selected);
		if (!props.selected && props.defaultTime === 'end') {
			date.setHours(23, 59);
		}
		date.setFullYear(newDate.getFullYear());
		date.setMonth(newDate.getMonth());
		date.setDate(newDate.getDate());
		props.onSelect(date);
	}

	function handleSetHour(hour: number) {
		const date = new Date(selected);
		const meridiem = date.getHours() >= 12 ? 1 : 0;
		date.setHours((hour % 12) + meridiem * 12);
		props.onSelect(date);
	}

	function handleSetMinute(minute: number) {
		const date = new Date(selected);
		date.setMinutes(minute);
		props.onSelect(date);
	}

	function handleSetMeridiem(meridiem: 0 | 1) {
		const date = new Date(selected);
		const currentMeridiem = date.getHours() >= 12 ? 1 : 0;
		const diff = meridiem - currentMeridiem;
		date.setHours(date.getHours() + diff * 12);
		props.onSelect(date);
	}

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

	const years = useMemo(() => {
		const years = [];
		for (let i = 2000; i <= 2100; i++) years.push(<option key={i} value={i}>{i}</option>);
		return years;
	}, []);

	const hours = useMemo(() => {
		const hours = [];
		for (let i = 1; i <= 12; i++) hours.push(<option key={i} value={i}>{i}</option>);
		return hours;
	}, []);

	const minutes = useMemo(() => {
		const minutes = [];
		for (let i = 0; i < 60; i++) minutes.push(<option key={i} value={i}>{i.toString().padStart(2, '0')}</option>);
		return minutes;
	}, []);

	return (
		<div ref={viewRef} class={tw`bg-gray-700 rounded overflow-hidden grow flex-(& col) pt-3`}>
			<div class={tw`shrink-0 flex justify-between items-center`}>
				<div class={tw`flex pl-4 gap-0.5`}>
					<select class={tw`text-lg leading-5 font-medium border-gray-900 rounded cursor-pointer
						appearance-none outline-none box-content p-1 bg-gray-(700 hocus:600) transition
						scroll-gutter-gray-600 scroll-bar-gray-300 scroll-bar-hover-gray-200`}
						style={{ width: monthSelectLength || undefined }}
						value={MONTH[headDate.getMonth()]}
						onChange={(evt: any) => handleSetScrollMonth(MONTH.indexOf(evt.target.value))}>
						{MONTH.map(month => <option key={month} value={month}>{month}</option>)}
					</select>

					<select class={tw`text-lg leading-5 font-medium border-gray-900 rounded cursor-pointer
						appearance-none outline-none box-content p-1 bg-gray-(700 hocus:600) transition
						scroll-gutter-gray-600 scroll-bar-gray-300 scroll-bar-hover-gray-200`}
						value={headDate.getFullYear()}
						onChange={(evt: any) => handleSetScrollYear(Number.parseInt(evt.target.value, 10))}>
						{years}
					</select>
				</div>
			</div>
			<p ref={(elem) => window.requestAnimationFrame(() =>
				setMonthSelectLength(elem?.offsetWidth ?? monthSelectLength))}
				class={tw`fixed left-[-9999px] top-0 font-medium text-lg`}>
				{MONTH[headDate.getMonth()]}
			</p>
			<div class={tw`p-3`}>
				<div class={tw`grid-(& cols-7) mb-2`}>
					{[ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ].map(day =>
						<p key={day} class={tw`text-gray-300 font-bold text-xs text-center`}>{day}</p>
					)}
				</div>

				<div class={tw`relative grow overflow-hidden group
					w-[calc((36px+4px)*7-4px)] h-[calc((32px+4px)*5-4px)]`}>

					{rows.map((date) =>
						<div key={+date} class={tw`absolute transition duration-150 w-full`} style={{
							transform: `translateY(${Math.floor((+date / 1000 / 60 / 60 / 24 / 7) -
								(+start / 1000 / 60 / 60 / 24 / 7)) * (32 + 4)}px)`
						}}>
							<Row start={date} onClick={handleSetDate} selected={props.selected}
								min={props.min} max={props.max}/>
						</div>
					)}
				</div>
			</div>
			<div class={tw`p-3 pt-0 flex justify-between`}>
				<div class={tw`w-max rounded focus-within:ring-(2 accent-500 offset-2 offset-gray-700)`}>
					<select class={tw`p-1.5 pr-1 px-2 bg-gray-600 appearance-none hocus:bg-[#314360]
						rounded-l tracking-wider font-medium outline-none transition text-right`}
						value={(selected.getHours() ?? 12) % 12 || 12}
						onChange={(evt: any) => handleSetHour(Number.parseInt(evt.target.value, 10))}>
						{hours}
					</select>

					<span class={tw`absolute translate-y-[6px] -translate-x-[2px] text-gray-200 interact-none`}>:</span>

					<select class={tw`p-1.5 pl-1 pr-0.5 bg-gray-600 appearance-none hocus:bg-[#314360]
						tracking-wider font-medium outline-none transition`}
						value={selected.getMinutes()}
						onChange={(evt: any) => handleSetMinute(Number.parseInt(evt.target.value, 10))}>
						{minutes}
					</select>

					<select class={tw`p-1.5 pl-0.5 px-2 bg-gray-600 appearance-none hocus:bg-[#314360]
						rounded-r font-medium outline-none text-gray-200 transition`}
						value={(selected.getHours() ?? 12) >= 12 ? 'pm' : 'am'}
						onChange={(evt: any) => handleSetMeridiem(evt.target.value === 'pm' ? 1 : 0)}>
						<option value='am'>am</option>
						<option value='pm'>pm</option>
					</select>
				</div>

				<button type='button' onClick={() => props.onSelect(null)} class={tw`
					rounded bg-gray-(600 hocus:500 active:400) cursor-pointer w-9 h-9 grid place-content-center
					focus:ring-(2 gray-500 offset-2 offset-gray-700) outline-0 transition
					active:ring-(2 gray-500 offset-2 offset-gray-700)`}>
					<Svg src={Icon.close} size={6}/>
					<Tooltip label='Clear' small position='right' bg='gray-600' class={tw`z-50 text-white`}/>
				</button>
			</div>
		</div>
	);
}
