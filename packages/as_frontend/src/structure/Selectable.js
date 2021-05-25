"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("preact/hooks");
const ClickHandler_1 = tslib_1.__importDefault(require("../ClickHandler"));
const SelectGroup_1 = require("./SelectGroup");
function Selectable(props) {
    var _a;
    const ctx = hooks_1.useContext(SelectGroup_1.SelectGroupContext);
    const handler = hooks_1.useRef(new ClickHandler_1.default());
    hooks_1.useEffect(() => {
        let callbacks = Object.assign({}, props.callbacks);
        if (!callbacks.onClick)
            callbacks.onClick = () => ctx.onSelect(props.ind);
        else {
            let clickCallback = callbacks.onClick;
            callbacks.onClick = e => {
                ctx.onSelect(props.ind);
                clickCallback(e);
            };
        }
        if (callbacks.onDoubleClick && props.doubleClickSelects) {
            let doubleClickCallback = callbacks.onDoubleClick;
            callbacks.onDoubleClick = e => {
                ctx.onSelect(props.ind, true);
                doubleClickCallback(e);
            };
        }
        handler.current.setCallbacks(callbacks);
    }, [props.callbacks, props.ind, props.doubleClickSelects, props.callbacks, ctx.selected, ctx.onSelect]);
    const selected = ctx.selected.indexOf(props.ind) !== -1;
    return (<button style={props.style} class={('Selectable ' + ((_a = props.class) !== null && _a !== void 0 ? _a : '') + (selected ? ' Selected' : '')).trim()} onMouseUp={handler.current.handleMouseUp}>
			{props.children}
		</button>);
}
exports.default = Selectable;
