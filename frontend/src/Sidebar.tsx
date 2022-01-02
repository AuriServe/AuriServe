import { h } from 'preact';
import Cookie from 'js-cookie';
import { useRouteMatch } from 'react-router-dom';

import Svg from './Svg';
import { UnstyledButton } from './Button';

import { merge } from 'common/util';
import { togglePalette } from './ShortcutPalette';

import icon_home from '@res/icon/home.svg';
import icon_pages from '@res/icon/file.svg';
import icon_media from '@res/icon/image.svg';
import icon_logout from '@res/icon/logout.svg';
import icon_launch from '@res/icon/launch.svg';
import icon_options from '@res/icon/options.svg';
import icon_auriserve from '@res/icon/auriserve.svg';

function handleOpenPalette() {
	togglePalette();
}

function handleLogout() {
	Cookie.remove('tkn');
	window.location.href = '/admin';
}

interface SidebarLinkProps {
	label: string;
	path: string | (() => void);
	icon: string;
	exact?: boolean;
	props?: any;
}

function SidebarLink({ label, path, icon, exact, props }: SidebarLinkProps) {
	const active = !!useRouteMatch({ path: typeof path === 'string' ? path : '!', exact});

	return (
		<UnstyledButton {...props}
			to={typeof path === 'string' ? path : undefined}
			onClick={typeof path === 'function' ? path : undefined}
			class={merge(
				'group relative p-1 m-2 w-10 h-10 transition !outline-none',
				'bg-transparent hocus:bg-accent-400/30 rounded',
				'after:absolute after:transition after:w-2 after:h-2 after:bg-neutral-50 dark:after:bg-neutral-900',
				'after:[clip-path:polygon(0_0,0%_100%,100%_100%)] after:transform after:rotate-45',
				'after:top-[calc(50%-0.25rem)] after:left-[calc(100%+0.25rem+.5px)]',
				active ? '!bg-accent-400/50' : 'after:scale-0')}
		>

			<Svg src={icon} size={8}
				class={merge(
					'icon-p-accent-200 icon-s-accent-400 group-hocus:icon-p-accent-100 group-hocus:icon-s-accent-200',
					active && '!icon-p-white !icon-s-accent-200')}/>

			<span class='block absolute z-10 transform transition left-16 top-1 font-medium shadow-md rounded py-1 px-2.5
				bg-neutral-700 opacity-0 translate-x-1 pointer-events-none select-none text-neutral-100 whitespace-nowrap
				group-hocus:opacity-100 group-hocus:translate-x-0 group-hover:delay-700 group-focus:delay-0 after:absolute
				after:block after:-left-1 after:top-3 after:w-2 after:h-2 after:transform after:rotate-45 after:bg-neutral-700'
			>
				{label}
			</span>
		</UnstyledButton>
	);
}

export default function Sidebar() {
	return (
		<aside class='fixed w-14 h-full inset-0
			bg-gradient-to-t from-accent-600 to-accent-500 z-30
			icon-p-accent-300 icon-s-accent-100'>
			<nav class='flex flex-col h-full'>
				<Svg src={icon_auriserve} size={10} role='heading' aria-level='1' aria-label='AuriServe'
					class='m-2 animate-rocket icon-p-accent-200 icon-s-accent-300'/>

				<div class='w-3/5	h-1 my-2 mx-auto rounded bg-accent-400 dark:bg-accent-400' />

				<SidebarLink label='Home' icon={icon_home} path= '/' exact/>
				<SidebarLink label='Routes' icon={icon_pages} path= '/routes' />
				<SidebarLink label='Media' icon={icon_media} path= '/media'/>
				<SidebarLink label='Settings' icon={icon_options} path= '/settings'/>

				<div class='flex-grow'/>

				<SidebarLink label='Shortcut Palette' icon={icon_launch} path={handleOpenPalette}/>
				<SidebarLink label='Logout' icon={icon_logout} path={handleLogout} />
			</nav>
		</aside>
	);
}
