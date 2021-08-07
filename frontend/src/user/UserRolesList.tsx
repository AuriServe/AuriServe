import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';

import { User } from 'common/graph/type';

import { usePopupCancel } from '../Hooks';
// import { useQuery, QUERY_ROLES } from '../Graph';

import './UserRolesList.sass';


interface Props {
	user: User;
	wrap?: boolean;
	edit?: boolean;
}

export default function UserRolesList(props: Props) {
	// const [ { roles } ] = useQuery(QUERY_ROLES);
	const ref = useRef<HTMLDivElement>(null);
	const [ editing, setEditing ] = useState<boolean>(false);

	usePopupCancel(ref, () => setEditing(false), () => editing, [ editing ]);

	// const handleRemoveRole = useCallback((role: string) => {
	// 	fetch('/admin/users/role/remove', {
	// 		method: 'POST', cache: 'no-cache',
	// 		headers: {'Content-Type': 'application/json'},
	// 		body: JSON.stringify({ user: props.user.id, role: role })
	// 	}).then(r => r.json()).then(setData);
	// }, [ props.user, setData ]);

	// const handleAddRole = useCallback((role: string) => {
	// 	fetch('/admin/users/role/add', {
	// 		method: 'POST', cache: 'no-cache',
	// 		headers: {'Content-Type': 'application/json'},
	// 		body: JSON.stringify({ user: props.user.id, role: role })
	// 	}).then(r => r.json()).then(setData);

	// 	setEditing(false);
	// }, [ props.user, setData, setEditing ]);

	// const renderRole = (identifier: string, role?: Int.Role) => {
	// 	let style: any = role?.color ? { ['--color']: Color.convert(role.color).toHex(),
	// 		['--bg-color']: Color.convert({ ...role.color, a: 66 / 255 }).toHex() } : {};

	// 	return (
	// 		<li class='UserRolesList-Item' style={style}>
	// 			<button class={'UserRolesList-ItemButton' + (props.edit ? ' Active' : '')}
	// 				onClick={props.edit ? () => handleRemoveRole(identifier) : undefined}>
	// 				<img src='/admin/asset/icon/remove-light.svg' alt='Remove' />
	// 			</button>
	// 			<span>{identifier}</span>
	// 		</li>
	// 	);
	// };

	const renderAddRoleForm = () => {
		return (
			<div class='UserRolesList-AddRoleForm' ref={ref} onClick={e => e.stopPropagation()}>
				<p class='UserRolesList-AddRoleFormHeader'>Add Role</p>
				<ul>
					{/* {(roles ?? []).filter(role => !props.user.roles?.includes(role.id)).map(role => <li>
						<button style={role.color && {['--color']: Color.convert(role.color).toHex()} as any} onClick={() => handleAddRole(role.id)}>
							{role.id}
						</button>
					</li>)}*/}
				</ul>
			</div>
		);
	};

	return (
		<ul class={'UserRolesList' + (props.wrap ? ' Wrap' : '')}>
			{/** props.user.roles?.map(r => renderRole(r, roles?.filter(role => role.id === r)[0])) */}
			{props.edit && <button class='UserRolesList-Item UserRolesList-Add' onClick={() => setEditing(!editing)}>
				<img src='/admin/asset/icon/add-dark.svg' alt='Add'/>
				{editing && renderAddRoleForm()}
			</button>}
		</ul>
	);
};
