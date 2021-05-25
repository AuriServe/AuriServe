"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compat_1 = require("preact/compat");
require("./InputCheckbox.sass");
const InputCheckbox = compat_1.forwardRef((props, fRef) => {
    var _a;
    const cb = () => props.setValue(!props.value);
    return (<input class={('InputCheckbox ' + (props.alignRight ? 'AlignRight ' : '') + ((_a = props.class) !== null && _a !== void 0 ? _a : '')).trim()} style={props.style} checked={props.value} onChange={cb} ref={fRef} type='checkbox'/>);
});
exports.default = InputCheckbox;
