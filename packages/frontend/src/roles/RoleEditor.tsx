import * as Preact from 'preact';

import { Color } from 'common';
import { Role } from 'common/graph/type';

import * as Input from '../input/Input';

import './RoleEditor.sass';

interface Props {
	role: Role;
	setRole: (role: Role) => void;
}

export default function RoleEditor(props: Props) {
	const handleSetColor = (color: Color.HSVA | undefined) => {
		let role = Object.assign(JSON.parse(JSON.stringify(props.role)), { color });
		props.setRole(role);
	};

	const handleNameChange = (name: string) => {
		props.setRole({ ...JSON.parse(JSON.stringify(props.role)), ...{ name }});
	};

	const handleToggleAbility = (ability: string) => {
		const abilityStr = ability;

		let role = Object.assign(JSON.parse(JSON.stringify(props.role)));
		if (role.abilities.filter((f: string) => f === abilityStr).length)
			role.abilities = role.abilities.filter((f: string) => f !== abilityStr);
		else role.abilities.push(abilityStr);

		props.setRole(role);
	};

	const renderAbilitySwitch = (ability: string, title: string, description?: string, sep?: boolean) => {
		return (
			<Preact.Fragment>
				<Input.Annotation title={title} description={description}>
					<Input.Checkbox setValue={() => handleToggleAbility(ability)}
						value={props.role.abilities.filter(f => f === ability).length > 0} />
				</Input.Annotation>
				{sep !== false && <hr class='RoleEditor-Separator' />}
			</Preact.Fragment>
		);
	};

	return (
		<div class='RoleEditor'>
			<Input.Label label='Role Name'>
				<Input.Text style={props.role.color && { color: Color.convert(props.role.color).toHex() }}
					value={props.role.name} setValue={handleNameChange} />
			</Input.Label>

			<Input.Label label='Role Color' />
			<div class='RoleEditor-ColorSelector'>
				<button class='RoleEditor-ColorTransparent' onClick={() => handleSetColor(undefined)}>
					{!props.role.color && <img src='/admin/asset/icon/dash-light.svg' alt='Selected'/>}
				</button>

				<Input.Color class='RoleEditor-ColorPicker' full={true} value={props.role.color} setValue={handleSetColor} />

				{['#e12d39', '#f0b429', '#6cd410', '#17b897', '#0fb5ba', '#2bb0ed', '#0967d2', '#2251cc', '#8719e0', '#e019d0', '#da127d',
					'#c52707', '#cb6e17', '#399709', '#048271', '#099aa4', '#127fbf', '#03449e', '#132dad', '#690cb0', '#b30ba3', '#a30664']
					.map(c =>
						<button style={{backgroundColor: c}} onClick={() => handleSetColor(Color.convert(c).toHSVA())} title={c}>
							{props.role.color && Color.convert(props.role.color).toHex() === c &&
								<img src='/admin/asset/icon/check-light.svg' alt='Selected'/>}
						</button>
					)
				}
			</div>

			<hr class='RoleEditor-Separator' />

			<span class='RoleEditor-AbilityCategory'>Abilities</span>

			{renderAbilitySwitch('ADMINISTRATOR', 'Administrator',
				'Bypass ability checks and role heirarchy. Use with caution.')}

			{renderAbilitySwitch('VIEW_AUDIT_LOG', 'View Audit Log', 'View global and user Audit Logs.')}

			<span class='RoleEditor-AbilityCategory'>Media Management</span>

			{renderAbilitySwitch('VIEW_MEDIA', 'View Media')}
			{renderAbilitySwitch('MANAGE_MEDIA', 'Manage Media', 'Add and remove media assets.')}
			{renderAbilitySwitch('REPLACE_MEDIA', 'Replace Media', 'Replace existing media assets with new ones.')}
			{renderAbilitySwitch('EDIT_MEDIA_META', 'Edit Media Metadata', 'Edit Media titles and descriptions.')}

			<span class='RoleEditor-AbilityCategory'>Page Management</span>

			{renderAbilitySwitch('VIEW_PAGES', 'View Pages')}
			{renderAbilitySwitch('MANAGE_PAGES', 'Manage Pages', 'Add, remove, and relocate pages.')}
			{renderAbilitySwitch('EDIT_PAGES', 'Edit Pages')}

			<span class='RoleEditor-AbilityCategory'>Theme Management</span>

			{renderAbilitySwitch('VIEW_THEMES', 'View Themes')}
			{renderAbilitySwitch('MANAGE_THEMES', 'Manage Themes', 'Add and remove themes.')}
			{renderAbilitySwitch('TOGGLE_THEMES', 'Toggle Themes', 'Enable and disable themes.')}

			<span class='RoleEditor-AbilityCategory'>Plugin Management</span>

			{renderAbilitySwitch('VIEW_PLUGINS', 'View Plugins')}
			{renderAbilitySwitch('MANAGE_PLUGINS', 'Manage Plugins', 'Add and remove plugins.')}
			{renderAbilitySwitch('TOGGLE_PLUGINS', 'Toggle Plugins', 'Enable and disable plugins.')}

			<span class='RoleEditor-AbilityCategory'>User Management</span>

			{renderAbilitySwitch('VIEW_USERS', 'View Users')}
			{renderAbilitySwitch('MANAGE_USERS', 'Manage Users', 'Invite and kick users.')}
			{renderAbilitySwitch('RESET_USER_PASSWORD', 'Reset user Passwords',
				'Send password reset emails, and directly set user passwords.')}

			<span class='RoleEditor-AbilityCategory'>Role Management</span>

			{renderAbilitySwitch('MANAGE_ROLES', 'Manage Roles', 'Add, remove, and reorder roles.', false)}
		</div>
	);
}
