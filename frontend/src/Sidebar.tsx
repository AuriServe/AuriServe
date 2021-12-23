import { h } from 'preact';
import Cookie from 'js-cookie';
import { useRouteMatch } from 'react-router-dom';

import Svg from './Svg';
import { UnstyledButton } from './Button';

import { merge } from 'common/util';

import icon_home from '@res/icon/home.svg';
import icon_pages from '@res/icon/file.svg';
import icon_media from '@res/icon/image.svg';
import icon_theme from '@res/icon/theme.svg';
import icon_logout from '@res/icon/logout.svg';
import icon_options from '@res/icon/options.svg';
import icon_auriserve from '@res/icon/auriserve.svg';

function handleDarkMode() {
	document.documentElement.classList.add('AS_TRANSITION_THEME');
	setTimeout(() => document.documentElement.classList.toggle('dark'), 50);
	setTimeout(() => document.documentElement.classList.remove('AS_TRANSITION_THEME'), 300);
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
				'group relative p-1 m-2 w-10 h-10 rounded bg-transparent transition !outline-none',
				'hover:bg-accent-400/30 focus-visible:bg-accent-400/30',
				'after:absolute after:transition after:w-2 after:h-2 after:bg-neutral-50 dark:after:bg-neutral-900',
				'after:tri after:transform after:rotate-45 after:top-[calc(50%-0.25rem)] after:left-[calc(100%+0.25rem+.5px)]',
				active ? '!bg-accent-400/50' : 'after:scale-0')}
		>

			<Svg src={icon} size={8}
				class={merge('primary-200 secondary-400',
					'group-hover:primary-100 group-focus-visible:primary-100',
					'group-hover:secondary-200 group-focus-visible:secondary-200',
					active && '!primary-white !secondary-200')}/>

			<span class='block absolute z-10 transform transition left-16 top-1 rounded py-1 px-2.5
				bg-neutral-700 opacity-0 translate-x-1 pointer-events-none select-none text-neutral-100
				group-hover:opacity-100 group-hover:translate-x-0 group-hover:delay-700 font-medium shadow-md whitespace-nowrap
				group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:delay-0

				after:block after:absolute after:-left-1 after:top-3 after:w-2 after:h-2 after:transform after:rotate-45
				after:bg-neutral-700'>
				{label}
			</span>
		</UnstyledButton>
	);
}

export default function Sidebar() {
	return (
		<aside class='fixed w-14 h-full inset-0
			bg-gradient-to-t from-accent-600 to-accent-500 z-30
			primary-300 secondary-100'>
			<nav class='flex flex-col h-full'>
				<Svg src={icon_auriserve} size={10} role='heading' aria-level='1' aria-label='AuriServe'
					class='m-2 animate-rocket primary-200 secondary-300'/>

				<div class='w-3/5	h-1 my-2 mx-auto rounded bg-accent-400 dark:bg-accent-400' />

				<SidebarLink label='Home' icon={icon_home} path= '/' exact/>
				<SidebarLink label='Routes' icon={icon_pages} path= '/routes' />
				<SidebarLink label='Media' icon={icon_media} path= '/media'/>
				<SidebarLink label='Settings' icon={icon_options} path= '/settings'/>

				<div class='flex-grow'/>

				<SidebarLink label='Dark' icon={icon_theme} path={handleDarkMode}/>
				<SidebarLink label='Logout' icon={icon_logout} path={handleLogout} />
			</nav>
		</aside>
	);
}
