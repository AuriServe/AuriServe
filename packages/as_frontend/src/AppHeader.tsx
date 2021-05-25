import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { NavLink as Link, useLocation } from 'react-router-dom';

import './AppHeader.sass';

function handleLogout() {
	Cookie.remove('tkn');
	window.location.href = '/admin';
}

const HOME_ICON = '/admin/asset/icon/home-dark.svg';
const MEDIA_ICON = '/admin/asset/icon/image-dark.svg';
const PAGES_ICON = '/admin/asset/icon/document-dark.svg';
const SETTINGS_ICON = '/admin/asset/icon/settings-dark.svg';
const LOGOUT_ICON = '/admin/asset/icon/logout-dark.svg';

function renderLink(name: string, path: string | (() => void), icon: string, props?: any) {
	return (typeof path === 'string') ? (
		<Link activeClassName='Active' className='AppHeader-NavLink' to={path} {...props}>
			<img src={icon} alt='' role='presentational' />
			<span class='AppHeader-NavLinkLabel'>{name}</span>
		</Link>
	) : (
		<button class='AppHeader-NavLink' onClick={path} {...props}>
			<img src={icon} alt='' role='presentational' />
			<span class='AppHeader-NavLinkLabel'>{name}</span>
		</button>
	);
}

export default function AppHeader() {
	const location = useLocation();
	const mobile = !window.matchMedia('(min-width: 600px)').matches;
	return (
		<header class={('AppHeader ' + (location.pathname === '/' ? 'Home ' : '') + (mobile ? 'Mobile' : 'Desktop')).trim()}>
			{!mobile ?
				<div class='AppHeader-WrapDesktop'>
					<img class='AppHeader-Logo' src='/admin/asset/icon/serve-light.svg' title='AuriServe' alt='AuriServe' />
					<div class='AppHeader-Divider' />
					<nav class='AppHeader-Nav'>
						{renderLink('Home', '/', HOME_ICON, { exact: true })}
						{renderLink('Pages', '/pages', PAGES_ICON)}
						{renderLink('Media', '/media', MEDIA_ICON)}
						{renderLink('Settings', '/settings', SETTINGS_ICON)}
						<div class='AppHeader-Separator'/>
						{renderLink('Logout', handleLogout, LOGOUT_ICON)}
					</nav>
				</div>
				:
				<div class='AppHeader-WrapMobile'>
					<nav class='AppHeader-Nav'>
						<Link activeClassName='active' to='/pages'><img src='/admin/asset/icon/document-dark.svg' alt='Pages'/></Link>
						<Link activeClassName='active' to='/media'><img src='/admin/asset/icon/image-dark.svg' alt='Media'/></Link>
						<Link activeClassName='active' exact to='/'><img src='/admin/asset/icon/serve.svg' alt='Home'/></Link>
						<Link activeClassName='active' to='/settings'><img src='/admin/asset/icon/settings-dark.svg' alt='Settings'/></Link>
						<button onClick={handleLogout}><img src='/admin/asset/icon/logout-dark.svg' alt='Log out'/></button>
					</nav>
				</div>
			}
		</header>
	);
}
