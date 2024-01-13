import { h } from 'preact';
import { useState } from 'preact/hooks';

import Svg from '../../Svg';
import Card from '../../Card';
import Modal from '../../Modal';
import Button from '../../Button';
import UserCard from './UserCard';
import { tw } from '../../../Twind';
import * as Icon from '../../../Icon';
import { QUERY_ROLES, QUERY_USERS, useData } from '../../../Graph';
import UserRoles from './UserRoles';
import Table from '../../Table';

interface UserData {
	identifier: string;
	name: string;
	emails: string[];
	roles: string[];
}

export default function UserSettings() {
	const [{ users }] = useData([QUERY_USERS, QUERY_ROLES], []);
	const [ selectedUser, setSelectedUser ] = useState<string>('');

	return (
		<Card>
			<Card.Header
				icon={Icon.users}
				title='Users'
			>
				<Button.Secondary
					class={tw`absolute top-4 right-4`}
					small
					label='Create User'
					icon={Icon.add}
				/>
			</Card.Header>
			<Card.Body class={tw`p-0 -mt-3`}>
				<Table<UserData>
					columns={[
						{ name: 'name', size: '184px', sortable: true },
						{ name: 'identifier', size: '1fr', sortable: true },
						{ name: 'roles', size: '90px', sortable: false }
					]}
					idKey='identifier'
					data={users ?? []}
					sortBy='id'
					itemsPerPage={100000}
				>
					<Table.Header class={tw`bg-gray-750 px-2.5 py-1 sticky top-0 z-30 shadow-lg shadow-gray-800`}/>
					<Table.Body<UserData> class={tw`p-2.5`}>
						{({ data: user }) =>
							<li class={tw`w-full`}>
								<Button.Unstyled
									class={tw`text-left w-full grid grid-cols-[max-content_8rem_8rem_1fr] gap-3 p-2
										rounded items-center hover:bg-gray-750 transition cursor-pointer`}
									onClick={() => setSelectedUser(user.identifier)}
								>
									<Svg
										src={Icon.user_circle}
										size={6}
										class={tw`p-1 rounded-full bg-accent-600/50 icon-p-accent-300 icon-s-transparent`}
									/>
									<p class={tw`font-medium text-gray-100 leading-none pt-0.5`}>{user.name}</p>
									<p class={tw`font-medium text-(gray-300 sm) leading-none flex gap-0.5`}>
										<Svg src={Icon.at} size={4} class={tw`icon-p-gray-300 -mt-px`} />
										{user.identifier}
									</p>
									<UserRoles roles={user.roles} class={tw`justify-end`} onAdd={() => {}}/>
								</Button.Unstyled>
							</li>
						}
					</Table.Body>
				</Table>
			</Card.Body>
			<Modal active={selectedUser !== ''} onClose={() => setSelectedUser('')}>
				{selectedUser !== '' && <UserCard user={users!.find((u) => u.identifier === selectedUser)!} />}
			</Modal>
		</Card>
	);
}
