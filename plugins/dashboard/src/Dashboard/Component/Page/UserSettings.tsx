import { h } from 'preact';

import Card from '../Card';

import { tw } from '../../Twind';

import * as Icon from '../../Icon';
import Svg from '../Svg';
import Tooltip from '../Tooltip';

const users = [
	{
		name: 'Auri',
		identifier: 'aurailus',
		roles: ['Administrator', 'Editor', '@aurailus', '_everyone'],
	},
	{
		name: 'John Doe',
		identifier: 'johndoe',
		roles: ['Administrator', 'Editor', '_everyone'],
	},
	{ name: 'Mary', identifier: 'mary', roles: ['Editor', '@mary', '_everyone'] },
	{ name: 'June', identifier: 'june', roles: ['@june', '_everyone'] },
	{ name: 'Marcus', identifier: 'marcus', roles: ['_everyone'] },
];

export default function UserSettings() {
	return (
		<Card>
			<Card.Header
				icon={Icon.users}
				title='Users'
				subtitle='Add, remove, and modify users.'
			/>
			<Card.Body>
				<ul class={tw`flex-(& col) gap-0.5 -m-0.5`}>
					{users.map((user) => (
						<li
							key={user}
							class={tw`grid grid-cols-[max-content_8rem_8rem_1fr] gap-3 p-2
								rounded items-center hover:bg-gray-750 transition cursor-pointer`}>
							<Svg
								src={Icon.user_circle}
								size={6}
								class={tw`p-1 rounded-full bg-accent-600/50 icon-p-transparent icon-s-accent-300`}
							/>
							<p class={tw`font-medium text-gray-100 leading-none pt-0.5`}>{user.name}</p>
							<p class={tw`font-medium text-(gray-300 sm) leading-none flex gap-0.5`}>
								<Svg src={Icon.at} size={4} class={tw`icon-p-gray-300 -mt-px`} />
								{user.identifier}
							</p>
							<ul class={tw`flex gap-2 justify-end pr-1`}>
								{user.roles.findIndex((role) => role.startsWith('@')) !== -1 && (
									<li
										class={tw`border-(2 accent-900) bg-accent-600/10 text-(xs gray-100) rounded-full font-medium px-2 p-0.5 flex gap-1 items-center`}>
										<Svg
											src={Icon.at}
											size={4}
											class={tw`icon-p-accent-300 icon-s-accent-300 -mt-px`}
										/>
										<Tooltip small position='bottom' label='User Permissions' />
									</li>
									// <li
									// 	class={tw`border-(2 transparent) bg-accent-600/50 text-(xs gray-100) rounded-full font-medium p-0.5 flex gap-1 items-center`}>
									// 	<Svg
									// 		src={Icon.user_circle}
									// 		size={4}
									// 		class={tw`icon-p-transparent icon-s-accent-300 -mt-px`}
									// 	/>
									// </li>
								)}
								{user.roles
									.filter((role) => !role.startsWith('@') && role !== '_everyone')
									.map((role) => (
										<li
											key={role}
											class={tw`border-(2 gray-500) text-(xs gray-100) rounded-full
												font-medium px-2 pl-1.5 py-0.5 flex gap-1 items-center`}>
											<div class={tw`w-2 h-2 rounded-full bg-gray-300`} />
											{role}
										</li>
									))}

								<li
									class={tw`bg-gray-700 text-(xs gray-100) rounded-full font-medium flex gap-1 items-center`}>
									<Svg src={Icon.add} size={6} class={tw`icon-p-gray-200`} />
									<Tooltip small position='bottom' label='Add Role' />
								</li>
							</ul>
						</li>
					))}
					<li
						class={tw`flex gap-3 p-2 rounded-md items-center hover:bg-gray-input transition`}>
						<Svg
							src={Icon.add}
							size={6}
							class={tw`p-1 rounded-full bg-gray-600 icon-p-accent-300`}
						/>
						<p class={tw`font-medium text-gray-200 leading-none pt-0.5`}>Create User</p>
					</li>
				</ul>
			</Card.Body>
		</Card>
	);
}
