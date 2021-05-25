"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
const react_router_dom_1 = require("react-router-dom");
function PageEditorControlPage() {
    const location = react_router_dom_1.useLocation();
    const path = location.pathname.replace(/^\/pages\//g, '');
    return (<Preact.Fragment>
			
			{!path && <react_router_dom_1.Redirect to='/pages'/>}
		</Preact.Fragment>);
}
exports.default = PageEditorControlPage;
