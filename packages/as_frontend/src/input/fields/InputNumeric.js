"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compat_1 = require("preact/compat");
require("./InputNumeric.sass");
const InputNumeric = compat_1.forwardRef((props, fRef) => {
    var _a;
    const cb = (evt) => props.setValue(evt.target.value);
    return (<input value={props.value} onInput={cb} onChange={cb} class={('InputNumeric ' + ((_a = props.class) !== null && _a !== void 0 ? _a : '')).trim()} style={props.style} type='number' ref={fRef} disabled={props.disabled} placeholder={props.placeholder} onFocus={props.onFocusChange ? () => props.onFocusChange(true) : undefined} onBlur={props.onFocusChange ? () => props.onFocusChange(false) : undefined}/>);
});
exports.default = InputNumeric;
