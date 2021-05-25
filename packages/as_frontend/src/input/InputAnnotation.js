"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./InputAnnotation.sass");
function InputAnnotation(props) {
    return (<label class='InputAnnotation'>
			<p class='InputAnnotation-Title'>{props.title}</p>
			{props.description && <p class='InputAnnotation-Description'>{props.description}</p>}

			{props.children}
		</label>);
}
exports.default = InputAnnotation;
