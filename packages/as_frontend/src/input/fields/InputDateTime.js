"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const compat_1 = require("preact/compat");
const hooks_1 = require("preact/hooks");
require("./InputDateTime.sass");
const InputText_1 = tslib_1.__importDefault(require("./InputText"));
const DatePicker_1 = tslib_1.__importDefault(require("../DatePicker"));
const Popup_1 = tslib_1.__importDefault(require("../../structure/Popup"));
const Hooks_1 = require("../../Hooks");
function zeroPad(num, pad = 2) {
    let str = '' + num;
    while (str.length < pad)
        str = '0' + str;
    return str;
}
const InputDateTime = compat_1.forwardRef((props) => {
    var _a;
    const dateRef = hooks_1.useRef(null);
    const monthRef = hooks_1.useRef(null);
    const yearRef = hooks_1.useRef(null);
    const hourRef = hooks_1.useRef(null);
    const minuteRef = hooks_1.useRef(null);
    const inputRef = hooks_1.useRef(null);
    const portalRef = hooks_1.useRef(null);
    const [pickerActive, setPickerActive] = hooks_1.useState(false);
    Hooks_1.usePopupCancel([inputRef, portalRef], () => setPickerActive(false));
    const [editedDate, setEditedDate] = hooks_1.useReducer((date, newDate) => (Object.assign(Object.assign({}, date), newDate)), { date: '00', month: '00', year: '0000', hour: '00', minute: '00' });
    const handleResetEditedDate = () => {
        const newDate = {};
        if (parseInt(editedDate.date, 10) !== props.value.getDate())
            newDate.date = zeroPad(props.value.getDate());
        if (parseInt(editedDate.month, 10) !== props.value.getMonth() + 1)
            newDate.month = zeroPad(props.value.getMonth() + 1);
        if (parseInt(editedDate.year, 10) !== props.value.getFullYear())
            newDate.year = zeroPad(props.value.getFullYear());
        if (parseInt(editedDate.hour, 10) !== props.value.getHours())
            newDate.hour = zeroPad(props.value.getHours());
        if (parseInt(editedDate.minute, 10) !== props.value.getMinutes())
            newDate.minute = zeroPad(props.value.getMinutes());
        setEditedDate(newDate);
    };
    hooks_1.useEffect(() => handleResetEditedDate(), [props.value]);
    const setValue = (type, val) => {
        const newDate = new Date(props.value.getTime());
        if (type === 'date')
            newDate.setDate(val);
        else if (type === 'month')
            newDate.setMonth(val - 1);
        else if (type === 'year')
            newDate.setFullYear(val);
        else if (type === 'hour')
            newDate.setHours(val);
        else if (type === 'minute')
            newDate.setMinutes(val);
        props.setValue(newDate);
    };
    const handleSet = (val, type, pad, min, max, next) => {
        setEditedDate({ [type]: val });
        val = val.replace(/\D/g, '');
        setEditedDate({ [type]: val });
        if (!isNaN(parseInt(val, 10)) && (!max || parseInt(val, 10) <= max))
            setValue(type, parseInt(val, 10));
        if (val.length >= pad) {
            let numeric = parseInt(val, 10);
            if (isNaN(numeric) || numeric < (min !== null && min !== void 0 ? min : 1))
                numeric = 1;
            if (max && numeric > max)
                numeric = max;
            setValue(type, numeric);
            setEditedDate({ [type]: zeroPad(numeric, pad) });
            if (next === null || next === void 0 ? void 0 : next.current)
                window.requestAnimationFrame(() => next.current.focus());
        }
        ;
    };
    const handleDatePickerSet = (newDate) => {
        props.setValue(newDate);
    };
    const handleFocus = (ref, ..._) => {
        ref.current.select();
    };
    const handleBlur = (_, type, min, max, pad) => {
        let numeric = parseInt(editedDate[type], 10);
        if (isNaN(numeric) || numeric < (min !== null && min !== void 0 ? min : 1))
            numeric = 1;
        if (max && numeric > max)
            numeric = max;
        setValue(type, numeric);
        setEditedDate({ [type]: zeroPad(numeric, pad) });
    };
    const handleFocusChange = (state, ...other) => {
        if (state)
            handleFocus(...other);
        else
            handleBlur(...other);
    };
    const nextDate = new Date(props.value.getTime());
    nextDate.setMonth(nextDate.getMonth() + 1);
    nextDate.setDate(0);
    const maxMonth = nextDate.getDate();
    return (<div ref={inputRef} style={props.style} class={('InputDateTime ' + ((_a = props.class) !== null && _a !== void 0 ? _a : '')).trim()} onFocusCapture={() => setPickerActive(true)}>

			<InputText_1.default value={editedDate.date} max={2} ref={dateRef} setValue={date => handleSet(date, 'date', 2, 1, maxMonth, monthRef)} onFocusChange={state => handleFocusChange(state, dateRef, 'date', 1, maxMonth, 2)}/>

			<span class='InputDateTime-Divider'>/</span>

			<InputText_1.default value={editedDate.month} max={2} ref={monthRef} setValue={month => handleSet(month, 'month', 2, 1, 12, yearRef)} onFocusChange={state => handleFocusChange(state, monthRef, 'month', 1, 12, 2)}/>

			<span class='InputDateTime-Divider'>/</span>

			<InputText_1.default value={editedDate.year} max={4} ref={yearRef} setValue={year => handleSet(year, 'year', 4, undefined, undefined, hourRef)} onFocusChange={state => handleFocusChange(state, yearRef, 'year', undefined, undefined, 4)}/>

			<div />

			<InputText_1.default value={editedDate.hour} max={2} ref={hourRef} setValue={hour => handleSet(hour, 'hour', 2, 0, 23, minuteRef)} onFocusChange={state => handleFocusChange(state, hourRef, 'hour', 0, 23, 2)}/>
			<span class='InputDateTime-Divider'>:</span>
			<InputText_1.default value={editedDate.minute} max={2} ref={minuteRef} setValue={minute => handleSet(minute, 'minute', 2, 0, 59, undefined)} onFocusChange={state => handleFocusChange(state, minuteRef, 'minute', 0, 59, 2)}/>

			<Popup_1.default z={6} active={pickerActive} defaultAnimation={true} ref={portalRef}>
				<DatePicker_1.default value={props.value} setValue={handleDatePickerSet} parent={inputRef.current}/>
			</Popup_1.default>
		</div>);
});
exports.default = InputDateTime;
