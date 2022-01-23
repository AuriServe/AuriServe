import { h } from 'preact';
import { memo } from 'preact/compat';
import { useEffect, useRef } from 'preact/hooks';
import { NavLink as Link, useLocation, useNavigate } from 'react-router-dom';

import Svg from '../Svg';
import { Title, Page } from '../structure';
import {
	MainSettings,
	ThemesSettings,
	PluginsSettings,
	MediaSettings,
	// UsersSettings,
	RolesSettings,
	DeveloperSettings,
} from './settings';

import { tw } from '../twind';

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
			<Link
				to={path}
				// activeClassName='!bg-neutral-800 shadow-md !text-accent-200 icon-p-accent-50 icon-s-accent-400'>
				className={tw`flex gap-3 p-2 items-end rounded-md transition text-gray-200 hover:bg-gray-800/50`}>
				<Svg src={icon} size={6} class={tw`ml-0.5`} />
				<p class={tw`leading-snug font-medium flex-grow`}>{label}</p>
				{typeof notifications === 'number' && (
					<div
						class={tw`block w-4 h-4 pt-px mb-1 mr-1 bg-accent-400 leading-none font-black
							text-([13px] gray-700 center) rounded-full ring-(4 accent-600/25 offset-gray-900)`}>
						{notifications}
					</div>
				)}
				{typeof notifications === 'boolean' && (
					<div
						class={tw`block w-2.5 h-2.5 pt-0.5 mb-1.5 mr-2 leading-none font-black
							text-(sm gray-700 center) bg-accent-500 rounded-full ring-(& accent-600/25)`}
					/>
				)}
			</Link>
		</li>
	);
}

const SettingsSections = memo(function SettingsSections({
	refs,
}: {
	refs: { current: Record<string, HTMLDivElement | null> };
}) {
	return (
		<div class={tw`w-full max-w-4xl p-6 pb-16 space-y-12`}>
			<div ref={(ref) => (refs.current.overview = ref)}>
				<MainSettings />
			</div>
			<div ref={(ref) => (refs.current.themes = ref)}>
				<ThemesSettings />
			</div>
			<div ref={(ref) => (refs.current.plugins = ref)}>
				<PluginsSettings />
			</div>
			<div ref={(ref) => (refs.current.media = ref)}>
				<MediaSettings />
			</div>
			{/* <div ref={(ref) => (refs.current.users = ref)}>
				<UsersSettings />
			</div> */}
			<div ref={(ref) => (refs.current.roles = ref)}>
				<RolesSettings />
			</div>
			<div ref={(ref) => (refs.current.developer = ref)}>
				<DeveloperSettings />
			</div>
			<div class='h-48' />
		</div>
	);
});

export default function SettingsPage() {
	const location = useLocation();
	const navigate = useNavigate();

	const ignoreScroll = useRef<{ state: boolean; timeout: any }>({
		state: false,
		timeout: 0,
	});
	const refs = useRef<Record<string, HTMLDivElement | null>>({});

	useEffect(() => {
		const section = location.pathname.split('/')[2];
		if (!section) navigate('/settings/overview/', { replace: true });
		const ref = refs.current[section];
		if (ref)
			setTimeout(
				() => window.scrollTo({ top: ref.offsetTop - 6 * 4, behavior: 'auto' }),
				200
			);
	});

	useEffect(() => {
		if ((location.state as any)?.scrollInitiated) return;
		const section = location.pathname.split('/')[2];
		if (!section && location.pathname.startsWith('/settings'))
			navigate('/settings/overview/', { replace: true });
		const ref = refs.current[section];
		if (!ref) return;

		window.scrollTo({ top: ref.offsetTop - 6 * 4, behavior: 'smooth' });
		ignoreScroll.current.state = true;
		clearTimeout(ignoreScroll.current.timeout);
		ignoreScroll.current.timeout = setTimeout(
			() => (ignoreScroll.current.state = false),
			750
		);
	}, [location, navigate]);

	useEffect(() => {
		let scrolled = false;
		const onScroll = () => (scrolled = true);
		window.addEventListener('scroll', onScroll);

		const interval = setInterval(() => {
			if (!scrolled || ignoreScroll.current.state) {
				scrolled = false;
				return;
			}
			scrolled = false;

			let lastSection = '';
			Object.entries(refs.current).some(([section, elem]) => {
				if (elem!.offsetTop > window.scrollY + 36 * 2) return true;

				lastSection = section;
				return false;
			});

			if (lastSection)
				navigate(`/settings/${lastSection}/`, {
					replace: true,
					state: { scrollInitiated: true },
				});
		}, 50);

		return () => {
			window.removeEventListener('scroll', onScroll);
			clearInterval(interval);
		};
	}, [navigate]);

	return (
		<Page class={tw`flex justify-center !pb-0 min-h-screen`}>
			<Title>Settings</Title>
			<div class={tw`w-full md:w-64 h-full pl-4 flex-shrink-0`}>
				<ul class={tw`sticky top-6 flex-(& col) gap-2 mt-6`} role='navigation'>
					<SidebarLink label='Overview' path='/settings/overview/' icon={icon_home} />
					<SidebarLink label='Themes' path='/settings/themes/' icon={icon_themes} />
					<SidebarLink label='Plugins' path='/settings/plugins/' icon={icon_plugins} />
					<SidebarLink label='Media' path='/settings/media/' icon={icon_media} />
					<SidebarLink label='Users' path='/settings/users/' icon={icon_users} />
					<SidebarLink label='Roles' path='/settings/roles/' icon={icon_roles} />
					<SidebarLink
						label='Updates'
						path='/settings/updates/'
						icon={icon_updates}
						notifications={1}
					/>
					<SidebarLink
						label='Developer'
						path='/settings/developer/'
						icon={icon_developer}
						notifications
					/>
				</ul>
			</div>
			<SettingsSections refs={refs} />
			<div class={tw`w-48 flex-shrink hidden 2xl:block`} />
		</Page>
	);
}
