"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
const Hooks_1 = require("../Hooks");
const hooks_1 = require("preact/hooks");
require("./Dropdown.sass");
const Popup_1 = tslib_1.__importDefault(require("./Popup"));
function Dropdown(props) {
    var _a, _b;
    const buttonRef = hooks_1.useRef(null);
    const dropdownRef = hooks_1.useRef(null);
    const [dropdownActive, setDropdownActive] = hooks_1.useState(false);
    Hooks_1.usePopupCancel([buttonRef, dropdownRef], () => setDropdownActive(false));
    const style = {};
    if (buttonRef.current && dropdownRef.current) {
        style.top = buttonRef.current.getBoundingClientRect().bottom + 'px';
        style.left = buttonRef.current.getBoundingClientRect().left + buttonRef.current.getBoundingClientRect().width / 2 + 'px';
    }
    return (<Preact.Fragment>
			<button ref={buttonRef} onClick={() => setDropdownActive(!dropdownActive)} class={('DropdownButton ' + ((_a = props.buttonClass) !== null && _a !== void 0 ? _a : '')).trim()}>
				{props.buttonChildren}
			</button>

			<Popup_1.default class={('Dropdown ' + ((_b = props.class) !== null && _b !== void 0 ? _b : '')).trim()} defaultAnimation={true} active={dropdownActive} ref={dropdownRef}>
				<div class='Dropdown-Card' ref={dropdownRef} style={style}>
					{props.children}
				</div>
			</Popup_1.default>
		</Preact.Fragment>);
}
exports.default = Dropdown;
