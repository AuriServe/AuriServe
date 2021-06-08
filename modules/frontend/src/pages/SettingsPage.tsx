import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

import { Title, Page, Button } from '../structure';
import { MainSettings, ThemesSettings, PluginsSettings, MediaSettings, UsersSettings, RolesSettings } from './settings';

function renderLink(name: string, path: string, icon: string, props?: any) {
	return (
		<li>
			<Button class='!bg-transparent !border-transparent !font-normal'
				activeClassName='!bg-gray-700 !bg-opacity-25 dark:!bg-gray-100 !font-medium !border-gray-700 dark:!border-gray-300'
				to={path} {...props}>
				<img width={24} height={24} src={icon} alt='' role='presentation'
					class={'dark:filter dark:invert dark:brightness-75 dark:contrast-200 dark:hue-rotate-180 pointer-events-none'}/>
				<span class='pl-2 text-gray-100'>{name}</span>
			</Button>
		</li>
	);
}

export default function SettingsPage() {
	const [ mobile, setMobile ] = useState<boolean>(window.innerWidth <= 800);
	const location = useLocation();

	useEffect(() => {
		const query = window.matchMedia('screen and (min-width: 768px)');
		setMobile(!query.matches);
		const interval = setInterval(() => setMobile(!query.matches), 250);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const app = document.querySelector('.App') as HTMLElement;
		if (!app) return;

		app.style.overflowY = 'scroll';
		return () => app.style.overflowY = '';
	}, []);

	const inPage = location.pathname.replace(/\/settings\/?/, '');

	return (
		<Page class='flex bg-white dark:bg-gray-100 !pb-0'>
			<Title>Settings</Title>
			{(!mobile || !inPage) &&
				<div class='w-full md:w-72 h-full px-4 bg-gray-900 flex-shrink-0'>
					<ul class='sticky top-0 flex flex-col gap-1 py-3.5' role='navigation'>
						{renderLink('Overview', '/settings/overview', '/admin/asset/icon/home-dark.svg')}
						<li><hr class='border-gray-700 dark:border-gray-300 my-2' /></li>
						{renderLink('Themes', '/settings/themes', '/admin/asset/icon/theme-dark.svg')}
						{renderLink('Plugins', '/settings/plugins', '/admin/asset/icon/element-dark.svg')}
						<li><hr class='border-gray-700 dark:border-gray-300 m-1' /></li>
						{renderLink('Users', '/settings/users', '/admin/asset/icon/users-dark.svg')}
						{renderLink('Media', '/settings/media', '/admin/asset/icon/image-dark.svg')}
						{renderLink('Roles', '/settings/roles', '/admin/asset/icon/role-dark.svg')}
					</ul>
				</div>
			}
			{(!mobile || inPage) &&
				<Preact.Fragment>
					<div class='w-full p-4 pb-16'>
						<Switch>
							<Route exact path='/settings/overview' 	component={MainSettings as any} />
							<Route exact path='/settings/themes' 		component={ThemesSettings as any} />
							<Route exact path='/settings/plugins' 	component={PluginsSettings as any} />
							<Route exact path='/settings/media' 		component={MediaSettings as any} />

							<Route exact path='/settings/users' 		component={UsersSettings as any} />
							<Route exact path='/settings/roles' 		component={RolesSettings as any} />

							{!mobile && <Redirect exact to='/settings/overview'/>}
						</Switch>
					</div>
					<div class='w-72 flex-shrink hidden 2xl:block'/>
				</Preact.Fragment>
			}
		</Page>
	);
}
