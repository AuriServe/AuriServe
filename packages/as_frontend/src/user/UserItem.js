"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_router_dom_1 = require("react-router-dom");
require("./UserItem.sass");
const UserRolesList_1 = tslib_1.__importDefault(require("./UserRolesList"));
function UserItem(props) {
    var _a;
    return (<react_router_dom_1.NavLink to={'/users/' + props.user.id} className='UserItem'>
			<img class='UserItem-Icon' src='/admin/asset/icon/user-color.svg' alt=''/>
			<h2 class='UserItem-Name'>{props.user.username}</h2>
			<p class='UserItem-Identifier'>{(_a = props.user.emails[0]) !== null && _a !== void 0 ? _a : ''}</p>
			<UserRolesList_1.default user={props.user}/>
			<img class='UserItem-More' src='/admin/asset/icon/menu-dark.svg' alt=''/>
		</react_router_dom_1.NavLink>);
}
exports.default = UserItem;
