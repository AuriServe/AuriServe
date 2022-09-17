import { h } from 'preact';
import { useLocation, useNavigate } from 'react-router-dom';

import Svg from './Svg';
import Tooltip from './Tooltip';
import { Shortcut } from '../Shortcut';
import { UnstyledButton } from './Button';

import { tw } from '../Twind';
import * as Icon from '../Icon';
import { Button } from '../Main';

interface SidebarLinkProps {
	label: string;
	icon: string;

	onClick: () => void;
}

function SidebarLink({ label, icon, onClick }: SidebarLinkProps) {
	return (
		<UnstyledButton
			onClick={onClick}
			class={tw`group relative p-1 mx-2 my-1 w-10 h-10 rounded !outline-none transition bg-(transparent hocus:accent-600/20)
				icon-(p-(gray-100 hocus:accent-100) s-(gray-300 hocus:accent-300))
				after:(absolute w-2 h-2 transition transform rotate-45 bg-gray-(50 dark:900) opacity-0
					[clip-path:polygon(0_0,0%_100%,100%_100%)] top-[calc(50%-0.25rem)] left-[calc(100%+0.25rem+.5px)])`}>
			<Svg src={icon} size={8}/>

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
			class={tw`fixed z-30 w-14 h-full inset-0 icon-(p-accent-300 s-accent-100) bg-gray-700`}>
			<nav class={tw`flex-(& col) h-full`}>
				<div class={tw`bg-accent-500/30 mb-1`}>
					<Button.Unstyled to='/' class={tw`block`}>
						<Svg
							src={Icon.launch}
							size={8}
							role='heading'
							aria-level='1'
							aria-label='AuriServe'
							class={tw`p-3 animate-rocket icon-p-accent-100 icon-s-accent-400`}
						/>
					</Button.Unstyled>
				</div>

				{shortcuts.map((shortcut, i) => {
					if (shortcut === 'spacer') return <div key={i} class={tw`flex-grow`} />;
					return (
						<SidebarLink
							key={i}
							label={shortcut.title}
							icon={shortcut.icon ?? Icon.shortcut}
							onClick={() => shortcut.action({ location, navigate })}
						/>
					);
				})}

				<div class={tw`h-1`}/>
			</nav>
		</aside>
	);
}
