"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compat_1 = require("preact/compat");
const hooks_1 = require("preact/hooks");
const as_common_1 = require("as_common");
require("./ColorPicker.sass");
const ColorPicker = compat_1.forwardRef((props, ref) => {
    const color = as_common_1.Color.convert(props.value).toHSVA();
    const mouseTarget = hooks_1.useRef('');
    const satValElem = hooks_1.useRef(null);
    const hueElem = hooks_1.useRef(null);
    const inputHex = (evt) => {
        const val = evt.target.value;
        if (val.length !== 7)
            return;
        props.setValue(as_common_1.Color.convert(val).toHSVA());
    };
    const handleHueMove = (evt) => {
        const bounds = hueElem.current.getBoundingClientRect();
        const h = Math.max(Math.min((evt.clientX - bounds.left) / bounds.width, 1), 0);
        props.setValue(Object.assign(Object.assign({}, color), { h }));
    };
    const handleSatValMove = (evt) => {
        const bounds = satValElem.current.getBoundingClientRect();
        const sat = Math.max(Math.min((evt.clientX - bounds.left) / bounds.width, 1), 0);
        const val = Math.max(Math.min((bounds.bottom - evt.clientY) / bounds.height, 1), 0);
        props.setValue(Object.assign(Object.assign({}, color), { s: sat, v: val }));
    };
    const handleMouseMove = (evt) => {
        switch (mouseTarget.current) {
            default: return;
            case 'hue': return handleHueMove(evt);
            case 'satval': return handleSatValMove(evt);
        }
    };
    const handleMouseClick = (evt, target) => {
        evt.stopImmediatePropagation();
        evt.preventDefault();
        mouseTarget.current = target;
        handleMouseMove(evt);
    };
    hooks_1.useEffect(() => {
        const clearMouse = () => mouseTarget.current = '';
        document.body.addEventListener('mouseup', clearMouse);
        document.body.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.body.removeEventListener('mouseup', clearMouse);
            document.body.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove]);
    const hueHex = as_common_1.Color.convert({ h: color.h, s: 1, v: 1, a: 1 }).toHex();
    const fullHex = as_common_1.Color.convert(Object.assign(Object.assign({}, color), { a: 1 })).toHex();
    const style = {};
    if (props.parent) {
        style.top = props.parent.getBoundingClientRect().bottom + 'px';
        style.left = ((props.parent.getBoundingClientRect().left +
            props.parent.getBoundingClientRect().right) / 2) + 'px';
    }
    return (<div class={('ColorPicker ' + (props.writable ? 'Write ' : '' + (props.parent ? 'Absolute' : ''))).trim()} ref={ref} style={style}>
			
			<div class='ColorPicker-SatVal' ref={satValElem} onMouseDown={(evt) => handleMouseClick(evt, 'satval')} style={{ backgroundColor: hueHex }}>

				{props.displayHex && <p class='ColorPicker-Hex'>{fullHex}</p>}

				<div class='ColorPicker-Indicator' style={{ left: (color.s * 100) + '%',
            top: ((1 - color.v) * 100) + '%', backgroundColor: fullHex }}/>

			</div>
			<div class='ColorPicker-Separator'/>
			<div class='ColorPicker-Hue' ref={hueElem} onMouseDown={(evt) => handleMouseClick(evt, 'hue')}>
				<div class='ColorPicker-Indicator' style={{ left: (color.h * 100) + '%', backgroundColor: hueHex }}/>
			</div>
			{props.writable && <div class='ColorPicker-Details'>
				<div class='ColorPicker-ColorBlock' style={{ backgroundColor: fullHex }}/>
				<input class='ColorPicker-ColorInput' value={fullHex} onChange={inputHex} onInput={inputHex} maxLength={7}/>
			</div>}
		</div>);
});
exports.default = ColorPicker;
