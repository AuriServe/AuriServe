"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./InputLabel.sass");
function InputLabel(props) {
    var _a;
    return (<label class={('InputLabel ' + ((_a = props.class) !== null && _a !== void 0 ? _a : '')).trim()} style={props.style}>
			<p class='InputLabel-Label'>{props.label}</p>
			{props.children}
		</label>);
}
exports.default = InputLabel;
