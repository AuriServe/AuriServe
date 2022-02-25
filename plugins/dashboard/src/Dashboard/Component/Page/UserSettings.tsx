import { h } from 'preact';

import Card from '../Card';

import { tw } from '../../Twind';

import * as Icon from '../../Icon';
import Svg from '../Svg';

const users = [
	{
		name: 'Auri',
		identifier: 'aurailus',
		roles: ['administrator', 'editor', '@aurailus', '_everyone'],
	},
	{
		name: 'John Doe',
		identifier: 'johndoe',
		roles: ['administrator', 'editor', '@johndoe', '_everyone'],
	},
	{ name: 'Mary', identifier: 'mary', roles: ['editor', '@mary', '_everyone'] },
	{ name: 'June', identifier: 'june', roles: ['@june', '_everyone'] },
	{ name: 'Marcus', identifier: 'marcus', roles: ['@marcus', '_everyone'] },
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
							class={tw`grid grid-cols-[max-content_8rem_8rem_1fr] gap-3 p-2 rounded-md items-center hover:bg-gray-input transition`}>
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
								{user.roles
									.filter((role) => !role.startsWith('@') && role !== '_everyone')
									.map((role) => (
										<li
											key={role}
											class={tw`border-(2 gray-500) text-(xs gray-100) rounded-full font-medium px-2 pl-1.5 py-0.5 flex gap-1 items-center`}>
											<div class={tw`w-2 h-2 rounded-full bg-gray-300`} />
											{role}
										</li>
									))}
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
