"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("preact/hooks");
require("./UserRolesList.sass");
const Hooks_1 = require("../Hooks");
function UserRolesList(props) {
    const ref = hooks_1.useRef(null);
    const [editing, setEditing] = hooks_1.useState(false);
    Hooks_1.usePopupCancel(ref, () => setEditing(false), () => editing, [editing]);
    const renderAddRoleForm = () => {
        return (<div class='UserRolesList-AddRoleForm' ref={ref} onClick={e => e.stopPropagation()}>
				<p class='UserRolesList-AddRoleFormHeader'>Add Role</p>
				<ul>
					
				</ul>
			</div>);
    };
    return (<ul class={'UserRolesList' + (props.wrap ? ' Wrap' : '')}>
			
			{props.edit && <button class='UserRolesList-Item UserRolesList-Add' onClick={() => setEditing(!editing)}>
				<img src='/admin/asset/icon/add-dark.svg' alt='Add'/>
				{editing && renderAddRoleForm()}
			</button>}
		</ul>);
}
exports.default = UserRolesList;
;
