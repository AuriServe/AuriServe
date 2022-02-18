import { h } from 'preact';

import Svg from '../Svg';
import Tooltip from '../Tooltip';
import { MenuContext } from './Menu';

import { tw } from '../../Twind';
import { useContext } from 'preact/hooks';

interface Props {
	icon?: string;
	label: string;

	disabled?: boolean;
	onClick: () => true | void;
}

export default function Shortcut(props: Props) {
	const ctx = useContext(MenuContext);
	const handleClick = () => {
		const keepAlive = props.onClick?.() ?? false;
		if (!keepAlive) ctx.onClose?.();
	};

	return (
		<button
			disabled={props.disabled}
			onClick={handleClick}
			class={tw`group flex px-1.5 py-1.5 items-center text-left
			gap-3 rounded transition duration-75 cursor-pointer
			icon-p-gray-100 icon-s-gray-300 text-gray-200
			disabled:!(cursor-auto bg-transparent icon-p-gray-400 icon-s-gray-600)
			hocus:(bg-accent-400/5 icon-p-accent-50 icon-s-accent-400 text-accent-100)`}>
			<Svg src={props.icon ?? ''} size={6} />
			{!props.disabled && (
				<Tooltip
					label={props.label}
					delay={250}
					offset={4}
					position='bottom'
					bg='gray-600'
					class={tw`!z-[60] text-sm !px-2 !py-1`}
				/>
			)}
		</button>
	);
}
