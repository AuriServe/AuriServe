import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { useState, useEffect } from 'preact/hooks';

import './DatePicker.sass';

import { WidgetProps } from './Input';

interface Props {
	parent?: HTMLElement;
	writable?: boolean;
	displayHex?: boolean;
}

const monthNames = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'];

const DatePicker = forwardRef<HTMLDivElement, WidgetProps & Props>((props, ref) => {
	const [ month, setMonth ] = useState<number>(() => new Date().getMonth());
	const [ year, setYear ] = useState<number>(() => new Date().getFullYear());

	useEffect(() => {
		setMonth(props.value.getMonth());
		setYear(props.value.getFullYear());
	}, [ props.value ]);

	const handleNavigate = (months: number): void => {
		setMonth((((month + months) % 12) + 12) % 12);
		setYear(year + Math.floor((month + months) / 12));
	};

	const handleSetNow = (): void => {
		const date = new Date(props.value.getTime());
		const now = new Date();
		date.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
		props.setValue(date);
	};

	const setDate = (day: number, month: number, year: number) => {
		const date = new Date(props.value.getTime());
		date.setFullYear(year, month, day);
		props.setValue(date);
	};

	const style: any = {};
	if (props.parent) {
		style.top = props.parent.getBoundingClientRect().bottom + 'px';
		style.left = ((props.parent.getBoundingClientRect().left +
			props.parent.getBoundingClientRect().right) / 2) + 'px';
	}
		
	let monthDate = new Date();
	monthDate.setMonth(month, 1);
	monthDate.setFullYear(year);

	let days: Preact.VNode[] = [];

	const firstDayOfMonth = monthDate.getDay();
	for (let i = 1; true; i += 7) {

		// Create a date at Sunday of the `i`th week shown on the calendar.
		const day = i - firstDayOfMonth;
		let date = new Date();
		date.setMonth(month, 1);
		date.setFullYear(year);
		date.setDate(day);

		// Break when we go past the last week of the month.
		if ((date.getMonth() > month && date.getFullYear() >= year) || date.getFullYear() > year) break;

		const currentDate = new Date();

		for (let j = 0; j < 7; j++) {
			const isCurrentMonth = date.getMonth() === month;

			const isCurrentDate =
				date.getDate() === currentDate.getDate() &&
				date.getMonth() === currentDate.getMonth() &&
				date.getFullYear() === currentDate.getFullYear();

			const isSelectedDate =
				date.getDate() === props.value.getDate() &&
				date.getMonth() === props.value.getMonth() &&
				date.getFullYear() === props.value.getFullYear();

			const dayClasses = 'DatePicker-Date ' +
				(isCurrentDate ? ' CurrentDay' : '') +
				(isCurrentMonth ? ' CurrentMonth' : '') +
				(isSelectedDate ? ' Selected' : '');

			const rep: [ number, number, number ] = [ date.getDate(), date.getMonth(), date.getFullYear() ];
			days.push(<button tabIndex={-1} class={dayClasses} onClick={() => setDate(...rep)}>{date.getDate()}</button>);
			date.setDate(date.getDate() + 1);
		}
	}

	return (
		<div class={('DatePicker ' + (props.parent ? 'Absolute' : '')).trim()}
			ref={ref} style={style}>
			<div class='DatePicker-Header'>
				<button tabIndex={-1} onClick={() => handleNavigate(-1)}>&lt;</button>
				<button tabIndex={-1} onClick={() => handleSetNow()}>🕒</button>
				<p>{monthNames[month]} {year}</p>
				<button tabIndex={-1} onClick={() => handleNavigate(1)}>&gt;</button>
			</div>
			<div class='DatePicker-Grid'>{days}</div>
		</div>
	);
});

export default DatePicker;
