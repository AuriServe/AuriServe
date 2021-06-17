import * as Preact from 'preact';
// import { NavLink as Link } from 'react-router-dom';

import { User } from 'common/graph/type';

import { Button } from '../structure';
// import UserRolesList from './UserRolesList';

// import './UserItem.sass';

interface Props {
	user: User;
}

export default function UserItem(props: Props) {
	return (
		<Button to={'/users/' + props.user.id} class='flex gap-3 px-2 py-1 !bg-transparent !border-transparent'>
			<img class='w-8 h-8' src='/admin/asset/icon/user-color.svg' alt=''/>
			<h2 class='w-1/5 max-w-32'>{props.user.username}</h2>
			<p class='flex-grow text-gray-300 dark:text-gray-500 font-normal'>{props.user.id}</p>
			{/* <UserRolesList user={props.user} />*/}
			<img class='w-6 h-6 m-2' src='/admin/asset/icon/menu-dark.svg' alt=''/>
		</Button>
	);
}
