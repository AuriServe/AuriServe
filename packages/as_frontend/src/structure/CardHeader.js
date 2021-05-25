"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./CardHeader.sass");
function CardHeader(props) {
    var _a;
    return (<div class='CardHeader'>
			<img class='CardHeader-Icon' src={props.icon} alt=''/>
			<div class='CardHeader-Content'>
				<h1 class='CardHeader-Title'>{props.title}</h1>
				<p class='CardHeader-Description'>{(_a = props.subtitle) !== null && _a !== void 0 ? _a : ''}</p>
			</div>
		</div>);
}
exports.default = CardHeader;
