// import * as Preact from 'preact';
// import { forwardRef } from 'preact/compat';
// import { useState, useRef, useEffect, useReducer } from 'preact/hooks';

// import './InputDateTime.sass';

// import InputText from './InputText';
// import DatePicker from '../DatePicker';
// import Popup from '../../structure/Popup';
// import { usePopupCancel } from '../../Hooks';

// import { WidgetProps as Props } from '../Input';

// type DateIdentifier = 'date' | 'month' | 'year' | 'hour' | 'minute';

// function zeroPad(num: number, pad: number = 2): string {
// 	let str = '' + num;
// 	while (str.length < pad) str = '0' + str;
// 	return str;
// }

// const InputDateTime = forwardRef<HTMLInputElement, Props>((props) => {
// 	const dateRef = useRef<HTMLInputElement>(null);
// 	const monthRef = useRef<HTMLInputElement>(null);
// 	const yearRef = useRef<HTMLInputElement>(null);

// 	const hourRef = useRef<HTMLInputElement>(null);
// 	const minuteRef = useRef<HTMLInputElement>(null);
	
// 	const inputRef = useRef<HTMLDivElement>(null);
// 	const portalRef = useRef<HTMLDivElement>(null);

// 	const [ pickerActive, setPickerActive ] = useState(false);
// 	usePopupCancel([ inputRef, portalRef ], () => setPickerActive(false));

// 	const [ editedDate, setEditedDate ] =
// 		useReducer((date, newDate: { date: string; month: string; year: string; hour: string; minute: string }) =>
// 			({...date, ...newDate}), { date: '00', month: '00', year: '0000', hour: '00', minute: '00' });

// 	const handleResetEditedDate = () => {
// 		const newDate: any = {};

// 		if (parseInt(editedDate.date, 10) !== props.value.getDate()) newDate.date = zeroPad(props.value.getDate());
// 		if (parseInt(editedDate.month, 10) !== props.value.getMonth() + 1) newDate.month = zeroPad(props.value.getMonth() + 1);
// 		if (parseInt(editedDate.year, 10) !== props.value.getFullYear()) newDate.year = zeroPad(props.value.getFullYear());
// 		if (parseInt(editedDate.hour, 10) !== props.value.getHours()) newDate.hour = zeroPad(props.value.getHours());
// 		if (parseInt(editedDate.minute, 10) !== props.value.getMinutes()) newDate.minute = zeroPad(props.value.getMinutes());
		
// 		setEditedDate(newDate);
// 	};

// 	useEffect(() => handleResetEditedDate(), [ props.value ]);

// 	const setValue = (type: DateIdentifier, val: number) => {
// 		const newDate = new Date(props.value.getTime());

// 		if 			(type === 'date' ) newDate.setDate(val);
// 		else if (type === 'month') newDate.setMonth(val - 1);
// 		else if (type === 'year' ) newDate.setFullYear(val);

// 		else if (type === 'hour'  ) newDate.setHours(val);
// 		else if (type === 'minute') newDate.setMinutes(val);

// 		props.setValue(newDate);
// 	};

// 	const handleSet = (val: string, type: DateIdentifier, pad: number, min: number | undefined,
// 		max: number | undefined, next?: Preact.RefObject<HTMLInputElement>) => {
		
// 		setEditedDate({ [type]: val } as any);
// 		val = val.replace(/\D/g, '');
// 		setEditedDate({ [type]: val } as any);

// 		if (!isNaN(parseInt(val, 10)) && (!max || parseInt(val, 10) <= max)) setValue(type, parseInt(val, 10));

// 		if (val.length >= pad) {
// 			let numeric = parseInt(val, 10);
// 			if (isNaN(numeric) || numeric < (min ?? 1)) numeric = 1;
// 			if (max && numeric > max) numeric = max;

// 			setValue(type, numeric);
// 			setEditedDate({ [type]: zeroPad(numeric, pad) } as any);

// 			if (next?.current) window.requestAnimationFrame(() => next.current!.focus());
// 		};
// 	};

// 	const handleDatePickerSet = (newDate: Date) => {
// 		props.setValue(newDate);
// 	};

// 	const handleFocus = (ref: Preact.RefObject<HTMLInputElement>, ..._: any) => {
// 		ref.current!.select();
// 	};

// 	const handleBlur = (_: any, type: DateIdentifier, min: number | undefined,
// 		max: number | undefined, pad: number) => {
		
// 		let numeric = parseInt(editedDate[type], 10);
// 		if (isNaN(numeric) || numeric < (min ?? 1)) numeric = 1;
// 		if (max && numeric > max) numeric = max;

// 		setValue(type, numeric);
// 		setEditedDate({ [type]: zeroPad(numeric, pad) } as any);
// 	};

// 	const handleFocusChange = (state: boolean, ...other: [ Preact.RefObject<HTMLInputElement>,
// 		DateIdentifier, number | undefined, number | undefined, number ]) => {
		
// 		if (state) handleFocus(...other);
// 		else handleBlur(...other);
// 	};

// 	const nextDate = new Date(props.value.getTime());
// 	nextDate.setMonth(nextDate.getMonth() + 1);
// 	nextDate.setDate(0);
// 	const maxMonth = nextDate.getDate();

// 	return (
// 		<div
// 			ref={inputRef}
// 			style={props.style}
// 			class={('InputDateTime ' + (props.class ?? '')).trim()}
// 			onFocusCapture={() => setPickerActive(true)}>

// 			<InputText
// 				value={editedDate.date} max={2} ref={dateRef}
// 				setValue={date => handleSet(date, 'date', 2, 1, maxMonth, monthRef)}
// 				onFocusChange={state => handleFocusChange(state, dateRef, 'date', 1, maxMonth, 2)} />

// 			<span class='InputDateTime-Divider'>/</span>

// 			<InputText
// 				value={editedDate.month} max={2} ref={monthRef}
// 				setValue={month => handleSet(month, 'month', 2, 1, 12, yearRef)}
// 				onFocusChange={state => handleFocusChange(state, monthRef, 'month', 1, 12, 2)} />

// 			<span class='InputDateTime-Divider'>/</span>

// 			<InputText
// 				value={editedDate.year} max={4} ref={yearRef}
// 				setValue={year => handleSet(year, 'year', 4, undefined, undefined, hourRef)}
// 				onFocusChange={state => handleFocusChange(state, yearRef, 'year', undefined, undefined, 4)} />

// 			<div/>

// 			<InputText
// 				value={editedDate.hour} max={2} ref={hourRef}
// 				setValue={hour => handleSet(hour, 'hour', 2, 0, 23, minuteRef)}
// 				onFocusChange={state => handleFocusChange(state, hourRef, 'hour', 0, 23, 2)} />
// 			<span class='InputDateTime-Divider'>:</span>
// 			<InputText
// 				value={editedDate.minute} max={2} ref={minuteRef}
// 				setValue={minute => handleSet(minute, 'minute', 2, 0, 59, undefined)}
// 				onFocusChange={state => handleFocusChange(state, minuteRef, 'minute', 0, 59, 2)} />

// 			<Popup z={6} active={pickerActive} defaultAnimation={true} ref={portalRef}>
// 				<DatePicker value={props.value} setValue={handleDatePickerSet} parent={inputRef.current} />
// 			</Popup>
// 		</div>
// 	);
// });

// export default InputDateTime;
