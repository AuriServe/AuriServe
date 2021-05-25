"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compat_1 = require("preact/compat");
const hooks_1 = require("preact/hooks");
require("./InputText.sass");
function useAutoTextArea(maxHeight, dependents) {
    const ref = hooks_1.useRef(null);
    hooks_1.useLayoutEffect(() => {
        if (!ref.current)
            return;
        ref.current.style.height = '';
        ref.current.style.height = Math.min(ref.current.scrollHeight + 2, maxHeight !== null && maxHeight !== void 0 ? maxHeight : Infinity) + 'px';
    }, [ref.current, ...dependents || []]);
    return ref;
}
const InputText = compat_1.forwardRef((props, fRef) => {
    var _a, _b, _c;
    const ref = useAutoTextArea((_a = props.maxHeight) !== null && _a !== void 0 ? _a : 420, [props.value]);
    const cb = (evt) => props.setValue(evt.target.value);
    const sharedProps = {
        value: props.value,
        onInput: cb,
        onChange: cb,
        onFocus: props.onFocusChange ? () => props.onFocusChange(true) : undefined,
        onBlur: props.onFocusChange ? () => props.onFocusChange(false) : undefined,
        minLength: props.min,
        maxLength: props.max,
        disabled: props.disabled,
        placeholder: props.placeholder,
        style: props.style
    };
    return (props.long ?
        <textarea {...sharedProps} class={('InputText Long ' + ((_b = props.class) !== null && _b !== void 0 ? _b : '') + (props.code ? ' Code' : '')).trim()} rows={1} ref={(newRef) => {
                ref.current = newRef;
                if (fRef)
                    fRef.current = newRef;
            }}/>
        :
            <input {...sharedProps} class={('InputText Short ' + ((_c = props.class) !== null && _c !== void 0 ? _c : '') + (props.code ? ' Code' : '')).trim()} type='text' ref={fRef}/>);
});
exports.default = InputText;
