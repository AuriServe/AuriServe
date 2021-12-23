import { h } from 'preact';
import { memo } from 'preact/compat';
import { useEffect, useRef } from 'preact/hooks';
import { NavLink as Link, useHistory } from 'react-router-dom';

import Svg from '../Svg';
import { Title, Page } from '../structure';
import { MainSettings, ThemesSettings, PluginsSettings,
	MediaSettings, UsersSettings, RolesSettings, DeveloperSettings } from './settings';

import icon_home from '@res/icon/home.svg';
import icon_themes from '@res/icon/theme.svg';
import icon_plugins from '@res/icon/plugin.svg';
import icon_media from '@res/icon/image.svg';
import icon_users from '@res/icon/users.svg';
import icon_roles from '@res/icon/role.svg';
import icon_updates from '@res/icon/update.svg';
import icon_developer from '@res/icon/developer.svg';

interface SidebarLinkProps {
	label: string;
	path: string;
	icon: string;
	notifications?: number | boolean;
}

function SidebarLink({ label, path, icon, notifications }: SidebarLinkProps) {
	return (
		<li>
			<Link to={path}
				className='flex gap-3 p-2 items-end rounded-md transition text-neutral-200 hover:bg-neutral-800/50'
				activeClassName='!bg-neutral-800 shadow-md !text-accent-200 primary-50 secondary-400'>
				<Svg src={icon} size={6} class='ml-0.5'/>
				<p class='leading-snug font-medium flex-grow'>{label}</p>
				{typeof notifications === 'number' &&
					<div class='block w-4 h-4 bg-accent-400 text-neutral-700 rounded-full
						text-[13px] font-black text-center leading-none pt-px mb-1 mr-1 ring-4
						ring-accent-600/25 ring-offset-neutral-900'>{notifications}</div>}
				{typeof notifications === 'boolean' &&
					<div class='block w-2.5 h-2.5 bg-accent-500 text-neutral-700 rounded-full
						text-sm font-black text-center leading-none pt-0.5 mb-1.5 mr-2 ring ring-accent-600/25'/>}
			</Link>
		</li>
	);
}

const SettingsSections = memo(function SettingsSections(
	{ refs }: { refs: { current: Record<string, HTMLDivElement | null> }}) {
	return (
		<div class='w-full max-w-4xl p-6 pb-16 space-y-12'>
			<div ref={ref => refs.current.overview = ref}><MainSettings/></div>
			<div ref={ref => refs.current.themes = ref}><ThemesSettings/></div>
			<div ref={ref => refs.current.plugins = ref}><PluginsSettings/></div>
			<div ref={ref => refs.current.media = ref}><MediaSettings/></div>
			<div ref={ref => refs.current.users = ref}><UsersSettings/></div>
			<div ref={ref => refs.current.roles = ref}><RolesSettings/></div>
			<div ref={ref => refs.current.developer = ref}><DeveloperSettings/></div>
			<div class='h-48'/>
		</div>
	);
});

export default function SettingsPage() {
	const history = useHistory();
	const ignoreScroll = useRef<{ state: boolean; timeout: any }>({ state: false, timeout: 0 });
	const refs = useRef<Record<string, HTMLDivElement | null>>({});

	useEffect(() => {
		const section = history.location.pathname.split('/')[2];
		if (!section) history.replace('/settings/overview/');
		const ref = refs.current[section];
		if (ref) setTimeout(() => window.scrollTo({ top: ref.offsetTop - 6 * 4, behavior: 'auto' }), 200);

		return history.listen((evt) => {
			if ((evt.state as any)?.scrollInitiated) return;
			const section = evt.pathname.split('/')[2];
			if (!section && evt.pathname.startsWith('/settings')) history.replace('/settings/overview/');
			const ref = refs.current[section];
			if (!ref) return;

			window.scrollTo({ top: ref.offsetTop - 6 * 4, behavior: 'smooth' });
			ignoreScroll.current.state = true;
			clearTimeout(ignoreScroll.current.timeout);
			ignoreScroll.current.timeout = setTimeout(() => ignoreScroll.current.state = false, 750);
		});
	}, []);

	useEffect(() => {
		let scrolled = false;
		const onScroll = () => scrolled = true;
		window.addEventListener('scroll', onScroll);

		const interval = setInterval(() => {
			if (!scrolled || ignoreScroll.current.state) {
				scrolled = false;
				return;
			};
			scrolled = false;

			let lastSection = '';
			Object.entries(refs.current).some(([ section, elem ]) => {
				if (elem!.offsetTop > window.scrollY + 36 * 2) return true;

				lastSection = section;
				return false;
			});

			if (lastSection) history.replace(`/settings/${lastSection}/`, { scrollInitiated: true });
		}, 50);


		return () => {
			window.removeEventListener('scroll', onScroll);
			clearInterval(interval);
		};
	}, []);

	return (
		<Page class='flex justify-center !pb-0 min-h-screen'>
			<Title>Settings</Title>
			<div class='w-full md:w-64 h-full pl-4 flex-shrink-0'>
				<ul class='sticky top-6 flex flex-col gap-2 mt-6' role='navigation'>
					<SidebarLink label='Overview' path='/settings/overview/' icon={icon_home}/>
					<SidebarLink label='Themes' path='/settings/themes/' icon={icon_themes}/>
					<SidebarLink label='Plugins' path='/settings/plugins/' icon={icon_plugins}/>
					<SidebarLink label='Media' path='/settings/media/' icon={icon_media}/>
					<SidebarLink label='Users' path='/settings/users/' icon={icon_users}/>
					<SidebarLink label='Roles' path='/settings/roles/' icon={icon_roles}/>
					<SidebarLink label='Updates' path='/settings/updates/' icon={icon_updates} notifications={1}/>
					<SidebarLink label='Developer' path='/settings/developer/' icon={icon_developer} notifications/>
				</ul>
			</div>
			<SettingsSections refs={refs}/>
			<div class='w-48 flex-shrink hidden 2xl:block'/>
		</Page>
	);
}
