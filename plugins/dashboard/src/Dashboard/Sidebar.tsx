import { h } from 'preact';
// import Cookie from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';

import Svg from './Svg';
import { Shortcut } from './Shortcut';
import { UnstyledButton } from './Button';

import { tw } from './twind';
// import { togglePalette } from './ShortcutPalette';

// import icon_home from '@res/icon/home.svg';
// import icon_pages from '@res/icon/file.svg';
// import icon_media from '@res/icon/image.svg';
// import icon_logout from '@res/icon/logout.svg';
// import icon_launch from '@res/icon/launch.svg';
import icon_shortcut from '@res/icon/shortcut.svg';
import icon_auriserve from '@res/icon/auriserve.svg';

// function handleOpenPalette() {
// 	togglePalette();
// }

// function handleLogout() {
// 	Cookie.remove('tkn');
// 	window.location.href = '/admin';
// }

interface SidebarLinkProps {
	label: string;
	icon: string;

	onClick: () => void;
}

function SidebarLink({ label, icon, onClick}: SidebarLinkProps) {
	return (
		<UnstyledButton
			onClick={onClick}
			class={tw`group relative p-1 m-2 w-10 h-10 rounded !outline-none transition bg-(transparent hocus:accent-400/30)
				after:(absolute w-2 h-2 transition transform rotate-45 bg-gray-(50 dark:900)
					[clip-path:polygon(0_0,0%_100%,100%_100%)] top-[calc(50%-0.25rem)] left-[calc(100%+0.25rem+.5px)])`}>
			<Svg
				src={icon}
				size={8}
				class={tw`icon-p-accent-(200 group-hocus:100) icon-s-accent-(400 group-hocus:200)`}
			/>

			<span
				class={tw`block absolute z-10 transform transition left-16 top-1 rounded py-1 px-2.5
				bg-gray-700 pointer-events-none select-none text-gray-100 whitespace-nowrap font-medium shadow-md
				opacity-(0 group-hocus:100) translate-x-(1 group-hocus:0) delay-(group-hover:700 group-focus:0)
				after:(absolute block -left-1 top-3 w-2 h-2 transform rotate-45 bg-gray-700)`}>
				{label}
			</span>
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
			class={tw`fixed z-30 w-14 h-full inset-0 icon-p-accent-300 icon-s-accent-100
			bg-gradient-to-t from-accent-600 to-accent-500`}>
			<nav class={tw`flex-(& col) h-full`}>
				<Svg
					src={icon_auriserve}
					size={10}
					role='heading'
					aria-level='1'
					aria-label='AuriServe'
					class={tw`m-2 animate-rocket icon-p-accent-200 icon-s-accent-300`}
				/>

				<div class={tw`w-3/5 h-1 my-2 mx-auto rounded bg-accent-400`} />

				{shortcuts.map((shortcut, i) => {
					if (shortcut === 'spacer') return <div key={i} class={tw`flex-grow`} />;
					return (
						<SidebarLink
							key={i}
							label={shortcut.title}
							icon={shortcut.icon ?? icon_shortcut}
							onClick={() => shortcut.action({ location, navigate })}
						/>
					);
				})}
			</nav>
		</aside>
	);
}
