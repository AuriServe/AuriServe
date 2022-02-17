import { h } from 'preact';
import { useLocation, useNavigate } from 'react-router-dom';

import Svg from './Svg';
import Tooltip from './Tooltip';
import { Shortcut } from '../Shortcut';
import { UnstyledButton } from './Button';

import { tw } from '../Twind';
import * as icon from '../Icon';

interface SidebarLinkProps {
	label: string;
	icon: string;

	onClick: () => void;
}

function SidebarLink({ label, icon, onClick }: SidebarLinkProps) {
	return (
		<UnstyledButton
			onClick={onClick}
			class={tw`group relative p-1 m-2 w-10 h-10 rounded !outline-none transition bg-(transparent hocus:accent-400/30)
				after:(absolute w-2 h-2 transition transform rotate-45 bg-gray-(50 dark:900) opacity-0
					[clip-path:polygon(0_0,0%_100%,100%_100%)] top-[calc(50%-0.25rem)] left-[calc(100%+0.25rem+.5px)])`}>
			<Svg
				src={icon}
				size={8}
				class={tw`icon-p-accent-(200 group-hocus:100) icon-s-accent-(400 group-hocus:200)`}
			/>

			<Tooltip position='right' offset={20} label={label} />
		</UnstyledButton>
	);
}

interface Props {
	shortcuts: (Shortcut | 'spacer')[];
}

export default function Sidebar({ shortcuts }: Props) {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<aside
			class={tw`fixed z-30 w-14 h-full inset-0 icon-(p-accent-300 s-accent-100) bg-accent-600`}>
			<nav class={tw`flex-(& col) h-full`}>
				<Svg
					src={icon.auriserve}
					size={10}
					role='heading'
					aria-level='1'
					aria-label='AuriServe'
					class={tw`m-2 animate-rocket icon-p-accent-100 icon-s-accent-300`}
				/>

				<div class={tw`w-3/5 h-1 my-2 mx-auto rounded bg-accent-400`} />

				{shortcuts.map((shortcut, i) => {
					if (shortcut === 'spacer') return <div key={i} class={tw`flex-grow`} />;
					return (
						<SidebarLink
							key={i}
							label={shortcut.title}
							icon={shortcut.icon ?? icon.shortcut}
							onClick={() => shortcut.action({ location, navigate })}
						/>
					);
				})}
			</nav>
		</aside>
	);
}
