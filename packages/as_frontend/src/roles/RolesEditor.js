"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("preact/hooks");
const as_common_1 = require("as_common");
const SavePopup_1 = tslib_1.__importDefault(require("../SavePopup"));
const RoleEditor_1 = tslib_1.__importDefault(require("./RoleEditor"));
require("./RolesEditor.sass");
function validateRoles(roles) {
    for (let role of roles)
        if (role.abilities.includes('ADMINISTRATOR'))
            return true;
    return false;
}
function RolesEditor(props) {
    const [roles, setRoles] = hooks_1.useState([]);
    const [dirty, setDirty] = hooks_1.useState(false);
    const [editing, setEditing] = hooks_1.useState(0);
    hooks_1.useEffect(() => {
        setRoles(props.roles);
        setDirty(false);
    }, [props.roles]);
    const handleSetRole = (role) => {
        let newRoles = [...roles];
        newRoles[editing] = role;
        if (!validateRoles(newRoles))
            return setRoles([...roles]);
        setRoles(newRoles);
        setDirty(JSON.stringify(newRoles) !== JSON.stringify(props.roles));
    };
    const handleReset = () => {
        setRoles(props.roles);
        setDirty(false);
    };
    const handleSave = () => {
    };
    return (<div class='RolesEditor'>
			<ul class='RolesEditor-RolesList'>
				<li><span class='RolesEditor-Label'>Roles</span></li>
				{roles.map((r, i) => <li key={i} class={'RolesEditor-RolesListRole' + (i === editing ? ' active' : '')} style={{ ['--color']: (r.color ? as_common_1.Color.convert(r.color).toHex() : '#334E68'),
                ['--bg-color']: (r.color ? as_common_1.Color.convert(r.color).toHex() : '#334E68') + '22' }}>
					<button onClick={() => setEditing(i)}><span>{r.name}</span></button>
				</li>)}
			</ul>
			
			{roles[editing] && <RoleEditor_1.default role={roles[editing]} setRole={handleSetRole}/>}
			<SavePopup_1.default active={dirty} onReset={handleReset} onSave={handleSave}/>
		  <react_router_dom_1.Prompt when={dirty} message='Are you sure you want to leave this page? Unsaved changes will be lost.'/>
		</div>);
}
exports.default = RolesEditor;
