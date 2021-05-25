import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { NavLink as Link, Switch, Route, Redirect, useLocation } from 'react-router-dom';

import './SettingsPage.sass';

import Title from '../Title';
import * as Settings from './settings/Settings';

export default function SettingsPage() {
	const [ mobile, setMobile ] = useState<boolean>(window.innerWidth <= 800);
	const location = useLocation();

	useEffect(() => {
		const query = window.matchMedia('screen and (max-width: 800px)');
		const int = setInterval(() => setMobile(query.matches), 250);
		return () => clearInterval(int);
	}, []);

	useEffect(() => {
		const app = document.querySelector('.App') as HTMLElement;
		if (!app) return;

		app.style.overflowY = 'scroll';
		return () => app.style.overflowY = '';
	}, []);

	const inPage = location.pathname.replace(/\/settings\/?/, '');

	return (
		<div class={('Page SettingsPage ' + (mobile ? 'Mobile' : '')).trim()}>
			<Title>Settings</Title>
			{(!mobile || !inPage) && <div class='Settings-Aside'>
				<ul class='Settings-Nav'>
					<li><span class='SettingsPage-Label'>Settings</span></li>
					<li><Link activeClassName="active" to="/settings/overview">Overview</Link></li>
					<li><hr /></li>
					<li><Link activeClassName="active" to="/settings/themes">Themes</Link></li>
					<li><Link activeClassName="active" to="/settings/plugins">Plugins</Link></li>
					<li><Link activeClassName="active" to="/settings/media">Media</Link></li>
					<li><hr /></li>
					<li><Link activeClassName="active" to="/settings/users">Users</Link></li>
					<li><Link activeClassName="active" to="/settings/roles">Roles</Link></li>
				</ul>
			</div>}
			{(!mobile || inPage) && <div class='Settings-Main'>
				<Switch>
					<Route exact path='/settings/overview' component={Settings.Main as any} />
					<Route exact path='/settings/themes' component={Settings.Themes as any} />
					<Route exact path='/settings/plugins' component={Settings.Plugins as any} />
					<Route exact path='/settings/media' component={Settings.Media as any} />

					<Route exact path='/settings/users' component={Settings.Users as any} />
					<Route exact path='/settings/roles' component={Settings.Roles as any} />

					{!mobile && <Redirect exact to='/settings/overview'/>}
				</Switch>
			</div>}
		</div>
	);
}
