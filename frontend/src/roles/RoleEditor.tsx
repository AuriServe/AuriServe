// import { h, Fragment } from 'preact';

// import { to, HSVA } from 'common';
// import { Role } from 'common/graph/type';

// import { Label, Annotation, Text, Color as ColorPicker, Toggle, Divider } from '../input';

// import './RoleEditor.sass';

// interface Props {
// 	role: Role;
// 	setRole: (role: Role) => void;
// }

// export default function RoleEditor(props: Props) {
// 	const handleSetColor = (color: HSVA | undefined) => {
// 		const role = Object.assign(JSON.parse(JSON.stringify(props.role)), { color });
// 		props.setRole(role);
// 	};

// 	const handleNameChange = (name: string) => {
// 		props.setRole({ ...JSON.parse(JSON.stringify(props.role)), ...{ name } });
// 	};

// 	const handleToggleAbility = (ability: string) => {
// 		const abilityStr = ability;

// 		const role = Object.assign(JSON.parse(JSON.stringify(props.role)));
// 		if (role.abilities.filter((f: string) => f === abilityStr).length)
// 			role.abilities = role.abilities.filter((f: string) => f !== abilityStr);
// 		else role.abilities.push(abilityStr);

// 		props.setRole(role);
// 	};

// 	const renderAbilitySwitch = (ability: string, title: string, description?: string, sep?: boolean) => {
// 		return (
// 			<Fragment>
// 				<Annotation title={title} description={description}>
// 					<Toggle
// 						onValue={() => handleToggleAbility(ability)}
// 						value={props.role.abilities.filter((f) => f === ability).length > 0}
// 					/>
// 				</Annotation>
// 				{sep !== false && <Divider />}
// 			</Fragment>
// 		);
// 	};

// 	return (
// 		<div class='RoleEditor'>
// 			<Label label='Role Name'>
// 				<Text
// 					style={props.role.color && { color: to(props.role.color, 'hex') }}
// 					value={props.role.name}
// 					onValue={handleNameChange}
// 				/>
// 			</Label>

// 			<Label label='Role Color' />
// 			<div class='RoleEditor-ColorSelector'>
// 				<button class='RoleEditor-ColorTransparent' onClick={() => handleSetColor(undefined)}>
// 					{!props.role.color && <img src='/admin/asset/icon/dash-light.svg' alt='Selected' />}
// 				</button>

// 				<ColorPicker class='RoleEditor-ColorPicker' button value={props.role.color} onValue={handleSetColor} />

// 				{[
// 					'#e12d39',
// 					'#f0b429',
// 					'#6cd410',
// 					'#17b897',
// 					'#0fb5ba',
// 					'#2bb0ed',
// 					'#0967d2',
// 					'#2251cc',
// 					'#8719e0',
// 					'#e019d0',
// 					'#da127d',
// 					'#c52707',
// 					'#cb6e17',
// 					'#399709',
// 					'#048271',
// 					'#099aa4',
// 					'#127fbf',
// 					'#03449e',
// 					'#132dad',
// 					'#690cb0',
// 					'#b30ba3',
// 					'#a30664',
// 				].map((c) => (
// 					<button key={c} style={{ backgroundColor: c }} onClick={() => handleSetColor(to(c, 'hsva'))} title={c}>
// 						{props.role.color && to(props.role.color, 'hex') === c && (
// 							<img src='/admin/asset/icon/check-light.svg' alt='Selected' />
// 						)}
// 					</button>
// 				))}
// 			</div>

// 			<Divider />

// 			<Label label='Abilities</span' />

// 			{renderAbilitySwitch(
// 				'ADMINISTRATOR',
// 				'Administrator',
// 				'Bypass ability checks and role heirarchy. Use with caution.'
// 			)}

// 			{renderAbilitySwitch('VIEW_AUDIT_LOG', 'View Audit Log', 'View global and user Audit Logs.')}

// 			<Label label='Media Management' />

// 			{renderAbilitySwitch('VIEW_MEDIA', 'View Media')}
// 			{renderAbilitySwitch('MANAGE_MEDIA', 'Manage Media', 'Add and remove media assets.')}
// 			{renderAbilitySwitch('REPLACE_MEDIA', 'Replace Media', 'Replace existing media assets with new ones.')}
// 			{renderAbilitySwitch('EDIT_MEDIA_META', 'Edit Media Metadata', 'Edit Media titles and descriptions.')}

// 			<Label label='Page Management' />

// 			{renderAbilitySwitch('VIEW_PAGES', 'View Pages')}
// 			{renderAbilitySwitch('MANAGE_PAGES', 'Manage Pages', 'Add, remove, and relocate pages.')}
// 			{renderAbilitySwitch('EDIT_PAGES', 'Edit Pages')}

// 			<Label label='Theme Management' />

// 			{renderAbilitySwitch('VIEW_THEMES', 'View Themes')}
// 			{renderAbilitySwitch('MANAGE_THEMES', 'Manage Themes', 'Add and remove themes.')}
// 			{renderAbilitySwitch('TOGGLE_THEMES', 'Toggle Themes', 'Enable and disable themes.')}

// 			<Label label='Plugin Management' />

// 			{renderAbilitySwitch('VIEW_PLUGINS', 'View Plugins')}
// 			{renderAbilitySwitch('MANAGE_PLUGINS', 'Manage Plugins', 'Add and remove plugins.')}
// 			{renderAbilitySwitch('TOGGLE_PLUGINS', 'Toggle Plugins', 'Enable and disable plugins.')}

// 			<Label label='User Management' />

// 			{renderAbilitySwitch('VIEW_USERS', 'View Users')}
// 			{renderAbilitySwitch('MANAGE_USERS', 'Manage Users', 'Invite and kick users.')}
// 			{renderAbilitySwitch(
// 				'RESET_USER_PASSWORD',
// 				'Reset user Passwords',
// 				'Send password reset emails, and directly set user passwords.'
// 			)}

// 			<Label label='Role Management' />

// 			{renderAbilitySwitch('MANAGE_ROLES', 'Manage Roles', 'Add, remove, and reorder roles.', false)}
// 		</div>
// 	);
// }
