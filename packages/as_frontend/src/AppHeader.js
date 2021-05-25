"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const js_cookie_1 = tslib_1.__importDefault(require("js-cookie"));
const react_router_dom_1 = require("react-router-dom");
require("./AppHeader.sass");
function handleLogout() {
    js_cookie_1.default.remove('tkn');
    window.location.href = '/admin';
}
const HOME_ICON = '/admin/asset/icon/home-dark.svg';
const MEDIA_ICON = '/admin/asset/icon/image-dark.svg';
const PAGES_ICON = '/admin/asset/icon/document-dark.svg';
const SETTINGS_ICON = '/admin/asset/icon/settings-dark.svg';
const LOGOUT_ICON = '/admin/asset/icon/logout-dark.svg';
function renderLink(name, path, icon, props) {
    return (typeof path === 'string') ? (<react_router_dom_1.NavLink activeClassName='Active' className='AppHeader-NavLink' to={path} {...props}>
			<img src={icon} alt='' role='presentational'/>
			<span class='AppHeader-NavLinkLabel'>{name}</span>
		</react_router_dom_1.NavLink>) : (<button class='AppHeader-NavLink' onClick={path} {...props}>
			<img src={icon} alt='' role='presentational'/>
			<span class='AppHeader-NavLinkLabel'>{name}</span>
		</button>);
}
function AppHeader() {
    const location = react_router_dom_1.useLocation();
    const mobile = !window.matchMedia('(min-width: 600px)').matches;
    return (<header class={('AppHeader ' + (location.pathname === '/' ? 'Home ' : '') + (mobile ? 'Mobile' : 'Desktop')).trim()}>
			{!mobile ?
            <div class='AppHeader-WrapDesktop'>
					<img class='AppHeader-Logo' src='/admin/asset/icon/serve-light.svg' title='AuriServe' alt='AuriServe'/>
					<div class='AppHeader-Divider'/>
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
						<react_router_dom_1.NavLink activeClassName='active' to='/pages'><img src='/admin/asset/icon/document-dark.svg' alt='Pages'/></react_router_dom_1.NavLink>
						<react_router_dom_1.NavLink activeClassName='active' to='/media'><img src='/admin/asset/icon/image-dark.svg' alt='Media'/></react_router_dom_1.NavLink>
						<react_router_dom_1.NavLink activeClassName='active' exact to='/'><img src='/admin/asset/icon/serve.svg' alt='Home'/></react_router_dom_1.NavLink>
						<react_router_dom_1.NavLink activeClassName='active' to='/settings'><img src='/admin/asset/icon/settings-dark.svg' alt='Settings'/></react_router_dom_1.NavLink>
						<button onClick={handleLogout}><img src='/admin/asset/icon/logout-dark.svg' alt='Log out'/></button>
					</nav>
				</div>}
		</header>);
}
exports.default = AppHeader;
