import { h } from 'preact';

import Svg from '../../Svg';
import Tooltip from '../../Tooltip';
import { merge, tw } from '../../../Twind';
import * as Icon from '../../../Icon';
import { useData } from '../../../Graph';
import { Classes, useClasses } from '../../../Hooks';

interface Props {
	roles: string[];
	class?: Classes;
	onAdd?: () => void;
}

export default function UserRoles(props: Props) {
	const [{ roles }] = useData([], []);
	const classes = useClasses(props.class);

	return (
		<ul class={merge(tw`flex gap-2`, classes.get(''))}>
			{props.roles
				.filter((role) => !role.startsWith('@') && role !== '_everyone')
				.map((role) => (
					<li
						key={role}
						class={merge(tw`border-(2 gray-500) text-(xs gray-100) rounded-full
							font-medium px-2 pl-1.5 py-0.5 flex gap-1 items-center`, classes.get('role'))}>
						<div class={tw`w-2 h-2 rounded-full bg-gray-300`} />
						{roles?.find((r) => r.identifier === role)?.name ?? role}
					</li>
				))}

			{props.onAdd && <li
				class={merge(
					tw`bg-gray-(500/30 hover:500/75) text-(xs gray-100) rounded-full font-medium flex gap-1 items-center`,
					classes.get('add'))}>
				<Svg src={Icon.add} size={6} class={tw`icon-p-gray-200`} />
				<Tooltip small position='bottom' label='Add Role' />
			</li>}
		</ul>
	)
}
