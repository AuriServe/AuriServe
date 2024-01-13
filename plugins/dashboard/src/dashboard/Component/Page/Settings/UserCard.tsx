import { h } from 'preact';
import { User } from 'users';
import { useStore } from 'vibin-hooks';
import { useNavigate } from 'react-router-dom';

import Svg from '../../Svg';
import Card from '../../Card';
import Button from '../../Button';
import { tw } from '../../../Twind';
import * as Icon from '../../../Icon';
import { executeQuery, MUTATE_CREATE_PASSWORD_RESET_TOKEN } from '../../../Graph';
import UserRoles from './UserRoles';

interface Props {
	user: User;
}

export default function UserCard(props: Props) {
	const navigate = useNavigate();
	const state = useStore<'input' | 'pending'>('input');

	async function handleChangePassword() {
		state('pending');
		const data = await executeQuery(MUTATE_CREATE_PASSWORD_RESET_TOKEN, { identifier: props.user.identifier });
		navigate(`/reset_password/${data.createPasswordResetToken}`);
	}

	async function handleDelete() {
		console.log('dewete :3')
	}

	async function handleAddRole() {
		console.log('add unimplemented')
	}

	return (
		<Card class={tw`w-72 overflow-hidden`}>
			{/* <Card.Header icon={Icon.user_circle} title={props.user.name} subtitle={props.user.identifier} /> */}
			<Card.Body class={tw`p-0 flex-(& col)`}>
				<div class={tw`aspect-[16/7] bg-gradient-to-br from-accent-400 to-accent-700`}/>

				<div class={tw`w-24 aspect-square rounded-full border-([6px] gray-800) grid
					overflow-hidden ml-[9px] -my-12 translate-y-1`}>
					<Svg src={Icon.user_circle} class={tw`icon-p-accent-300 icon-s-transparent bg-accent-800 w-full h-full`} />
				</div>

				<p class={tw`text-gray-100 text-lg font-medium pt-1.5 mt-px pb-1 mb-px pl-28 leading-none`}>
					{props.user.name}
				</p>

				<p class={tw`font-semibold text-(gray-300 xs) leading-none flex gap-px pl-28 -ml-0.5`}>
					<Svg src={Icon.at} size={3.5} class={tw`icon-p-gray-300 -mt-px`} />
					{props.user.identifier}
				</p>

				<div class={tw`p-4 flex-(& col) pt-0`}>
					<p class={tw`text-(xs gray-300) font-bold uppercase tracking-widest leading-none mt-4`}>
						Roles
					</p>

					<UserRoles roles={props.user.roles} class={tw`flex-wrap mt-1.5 -ml-0.5`} onAdd={handleAddRole}/>

					<p class={tw`text-(xs gray-300) font-bold uppercase tracking-widest leading-none mt-4`}>
						Notes
					</p>

					<div class={tw`flex-(&) gap-2 mt-1.5`}>
						<Button.Tertiary size={8} icon={Icon.asterisk} disabled={state() === 'pending'}
							onClick={handleChangePassword} label='Reset Password' class={tw`w-full`}/>
						<Button.Tertiary size={8} icon={Icon.trash} disabled={state() === 'pending'}
							onClick={handleDelete} label='Delete' class={tw`w-full`}/>
					</div>
				</div>

			</Card.Body>
		</Card>
	);
}
