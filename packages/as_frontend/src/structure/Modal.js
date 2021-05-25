"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const preact_transitioning_1 = require("preact-transitioning");
require("./Modal.sass");
const Portal_1 = tslib_1.__importDefault(require("./Portal"));
function Modal(props) {
    var _a, _b, _c, _d;
    return (<Portal_1.default to={(_a = document.querySelector('.App')) !== null && _a !== void 0 ? _a : document.body}>
			<preact_transitioning_1.CSSTransition in={props.active} duration={(_b = props.duration) !== null && _b !== void 0 ? _b : 150} classNames='Animate'>
				<div class={('Modal ' + (props.active ? 'Active ' : '') + ((_c = props.class) !== null && _c !== void 0 ? _c : '') + ' ' + (props.defaultAnimation ?
            'DefaultAnim ' : '') + (props.onClose ? 'Closes ' : '')).trim()} style={{ zIndex: (_d = props.z) !== null && _d !== void 0 ? _d : 5 }} onClick={props.onClose}>
					<div class='Modal-CardWrap'>
						<div class='Modal-Card' onClick={e => e.stopPropagation()}>
							{props.children}
						</div>
					</div>
				</div>
			</preact_transitioning_1.CSSTransition>
		</Portal_1.default>);
}
exports.default = Modal;
