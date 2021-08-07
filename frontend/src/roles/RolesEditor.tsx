import { h } from 'preact';
import { Prompt } from 'react-router-dom';
import { useState, useEffect } from 'preact/hooks';

import { Color } from 'common';
import { Role } from 'common/graph/type';

import RoleEditor from './RoleEditor';
import { SavePopup } from '../structure';

import './RolesEditor.sass';

interface Props {
	roles: Role[];
}

function validateRoles(roles: Role[]): boolean {
	for (let role of roles) if (role.abilities.includes('ADMINISTRATOR')) return true;

	return false;
}

export default function RolesEditor(props: Props) {
	const [ roles, setRoles ] = useState<Role[]>([]);
	const [ dirty, setDirty ] = useState<boolean>(false);
	const [ editing, setEditing ] = useState<number>(0);

	useEffect(() => {
		setRoles(props.roles);
		setDirty(false);
	}, [ props.roles ]);

	const handleSetRole = (role: Role) => {
		let newRoles = [...roles ];
		newRoles[editing] = role;

		if (!validateRoles(newRoles)) return setRoles([...roles ]);

		setRoles(newRoles);
		setDirty(JSON.stringify(newRoles) !== JSON.stringify(props.roles));
	};

	const handleReset = () => {
		setRoles(props.roles);
		setDirty(false);
	};

	const handleSave = () => {
		// fetch('/admin/roles/update', {
		// 	method: 'POST',
		// 	cache: 'no-cache',
		// 	headers: {'Content-Type': 'application/json'},
		// 	body: JSON.stringify(roles)
		// }).then(r => r.json()).then(ctx.mergeData);
	};

	return (
		<div class='RolesEditor'>
			<ul class='RolesEditor-RolesList'>
				<li><span class='RolesEditor-Label'>Roles</span></li>
				{roles.map((r, i) => <li key={i}
					class={'RolesEditor-RolesListRole' + (i === editing ? ' active' : '')}
					style={{['--color']: (r.color ? Color.convert(r.color).toHex() : '#334E68'),
						['--bg-color']: (r.color ? Color.convert(r.color).toHex() : '#334E68') + '22'} as any}>
					<button onClick={() => setEditing(i)}><span>{r.name}</span></button>
				</li>)}
			</ul>

			{roles[editing] && <RoleEditor role={roles[editing]} setRole={handleSetRole} />}
			<SavePopup active={dirty} onReset={handleReset} onSave={handleSave} />
		  <Prompt when={dirty} message='Are you sure you want to leave this page? Unsaved changes will be lost.'/>
		</div>
	);
}
