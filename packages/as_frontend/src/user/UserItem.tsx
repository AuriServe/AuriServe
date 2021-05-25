import * as Preact from 'preact';
import { User } from 'as_common/graph/interface';
import { NavLink as Link } from 'react-router-dom';

import './UserItem.sass';

import UserRolesList from './UserRolesList';

interface Props {
	user: User;
}

export default function UserItem(props: Props) {
	return (
		<Link to={'/users/' + props.user.id} className='UserItem'>
			<img class='UserItem-Icon' src='/admin/asset/icon/user-color.svg' alt=''/>
			<h2 class='UserItem-Name'>{props.user.username}</h2>
			<p class='UserItem-Identifier'>{props.user.emails[0] ?? ''}</p>
			<UserRolesList user={props.user} />
			<img class='UserItem-More' src='/admin/asset/icon/menu-dark.svg' alt=''/>
		</Link>
	);
}
