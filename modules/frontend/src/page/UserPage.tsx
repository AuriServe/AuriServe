import * as Preact from 'preact';
import { useMemo } from 'preact/hooks';
import { useQuery, QUERY_USERS } from '../Graph';

import './UserPage.sass';

import Title from '../Title';
import UserRolesList from '../user/UserRolesList';

export default function UserPage() {
	const [ { users } ] = useQuery(QUERY_USERS);
	const id = useMemo(() => window.location.pathname.replace(/^\/admin\/users\//g, ''), []);
	const user = (users ?? []).filter(u => u.id === id)[0];

	return (
		<div class='Page UserPage'>
			<Title>{id}</Title>
			<section class='Page-Card UserPage-Card'>
				<div class='UserPage-Header'>
					{user && <Preact.Fragment>
						<img class='UserPage-Icon' src='/admin/asset/icon/user-color.svg' alt=''/>
						<div class='UserPage-Details'>
							<h1 class='UserPage-Name'>{user.username}</h1>
							<h2 class='UserPage-Identifier'>{user.id}</h2>
							<UserRolesList user={user} wrap={true} edit={true} />
						</div>
					</Preact.Fragment>}
				</div>
			</section>
		</div>
	);
}
