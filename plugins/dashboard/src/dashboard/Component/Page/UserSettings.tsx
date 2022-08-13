import { h } from 'preact';
import { useState } from 'preact/hooks';

import Svg from '../Svg';
import Card from '../Card';
import Modal from '../Modal';
import Button from '../Button';
import Tooltip from '../Tooltip';
import * as Icon from '../../Icon';

import { tw } from '../../Twind';

import { QUERY_ROLES, QUERY_USERS, useData, executeQuery, MUTATE_CREATE_PASSWORD_RESET_TOKEN } from '../../Graph';
import { User } from 'users';
import { useNavigate } from 'react-router-dom';
// const users = [
// 	{
// 		name: 'Auri',
// 		identifier: 'aurailus',
// 		roles: ['Administrator', 'Editor', '@aurailus', '_everyone'],
// 	},
// 	{
// 		name: 'John Doe',
// 		identifier: 'johndoe',
// 		roles: ['Administrator', 'Editor', '_everyone'],
// 	},
// 	{ name: 'Mary', identifier: 'mary', roles: ['Editor', '@mary', '_everyone'] },
// 	{ name: 'June', identifier: 'june', roles: ['@june', '_everyone'] },
// 	{ name: 'Marcus', identifier: 'marcus', roles: ['_everyone'] },
// ];

interface UserItemProps {
	name: string;
	identifier: string;
	roles: string[];
	onClick?: () => void;
}

function UserItem(props: UserItemProps) {
	const [{ roles }] = useData([], []);

	return (
		<li class={tw`w-full`}>
			<Button.Unstyled onClick={props.onClick}
				class={tw`text-left w-full grid grid-cols-[max-content_8rem_8rem_1fr] gap-3 p-2
					rounded items-center hover:bg-gray-750 transition cursor-pointer`}>
				<Svg
					src={Icon.user_circle}
					size={6}
					class={tw`p-1 rounded-full bg-accent-600/50 icon-p-accent-300 icon-s-transparent`}
				/>
				<p class={tw`font-medium text-gray-100 leading-none pt-0.5`}>{props.name}</p>
				<p class={tw`font-medium text-(gray-300 sm) leading-none flex gap-0.5`}>
					<Svg src={Icon.at} size={4} class={tw`icon-p-gray-300 -mt-px`} />
					{props.identifier}
				</p>
				<ul class={tw`flex gap-2 justify-end pr-1`}>
					{props.roles.findIndex((role) => role.startsWith('@')) !== -1 && (
						<li
							class={tw`border-(2 accent-900) bg-accent-600/10 text-(xs gray-100)
								rounded-full font-medium px-2 p-0.5 flex gap-1 items-center`}>
							<Svg
								src={Icon.at}
								size={4}
								class={tw`icon-p-accent-300 icon-s-accent-300 -mt-px`}
							/>
							<Tooltip small position='bottom' label='User Permissions' />
						</li>
					)}
					{props.roles
						.filter((role) => !role.startsWith('@') && role !== '_everyone')
						.map((role) => (
							<li
								key={role}
								class={tw`border-(2 gray-500) text-(xs gray-100) rounded-full
									font-medium px-2 pl-1.5 py-0.5 flex gap-1 items-center`}>
								<div class={tw`w-2 h-2 rounded-full bg-gray-300`} />
								{roles?.find((r) => r.identifier === role)?.name ?? role}
							</li>
						))}

					{/* <li
						class={tw`bg-gray-(500/30 hover:500/75) text-(xs gray-100) rounded-full font-medium flex gap-1 items-center`}>
						<Svg src={Icon.add} size={6} class={tw`icon-p-gray-200`} />
						<Tooltip small position='bottom' label='Add Role' />
					</li> */}
				</ul>
			</Button.Unstyled>
		</li>
	);
}

interface UserCardProps {
	user: User;
}

function UserCard(props: UserCardProps) {
	const navigate = useNavigate();
	const [state, setState] = useState<'input' | 'pending'>('input');

	async function changePassword() {
		setState('pending');
		const data = await executeQuery(MUTATE_CREATE_PASSWORD_RESET_TOKEN, { identifier: props.user.identifier });
		// const url = `${window.location.host}/dashboard/reset_password/${data.createPasswordResetToken}`;
		// await navigator.clipboard.writeText(url);
		navigate(`/reset_password/${data.createPasswordResetToken}`);
	}

	return (
		<Card class={tw`w-screen max-w-xl`}>
			<Card.Header icon={Icon.user_circle} title={props.user.name} subtitle={props.user.identifier} />
			<Card.Body>
				<Button.Secondary icon={Icon.asterisk} disabled={state === 'pending'}
					onClick={changePassword} label='Change Password'/>
			</Card.Body>
		</Card>
	);
}

export default function UserSettings() {
	const [{ users }] = useData([QUERY_USERS, QUERY_ROLES], []);
	const [expanded, setExpanded] = useState<boolean>(false);
	const listedUsers = (expanded ? users : users?.slice(0, 6)) ?? [];
	const [selectedUser, setSelectedUser] = useState<string>('');

	console.log(selectedUser);

	return (
		<Card>
			<Card.Header
				icon={Icon.users}
				title='Users'
				subtitle='Add, remove, and modify users.'>
				<Button.Secondary
					class={tw`absolute bottom-4 right-4`}
					small
					label='Create User'
					icon={Icon.add}
				/>
			</Card.Header>
			<Card.Body>
				<ul class={tw`flex-(& col) gap-0.5 -m-0.5`}>
					{listedUsers.map((user) => (
						<UserItem
							onClick={() => setSelectedUser(user.identifier)}
							key={user.identifier}
							name={user.name}
							identifier={user.identifier}
							roles={user.roles}
						/>
					))}
					{!expanded && ((users?.length ?? 0) > 6) && (
						<button
							onClick={() => setExpanded(!expanded)}
							class={tw`relative flex gap-3 p-2 rounded-md items-center hover:bg-gray-input transition`}>
							<div
								class={tw`absolute bottom-[calc(100%+2px)] -left-1 w-[calc(100%+0.5rem)] h-10 bg-gradient-to-b from-transparent via-gray-800/80 to-gray-800 will-change-transform interact-none`}
							/>
							<Svg
								src={Icon.dropdown}
								size={6}
								class={tw`p-1 rounded-full bg-gray-600 icon-p-accent-300`}
							/>
							<p class={tw`font-medium text-gray-200 leading-none pt-0.5`}>View All</p>
						</button>
					)}
				</ul>
			</Card.Body>
			<Modal active={selectedUser !== ''} onClose={() => setSelectedUser('')}>
				{selectedUser !== '' && <UserCard user={users!.find((u) => u.identifier === selectedUser)!} />}
			</Modal>
		</Card>
	);
}
