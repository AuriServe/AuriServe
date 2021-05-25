"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMessaging = exports.usePopupCancel = exports.useImmediateRerender = exports.useForceUpdate = void 0;
const hooks_1 = require("preact/hooks");
function useForceUpdate() {
    const [, setValue] = hooks_1.useState(false);
    return () => setValue(value => !value);
}
exports.useForceUpdate = useForceUpdate;
;
function useImmediateRerender() {
    const forceUpdate = useForceUpdate();
    hooks_1.useEffect(() => forceUpdate(), []);
}
exports.useImmediateRerender = useImmediateRerender;
;
function usePopupCancel(roots, onCancel, condition, dependents) {
    const body = document.getElementsByTagName('body')[0];
    hooks_1.useEffect(() => {
        const rootsArray = Array.isArray(roots) ? roots : [roots];
        if (condition && !condition())
            return;
        const handlePointerCancel = (e) => {
            let x = e.target;
            while (x) {
                for (const r of rootsArray)
                    if (x === r.current)
                        return;
                x = x.parentNode;
            }
            onCancel();
        };
        const handleFocusCancel = (e) => {
            let x = e.target;
            while (x) {
                for (const r of rootsArray)
                    if (x === r.current)
                        return;
                x = x.parentNode;
            }
            onCancel();
        };
        body.addEventListener('focusin', handleFocusCancel);
        body.addEventListener('mousedown', handlePointerCancel);
        body.addEventListener('touchstart', handlePointerCancel);
        return () => {
            body.removeEventListener('focusin', handleFocusCancel);
            body.removeEventListener('mousedown', handlePointerCancel);
            body.removeEventListener('touchstart', handlePointerCancel);
        };
    }, [onCancel, condition, ...dependents || []]);
}
exports.usePopupCancel = usePopupCancel;
function sendMessage(key, target, type, body) {
    target.postMessage({ _as: key, type: type, body: body });
}
function recieveMessage(key, onRecieve, evt) {
    if (evt.origin !== window.location.origin || !evt.data._as || evt.data._as !== key)
        return;
    const type = evt.data.type;
    const body = evt.data.body;
    onRecieve(type, body);
}
function useMessaging(target, onRecieve, dependents, key = '!') {
    hooks_1.useEffect(() => {
        if (!target)
            return;
        const cb = recieveMessage.bind(undefined, key, onRecieve);
        window.addEventListener('message', cb);
        return () => window.removeEventListener('message', cb);
    }, [key, onRecieve, ...dependents]);
    return target && sendMessage.bind(undefined, key, target);
}
exports.useMessaging = useMessaging;
