"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Graph_1 = require("../../Graph");
const UserItem_1 = tslib_1.__importDefault(require("../../user/UserItem"));
const InputLabel_1 = tslib_1.__importDefault(require("../../input/InputLabel"));
function RolesSettings() {
    const [{ users }] = Graph_1.useQuery(Graph_1.QUERY_USERS);
    return (<div class='Settings UsersSettings'>
			<InputLabel_1.default label='Users'/>
			{users && users.map(user => <UserItem_1.default key={user.id} user={user}/>)}
		</div>);
}
exports.default = RolesSettings;
