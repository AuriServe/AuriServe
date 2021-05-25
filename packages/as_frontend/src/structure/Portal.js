"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
const compat_1 = require("preact/compat");
const hooks_1 = require("preact/hooks");
function Portal(props) {
    const root = hooks_1.useRef(document.createElement('div'));
    hooks_1.useEffect(() => {
        props.to.appendChild(root.current);
        return () => props.to.removeChild(root.current);
    }, [props.to]);
    return (compat_1.createPortal(<Preact.Fragment>{props.children}</Preact.Fragment>, root.current));
}
exports.default = Portal;
;
