import { h } from 'preact';
import { useData, QUERY_USERS } from '../../Graph';

import UserItem from '../../user/UserItem';
import Label from '../../input/InputLabel';

export default function RolesSettings() {
	const [ { users } ] = useData(QUERY_USERS, []);

	return (
		<div class='w-full max-w-3xl mx-auto'>
			<Label label='Users' />
			{users && users.map(user => <UserItem key={user.id} user={user} />)}
		</div>
	);
}
