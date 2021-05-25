"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const compat_1 = require("preact/compat");
const hooks_1 = require("preact/hooks");
const as_common_1 = require("as_common");
const InputText_1 = tslib_1.__importDefault(require("./InputText"));
const ColorPicker_1 = tslib_1.__importDefault(require("../ColorPicker"));
const Popup_1 = tslib_1.__importDefault(require("../../structure/Popup"));
const Hooks_1 = require("../../Hooks");
require("./InputColor.sass");
const InputColor = compat_1.forwardRef((props, fRef) => {
    var _a, _b;
    const value = (_a = props.value) !== null && _a !== void 0 ? _a : { h: 0.58, s: 0.52, v: 0.41 };
    const inputRef = hooks_1.useRef(null);
    const [pickerActive, setPickerActive] = hooks_1.useState(false);
    Hooks_1.usePopupCancel(inputRef, () => setPickerActive(false));
    return (<div class={('InputColor ' + (props.full ? 'Full ' : '') + ((_b = props.class) !== null && _b !== void 0 ? _b : '')).trim()} style={props.style} onFocusCapture={() => setPickerActive(true)} ref={inputRef}>
			<InputText_1.default ref={fRef} value={as_common_1.Color.convert(value).toHex()} setValue={hex => props.setValue(as_common_1.Color.convert(hex).toHSVA())} max={7}/>
			<div class='InputColor-ColorIndicator' style={{ backgroundColor: as_common_1.Color.convert(value).toHex() }}/>
			<Popup_1.default z={6} active={pickerActive} defaultAnimation={true}>
				<ColorPicker_1.default {...props} value={value} parent={inputRef.current}/>
			</Popup_1.default>
		</div>);
});
exports.default = InputColor;
