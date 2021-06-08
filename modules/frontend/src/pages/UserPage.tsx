import * as Preact from 'preact';
import { useMemo } from 'preact/hooks';
import { useQuery, QUERY_USERS } from '../Graph';

import { Title, Page, Card } from '../structure';
import UserRolesList from '../user/UserRolesList';

export default function UserPage() {
	const [ { users } ] = useQuery(QUERY_USERS);
	const id = useMemo(() => window.location.pathname.replace(/^\/admin\/users\//g, ''), []);
	const user = (users ?? []).filter(u => u.id === id)[0];

	return (
		<Page>
			<Title>{id}</Title>
			<Card class='!max-w-3xl'>
				<div class='flex items-center gap-4'>
					{user && <Preact.Fragment>
						<img class='w-32 h-32 rounded' src='/admin/asset/icon/user-color.svg' alt=''/>
						<div class='flex flex-col'>
							<h1 class='text-3xl font-medium'>{user.username}</h1>
							<h2 class='text-gray-200'>{user.id}</h2>
							<UserRolesList user={user} wrap={true} edit={true} />
						</div>
					</Preact.Fragment>}
				</div>
			</Card>
		</Page>
	);
}
