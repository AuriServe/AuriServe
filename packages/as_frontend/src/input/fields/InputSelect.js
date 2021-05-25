"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const compat_1 = require("preact/compat");
const hooks_1 = require("preact/hooks");
const as_common_1 = require("as_common");
require("./InputSelect.sass");
const Popup_1 = tslib_1.__importDefault(require("../../structure/Popup"));
const SearchableOptionPicker_1 = tslib_1.__importDefault(require("../SearchableOptionPicker"));
const InputSelect = compat_1.forwardRef((props, fRef) => {
    var _a, _b, _c;
    const wrapRef = hooks_1.useRef(null);
    const [search, setSearch] = hooks_1.useState('');
    const [focused, setFocused] = hooks_1.useState(false);
    const handleSearch = (evt) => {
        var _a;
        setSearch((_a = evt.target.value) !== null && _a !== void 0 ? _a : '');
    };
    const handleSet = (identifier) => {
        props.setValue(identifier);
        setSearch('');
    };
    const handleFocus = (focused) => {
        setFocused(focused);
        if (props.onFocusChange)
            props.onFocusChange(focused);
    };
    return (<div class={('InputSelect ' + ((_a = props.class) !== null && _a !== void 0 ? _a : '')).trim()} style={props.style} ref={e => {
            if (!e)
                return;
            wrapRef.current = e;
            if (fRef)
                fRef.current = e;
        }}>
			<input value={search} onInput={handleSearch} onChange={handleSearch} type='text' disabled={props.disabled} placeholder={props.options[props.value] || (((_b = props.value) === null || _b === void 0 ? void 0 : _b.length) > 0 && as_common_1.Format.fileNameToName(props.value)) || props.placeholder} class={('InputSelect-Input ' + (((_c = props.value) === null || _c === void 0 ? void 0 : _c.length) ? 'Selected' : '')).trim()} onFocus={() => handleFocus(true)} onBlur={() => handleFocus(false)}/>

			<Popup_1.default z={6} active={focused} defaultAnimation={true}>
				<SearchableOptionPicker_1.default query={search} parent={wrapRef.current} options={props.options} setSelected={selected => handleSet(selected)}/>
			</Popup_1.default>
		</div>);
});
exports.default = InputSelect;
