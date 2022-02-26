import { Fragment, h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';

import Svg from '../Svg';
import Card from '../Card';
import Button from '../Button';
import Spinner from '../Spinner';
import { FloatingDescription, Form, FormSchema, Input } from '../Form';

import * as Icon from '../../Icon';
import { merge, tw } from '../../Twind';
import {
	QUERY_PERMISSIONS,
	QUERY_PERMISSION_CATEGORIES,
	QUERY_ROLES,
	useData,
} from '../../Graph';

interface Role {
	name: string;
	identifier: string;
	permissions: Record<string, boolean>;
}

type RoleType = 'user' | 'role' | 'default';

function getRoleType(identifier: string): RoleType {
	if (identifier.startsWith('@')) return 'user';
	else if (identifier === '_everyone') return 'default';
	return 'role';
}

function RoleLabel(props: {
	class?: string;
	name: string;
	type: RoleType;
	pad: boolean;
}) {
	return (
		<span class={merge(tw`inline-flex font-medium gap-1.5 items-center`, props.class)}>
			{props.type === 'user' ? (
				<Svg
					src={Icon.user_circle}
					size={4}
					class={tw`p-1 mx-0.5 ${!props.pad && 'ml-2 mr-0'}
					shrink-0 rounded-full bg-accent-600/50 icon-p-transparent icon-s-accent-300`}
				/>
			) : (
				<div class={tw`w-2.5 h-2.5 ml-2.5 ${props.pad ? 'mr-2' : 'mr-0'} grid`}>
					<div
						class={tw`-ml-px mr-px rounded-full ${
							props.type === 'role' ? 'bg-accent-300' : 'border-2 border-gray-300'
						}`}
					/>
				</div>
			)}
			<span
				class={tw`pt-px -mb-px truncate
					${props.type === 'role' && 'text-accent-200'}
					${props.type === 'default' && 'text-gray-200'}`}>
				{props.name}
			</span>
		</span>
	);
}

function RoleButton(props: {
	name: string;
	type: RoleType;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<li>
			<Button.Unstyled
				onClick={props.onClick}
				class={tw`grid transition duration-75 rounded w-full px-1 py-1.5
					${props.active && 'bg-gray-600 text-white'}
					${!props.active && 'hover:bg-gray-700 bg-gray-750 text-gray-50'}`}>
				<RoleLabel pad name={props.name} type={props.type} />
			</Button.Unstyled>
		</li>
	);
}

export default function PermissionSettings() {
	const [{ roles: rawRoles, permissions, permissionCategories }] = useData(
		[QUERY_ROLES, QUERY_PERMISSIONS, QUERY_PERMISSION_CATEGORIES],
		[]
	);

	const [roles, setRoles] = useState<Role[] | undefined>(undefined);
	const [current, setCurrent] = useState<string | null>(null);

	useEffect(() => {
		if (!rawRoles || !permissions) return;
		setRoles(
			rawRoles.map((role) => ({
				...role,
				permissions: Object.fromEntries(
					permissions.map((permission) => [
						permission.identifier,
						role.permissions.includes(permission.identifier),
					])
				),
			}))
		);
	}, [rawRoles, permissions]);

	const permissionsSorted = useMemo(() => {
		if (!permissions || !permissionCategories) return [];
		return permissionCategories
			.sort((a, b) => b.priority - a.priority)
			.map((category) => ({
				...category,
				permissions: permissions
					.filter((permission) => permission.category === category.identifier)
					.map((permission) => permission.identifier),
			}))
			.filter((category) => category.permissions.length > 0);
		// eslint-disable-next-line
	}, [permissions?.length, permissionCategories?.length]);

	const role = current && roles?.find((role) => role.identifier === current);

	const schema = useMemo(() => {
		if (!permissions || !role) return { fields: {} };

		return {
			fields: {
				identifier: {
					type: 'text',
					default: role.identifier,
				},
				name: {
					type: 'text',
					label: 'Role Name',
					description: 'The name of the role.',
					validation: {
						maxLength: 24,
					},
					default: role.name,
				},
				permissions: Object.fromEntries(
					permissions.map((permission) => [
						permission.identifier,
						{
							type: 'toggle',
							icon: permission.identifier === 'administrator' ? Icon.role : undefined,
							label: permission.name,
							description: permission.description,
							default: role.permissions[permission.identifier],
						},
					])
				),
			},
		} as FormSchema;
	}, [permissions, role]);

	if (!roles || !permissions || !permissionCategories) {
		return (
			<Card>
				<Card.Header
					icon={Icon.role}
					title='Permissions'
					subtitle='Manage user and role permissions.'
				/>
				<Card.Body>
					<Spinner class={tw`mx-auto my-24`} />
				</Card.Body>
			</Card>
		);
	}

	const handleSetRole = (data: any) => {
		const newRoles = [...roles];
		newRoles[newRoles.findIndex((role) => role.identifier === current)] = data;
		console.log(newRoles);
		setRoles(newRoles);
	};

	const handleSetCurrent = (identifier: string) => {
		setCurrent((last) => {
			if (last === identifier) return null;
			return identifier;
		});
	};

	const userRoles: Role[] = [];
	const regularRoles: Role[] = [];
	let everyoneRole: Role | undefined;

	roles.forEach((role) => {
		switch (getRoleType(role.identifier)) {
			case 'user':
				userRoles.push(role);
				break;
			case 'role':
				regularRoles.push(role);
				break;
			case 'default':
				everyoneRole = role;
				break;
		}
	});

	return (
		<Card>
			<Card.Header
				icon={Icon.role}
				title='Permissions'
				subtitle='Manage user and role permissions.'
			/>
			<Card.Body class={tw`animate-drop-fade-in`}>
				<div class={tw`flex gap-8 p-2 pt-0`}>
					{/** Sidebar */}
					<div class={tw`relative shrink-0 w-44`}>
						<div class={tw`w-full flex-(& col) sticky top-0 pt-2.5`}>
							<div class={tw`flex gap-2`}>
								<p class={tw`grow font-medium pt-1 mt-px pb-3.5`}>Users & Roles</p>
								<Button.Tertiary
									size={6}
									icon={Icon.add}
									label='Add Role'
									iconOnly
									class={tw`!ring-offset-gray-800 mt-1`}
								/>
							</div>

							<ul class={tw`flex-(& col) gap-1.5`}>
								{userRoles.map((role) => (
									<RoleButton
										key={role.identifier}
										name={role.name}
										type='user'
										active={current === role.identifier}
										onClick={() => handleSetCurrent(role.identifier)}
									/>
								))}
								{userRoles.length > 0 && regularRoles.length > 0 && (
									<div class={tw`h-1`} />
								)}
								{regularRoles.map((role) => (
									<RoleButton
										key={role.identifier}
										name={role.name}
										type='role'
										active={current === role.identifier}
										onClick={() => handleSetCurrent(role.identifier)}
									/>
								))}
								{regularRoles.length > 0 && everyoneRole && <div class={tw`h-1`} />}
								{everyoneRole && (
									<RoleButton
										key={everyoneRole.identifier}
										name={everyoneRole.name}
										type='default'
										active={current === everyoneRole.identifier}
										onClick={() => handleSetCurrent(everyoneRole!.identifier)}
									/>
								)}
							</ul>
						</div>
					</div>

					{/** Role Editor */}
					{!role ? (
						<div class={tw`flex-(& col) w-full items-center py-20 animate-rise-fade-in`}>
							<Svg
								src={Icon.role}
								size={12}
								class={tw`mb-4 p-6 rounded-lg bg-gray-input`}
							/>
							<p class={tw`text-gray-300`}>Select a User or Role to edit.</p>
						</div>
					) : (
						<Form
							schema={schema}
							key={role.identifier}
							onChange={(data) => handleSetRole(data)}
							class={tw`flex-(& col) w-full animate-rise-fade-in`}>
							<FloatingDescription position='right' />

							<div class={tw`flex gap-2 sticky pt-2.5 top-0 z-10 bg-gray-800`}>
								<p
									class={tw`grow font-medium flex items-center pt-1 -mb-px pb-3.5 truncate`}>
									Editing{' '}
									<RoleLabel
										type={getRoleType(role.identifier)}
										name={role.name}
										pad={false}
										class={tw`mb-0.5`}
									/>
								</p>
							</div>

							<div class={tw`flex-(& col) gap-2`}>
								{getRoleType(role.identifier) === 'role' && <Input for='name' />}
								<Input for='permissions.administrator' />
							</div>

							{permissionsSorted.map(({ permissions, ...category }) => (
								<Fragment key={category.identifier}>
									<div class={tw`flex mt-5 mb-1.5 first:mt-0`}>
										<Svg
											src={(Icon as any)[category.icon] ?? Icon.star}
											size={6}
											class={tw`p-1`}
										/>
										<div class={tw`flex-(& col) gap-1 p-1 mt-px`}>
											<p class={tw`font-medium text-gray-200`}>{category.name}</p>
											<p>{category.description}</p>
										</div>
									</div>
									<div class={tw`grid-(& cols-3) gap-2`}>
										{permissions
											.filter((identifier) => identifier !== 'administrator')
											.map((identifier) => (
												<Input
													key={identifier}
													rounded
													class={tw`min-h-[98px]`}
													for={`permissions.${identifier}`}
												/>
											))}
									</div>
								</Fragment>
							))}
						</Form>
					)}
				</div>
			</Card.Body>
		</Card>
	);
}
