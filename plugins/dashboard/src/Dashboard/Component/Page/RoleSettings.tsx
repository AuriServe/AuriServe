import { Fragment, h } from 'preact';
import { useMemo } from 'preact/hooks';

// import Svg from '../Svg';
import Card from '../Card';
import Button from '../Button';
import Spinner from '../Spinner';
import { Form, FormSchema, Input } from '../Form';

import { tw } from '../../Twind';
import * as Icon from '../../Icon';
import {
	QUERY_PERMISSIONS,
	QUERY_PERMISSION_CATEGORIES,
	QUERY_ROLES,
	useData,
} from '../../Graph';
import Svg from '../Svg';

export default function UserSettings() {
	const [{ roles, permissions, permissionCategories }] = useData(
		[QUERY_ROLES, QUERY_PERMISSIONS, QUERY_PERMISSION_CATEGORIES],
		[]
	);

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

	const schema = useMemo(() => {
		if (!permissions) return { fields: {} };

		return {
			fields: Object.fromEntries(
				permissions.map((permission) => [
					permission.identifier,
					{
						type: 'toggle',
						label: permission.name,
						description: permission.description,
						default: permission.default,
					},
				])
			),
		} as FormSchema;
		// eslint-disable-next-line
	}, [permissions?.length]);

	return (
		<Card>
			<Card.Header
				icon={Icon.role}
				title='Roles'
				subtitle='Add, remove, and modify roles.'
			/>
			<Card.Body>
				{roles && permissions && permissionCategories ? (
					<div class={tw`flex gap-20 p-2`}>
						<div class={tw`w-96 flex-(& col) gap-1 items-stretch pl-4`}>
							{roles.map(({ identifier, name }) => (
								<Button.Tertiary
									key={identifier}
									label={name}
									class={tw`w-full shrink-0`}
								/>
							))}
						</div>
						<Form
							key={schema.fields.length}
							schema={schema}
							class={tw`flex-(& col) w-full grow pr-8`}>
							{permissionsSorted.map(({ permissions, ...category }) => (
								<Fragment key={category.identifier}>
									<div class={tw`flex gap-2 mt-10 mb-6 first:mt-0`}>
										<Svg
											src={(Icon as any)[category.icon] ?? Icon.star}
											size={6}
											class={tw`p-2 bg-gray-700 rounded-md`}
										/>
										<div class={tw`flex-(& col) gap-1 p-2`}>
											<p class={tw`font-bold text-gray-100`}>{category.name}</p>
											<p>{category.description}</p>
										</div>
									</div>
									<div class={tw`flex-(& col) gap-6`}>
										{permissions.map((identifier) => (
											<Input rounded key={identifier} for={identifier} />
										))}
									</div>
								</Fragment>
							))}
						</Form>
					</div>
				) : (
					<Spinner />
				)}
			</Card.Body>
		</Card>
	);
}
