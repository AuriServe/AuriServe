import { h } from 'preact';

import Card from '../../Card';
import UserItem from '../../user/UserItem';

import { useData, QUERY_USERS } from '../../Graph';

import icon_users from '@res/icon/users.svg';

export default function UsersSettings() {
	const [ { users } ] = useData(QUERY_USERS, []);

	return (
		<Card>
			<Card.Header icon={icon_users} title='Users' subtitle='Manage users and their permissions.'/>
			<Card.Body class='h-48'>
				{users && users.map(user => <UserItem key={user.id} user={user} />)}
			</Card.Body>
		</Card>
	);
}
