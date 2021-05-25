"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const compat_1 = require("preact/compat");
const preact_transitioning_1 = require("preact-transitioning");
require("./Popup.sass");
const Portal_1 = tslib_1.__importDefault(require("./Portal"));
const Popup = compat_1.forwardRef((props, fRef) => {
    var _a, _b, _c, _d;
    return (<Portal_1.default to={(_a = document.querySelector('.App')) !== null && _a !== void 0 ? _a : document.body}>
			<div ref={fRef}>
				<preact_transitioning_1.CSSTransition in={props.active} duration={(_b = props.duration) !== null && _b !== void 0 ? _b : 150} classNames='Animate'>
					<div class={('Popup ' + ((_c = props.class) !== null && _c !== void 0 ? _c : '') + (props.defaultAnimation ? ' DefaultAnim' : '')).trim()} style={{ zIndex: (_d = props.z) !== null && _d !== void 0 ? _d : 5 }}>
						{props.children}
					</div>
				</preact_transitioning_1.CSSTransition>
			</div>
		</Portal_1.default>);
});
exports.default = Popup;
