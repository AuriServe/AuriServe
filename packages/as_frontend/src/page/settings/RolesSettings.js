"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const RolesEditor_1 = tslib_1.__importDefault(require("../../roles/RolesEditor"));
const Graph_1 = require("../../Graph");
function RolesSettings() {
    const [{ roles }] = Graph_1.useQuery(Graph_1.QUERY_ROLES);
    return (<div class='Settings RolesSettings'>
			{roles && <RolesEditor_1.default roles={roles}/>}
		</div>);
}
exports.default = RolesSettings;
