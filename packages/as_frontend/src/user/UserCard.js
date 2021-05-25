"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("preact/hooks");
const react_router_dom_1 = require("react-router-dom");
const Hooks_1 = require("../Hooks");
require("./UserCard.sass");
const Popup_1 = tslib_1.__importDefault(require("../structure/Popup"));
const UserRolesList_1 = tslib_1.__importDefault(require("./UserRolesList"));
function UserCard(props) {
    const ref = hooks_1.useRef(null);
    Hooks_1.usePopupCancel(ref, props.onClose, () => props.visible, [props.visible]);
    return (<Popup_1.default active={props.visible} defaultAnimation={true}>
			<div class='UserCard' ref={ref} style={{
            top: props.parent.getBoundingClientRect().bottom + 'px',
            left: ((props.parent.getBoundingClientRect().left +
                props.parent.getBoundingClientRect().right) / 2) + 'px'
        }}>

				<div class='UserCard-Header'>
					<img src='/admin/asset/icon/user-color.svg'/>
					<h1 class='UserCard-Name' title={props.user.username}>{props.user.username}</h1>
					<h2 class='UserCard-Identifier' title={props.user.id}>{props.user.id}</h2>
				</div>
				<div class='UserCard-Body'>
					<UserRolesList_1.default user={props.user} wrap={true} edit={true}/>
					<react_router_dom_1.Link to={'/users/' + props.user.id} className='UserCard-Full'>View Profile</react_router_dom_1.Link>
				</div>
			</div>
		</Popup_1.default>);
}
exports.default = UserCard;
;
