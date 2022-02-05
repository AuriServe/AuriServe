import { h } from 'preact';

import Svg from '../Svg';

import { tw } from '../Twind';

interface Props {
	icon?: string;
	label: string;
}

export default function Shortcut(props: Props) {
	return (
		<div
			class={tw`group flex px-1.5 py-1.5 items-center text-left
			gap-3 rounded transition duration-75 cursor-pointer
			hocus:(bg-accent-400/5 icon-p-accent-50 icon-s-accent-400 text-accent-100)
			icon-p-gray-100 icon-s-gray-300 text-gray-200
			hocus:(bg-accent-400/5 icon-p-accent-50 icon-s-accent-400 text-accent-100)`}>
			<Svg src={props.icon ?? ''} size={6} />
		</div>
	);
}
