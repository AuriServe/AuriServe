import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { NavLink as Link, useLocation } from 'react-router-dom';

import { mergeClasses } from './Util';

const HOME_ICON = '/admin/asset/icon/home-dark.svg';
const MEDIA_ICON = '/admin/asset/icon/image-dark.svg';
const LOGOUT_ICON = '/admin/asset/icon/logout-dark.svg';
const PAGES_ICON = '/admin/asset/icon/document-dark.svg';
const SETTINGS_ICON = '/admin/asset/icon/settings-dark.svg';
const THEME_ICON = '/admin/asset/icon/interface-theme-dark.svg';

function handleDarkMode() {
	document.documentElement.classList.add('AS_TRANSITION_THEME');
	setTimeout(() => document.documentElement.classList.toggle('dark'), 50);
	setTimeout(() => document.documentElement.classList.remove('AS_TRANSITION_THEME'), 300);
}

function handleLogout() {
	Cookie.remove('tkn');
	window.location.href = '/admin';
}

/** Styles that are repeated among multiple elements. */
const style = {
	link: 'group relative w-14 h-14 p-2.5 select-none focus:outline-none',
	icon: `filter transition brightness-200 pointer-events-none opacity-50
		group-hover:opacity-75 group-focus-visible:opacity-100`,
	label: `block absolute z-10 transform transition left-16 top-3 rounded py-1 px-2.5
		bg-white dark:bg-gray-200 opacity-0 translate-x-1 pointer-events-none select-none dark:text-gray-800
		group-hover:opacity-100 group-hover:translate-x-0 group-hover:delay-700 font-medium shadow-md whitespace-nowrap
		group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:delay-0 `,
	labelArrow: 'block absolute -left-1 top-3 w-2 h-2 transform rotate-45 bg-white dark:bg-gray-200'
};

function renderLink(name: string, path: string | (() => void), icon: string, exact?: boolean, props?: any) {
	const pathName = useLocation().pathname;
	const isActive = typeof path === 'string' && (exact ? pathName === path : pathName.startsWith(path));

	return (typeof path === 'string') ? (
		<Link className={style.link} to={path} {...props}>
			<img class={mergeClasses(style.icon, isActive && '!opacity-100')}
				alt='' role='presentation' width={56} height={56} src={icon}/>
			<span class={style.label}>{name}<div class={style.labelArrow}/></span>
			<div class={mergeClasses(!isActive && 'scale-0',
				'absolute transition w-2 h-2 bg-gray-900 dark:bg-gray-50 transform',
				'rotate-45 top-[calc(50%-0.25rem)] left-[calc(100%-0.25rem+.5px)]')}
			style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)' }}/>
		</Link>
	) : (
		<button className={style.link} onClick={path} {...props}>
			<img width={56} height={56} src={icon} class={style.icon} alt='' role='presentation' />
			<span class={style.label}>{name}<div class={style.labelArrow}/></span>
		</button>
	);
}

export default function Sidebar() {
	const mobile = !window.matchMedia('(min-width: 600px)').matches;
	return (
		<aside class='fixed w-14 h-full inset-0 bg-gradient-to-t from-indigo-600 to-blue-500 z-30'>
			{!mobile ?
				<nav class='flex flex-col h-full'>
					<img width={56} height={56} class='p-2 select-none animate-rocket' role='heading' aria-level='1'
						src='/admin/asset/icon/serve-light.svg' alt='' aria-label='AuriServe' />

					<div class='w-3/5	h-1 my-2 mx-auto rounded bg-blue-400 dark:bg-blue-400' />
					{renderLink('Home', '/', HOME_ICON, true)}
					{renderLink('Pages', '/pages', PAGES_ICON)}
					{renderLink('Media', '/media', MEDIA_ICON)}
					{renderLink('Settings', '/settings', SETTINGS_ICON)}
					<div class='flex-grow'/>
					{renderLink('Dark Mode', handleDarkMode, THEME_ICON)}
					{renderLink('Logout', handleLogout, LOGOUT_ICON)}
				</nav>
				:
				<div>
					<nav>
						<Link activeClassName='active' to='/pages'><img src='/admin/asset/icon/document-dark.svg' alt='Pages'/></Link>
						<Link activeClassName='active' to='/media'><img src='/admin/asset/icon/image-dark.svg' alt='Media'/></Link>
						<Link activeClassName='active' exact to='/'><img src='/admin/asset/icon/serve.svg' alt='Home'/></Link>
						<Link activeClassName='active' to='/settings'><img src='/admin/asset/icon/settings-dark.svg' alt='Settings'/></Link>
						<button onClick={handleLogout}><img src='/admin/asset/icon/logout-dark.svg' alt='Log out'/></button>
					</nav>
				</div>
			}
		</aside>
	);
}
