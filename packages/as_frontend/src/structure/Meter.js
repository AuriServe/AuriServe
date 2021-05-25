"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./Meter.sass");
function Meter(props) {
    var _a;
    return (<div class={('Meter ' + ((_a = props.class) !== null && _a !== void 0 ? _a : '')).trim()}>
			<div class='Meter-Progress' style={{ width: ((props.usage / props.size) * 100) + '%' }}/>
		</div>);
}
exports.default = Meter;
