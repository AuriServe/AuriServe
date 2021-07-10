import * as Preact from 'preact';
import { useParams } from 'react-router-dom';
import { useData, QUERY_USERS } from '../Graph';

import { Title, Page, Card } from '../structure';
// import UserRolesList from '../user/UserRolesList';

export default function UserPage() {
	const { id } = useParams<{ id: string }>();
	const [ { users } ] = useData(QUERY_USERS, []);
	const user = (users ?? []).filter(u => u.id === id)[0];

	return (
		<Page>
			<Title>{id}</Title>
			<Card class='!max-w-3xl'>
				<div class='flex items-center gap-4'>
					{user && <Preact.Fragment>
						<img class='w-24 h-24 rounded-full border-4 border-blue-600 bg-blue-600/50 ring-4 ring-blue-600/25'
							src='/admin/asset/icon/user-color.svg' alt=''/>
						<div class='flex flex-col pb-2'>
							<h1 class='text-2xl font-medium'>{user.username}</h1>
							<h2 class='text-gray-400 dark:text-gray-600'>{user.id}</h2>
							<p class='text-gray-500'>{user.emails[0] ?? <em>No email address</em>}</p>
							{/* <UserRolesList user={user} wrap={true} edit={true} />*/}
						</div>
					</Preact.Fragment>}
				</div>
			</Card>
		</Page>
	);
}
