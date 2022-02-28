import { h } from 'preact';

import Svg from '../Svg';

import { tw, merge } from '../../Twind';

interface Props {
	icon?: string;
	label: string;
	description?: string;

	style?: any;
	class?: string;
}

export default function Notice(props: Props) {
	return (
		<div
			class={merge(
				tw`flex-(& col) px-2.5 py-3 rounded transition border-(2 gray-700) group`,
				props.class
			)}
			style={props.style}>
			<div class={tw`flex gap-3`}>
				{props.icon && <Svg src={props.icon} size={6} class={tw`shrink-0 -mr-0.5`} />}
				<p
					class={tw`block font-medium leading-none grow transition truncate pt-[5px] text-(gray-500 dark:gray-100)`}>
					{props.label}
				</p>
			</div>
			{props.description && (
				<p
					class={tw`text-sm leading-5 mt-1.5 text-gray-200
						${props.icon && 'ml-8 pl-0.5'}`}>
					{props.description}
				</p>
			)}
		</div>
	);
}
