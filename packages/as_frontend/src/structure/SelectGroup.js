"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectGroupContext = void 0;
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
const hooks_1 = require("preact/hooks");
require("./SelectGroup.sass");
exports.SelectGroupContext = Preact.createContext({
    selected: [], onSelect: () => { }
});
function SelectGroup(props) {
    var _a;
    const oldChildren = hooks_1.useRef(null);
    const [additive, setAdditive] = hooks_1.useState(false);
    const [connect, setConnect] = hooks_1.useState(false);
    const [lastSelected, setLastSelected] = hooks_1.useState(undefined);
    const [context, setContext] = hooks_1.useState(undefined);
    const handleSelect = hooks_1.useCallback((n, state) => {
        let newSelected = [...props.selected];
        if (!props.multi || !additive) {
            state = state !== null && state !== void 0 ? state : newSelected.indexOf(n) === -1;
            newSelected = state ? [n] : [];
        }
        if (props.multi && connect && lastSelected !== undefined) {
            let a = n < lastSelected ? n : lastSelected;
            let b = n < lastSelected ? lastSelected : n;
            for (let i = a; i <= b; i++)
                if (newSelected.indexOf(i) === -1)
                    newSelected.push(i);
        }
        else if (props.multi && additive) {
            const currentState = newSelected.indexOf(n) !== -1;
            if ((state !== undefined && state !== currentState) || !state) {
                state = state !== null && state !== void 0 ? state : !currentState;
                if (state === false && newSelected.indexOf(n) !== -1)
                    newSelected.splice(newSelected.indexOf(n), 1);
                else if (state === true && newSelected.indexOf(n) === -1)
                    newSelected.push(n);
            }
        }
        props.setSelected(newSelected);
        setLastSelected(n);
    }, [props.selected, props.multi, additive, connect, lastSelected]);
    hooks_1.useEffect(() => {
        const cbDown = (evt) => {
            if (evt.key === 'Control')
                setAdditive(true);
            if (evt.key === 'Shift')
                setConnect(true);
        };
        const cbUp = (evt) => {
            if (evt.key === 'Control')
                setAdditive(false);
            if (evt.key === 'Shift')
                setConnect(false);
        };
        window.addEventListener('keydown', cbDown);
        window.addEventListener('keyup', cbUp);
        return () => {
            window.removeEventListener('keydown', cbDown);
            window.removeEventListener('keyup', cbUp);
        };
    }, []);
    hooks_1.useEffect(() => {
        if ((Array.isArray(oldChildren.current) ? oldChildren.current.length : 1) !==
            (Array.isArray(props.children) ? props.children.length : 1)) {
            oldChildren.current = props.children;
            props.setSelected([]);
            setLastSelected(undefined);
        }
    }, [props.children]);
    hooks_1.useEffect(() => {
        setContext({
            selected: props.selected,
            onSelect: handleSelect
        });
    }, [handleSelect]);
    return (context ? <exports.SelectGroupContext.Provider value={context}>
			<ul class={('SelectGroup ' + ((_a = props.class) !== null && _a !== void 0 ? _a : '')).trim()} style={props.style}>{props.children}</ul>
		</exports.SelectGroupContext.Provider> : null);
}
exports.default = SelectGroup;
