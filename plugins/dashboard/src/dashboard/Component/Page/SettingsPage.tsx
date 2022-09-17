import { h } from 'preact';
// import { memo } from 'preact/compat';
// import { useEffect, useRef } from 'preact/hooks';
import { useMemo } from 'preact/hooks';
import { useNavigate, useLocation, NavLink as Link } from 'react-router-dom';

import Svg from '../Svg';
import Button from '../Button';
import Spinner from '../Spinner';
import { getSettings } from '../../Settings';

import { tw } from '../../Twind';
import * as Icon from '../../Icon';
import { QUERY_SELF_USER, useData } from '../../Graph';

export default function SettingsPage() {
	const [{ user }] = useData(QUERY_SELF_USER, []);

	const navigate = useNavigate();
	const location = useLocation();

	const settings = useMemo(() => {
		if (!user) return null;
		if (user.permissions.includes('administrator')) return [...getSettings().values()];
		return [...getSettings().values()].filter(
			(setting) => (setting.permissions?.findIndex((perm) => !user.permissions.includes(perm)) ?? -1) === -1);
		// eslint-disable-next-line
	}, [...(user?.permissions ?? [])]);

	if (!settings) return (
		<div class={tw`grid place-content-center`}>
			<Spinner/>
		</div>
	)

	const slug = location.pathname.split('/').slice(2).shift() ?? '';
	if (!slug && settings.length) navigate(`/settings/${settings[0].path}`, { replace: true });
	const Component = slug && settings && settings.find(setting => setting.path === slug)?.component || null;

	if (!Component) return (
		<div
			class={tw`flex-(& col) justify-center items-center gap-2 animate-drop-fade-in`}>
			<Svg src={Icon.target} size={12} class={tw`p-6 bg-gray-800 rounded-lg mb-4`} />
			<p class={tw`leading-none text-xl text-gray-100 font-medium`}>Page not found.</p>
			<p class={tw`text-gray-200`}>
				The plugin responsible for this page may still be loading.
			</p>
			<Button.Secondary
				to='/'
				icon={Icon.home}
				label='Go Home'
				class={tw`mt-8 mb-32 dark:!ring-offset-gray-900`}
			/>
		</div>
	)

	return (
		<div class={tw`w-full flex justify-center`}>
			<div class={tw`w-full md:w-64 h-full pl-4 flex-shrink-0`}>
				<ul class={tw`sticky top-6 flex-(& col) gap-1 mt-6`} role='navigation'>
					{[...settings.values()].map((setting) => (
						<li key={setting.identifier}>
							<Link
								to={`${setting.path}/`}
								className={tw`flex gap-3 p-1.5 items-end rounded-md transition
									${slug === setting.path
										? 'text-accent-100 bg-gray-800 icon-p-accent-50 icon-s-accent-400'
										: 'text-gray-200 hover:bg-gray-800/50'}`}>
								<Svg src={setting.icon} size={6} class={tw`ml-0.5`} />
								<p class={tw`leading-snug font-medium flex-grow`}>{setting.title}</p>
								{/*{typeof notifications === 'number' && (
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
							)}*/}
							</Link>
						</li>
					))}
				</ul>
			</div>
			<div class={tw`w-full max-w-4xl p-6 pb-16 space-y-12`}>
				<div key={slug} class={tw`animate-fade-in`}>
					<Component/>
				</div>
				{/* {[...settings.values()].map(({ identifier, component: Component }) => (
					<Component
						key={identifier}
						event={event}
						setDirty={(dirty) => handleSetDirty(identifier, dirty)}
					/>
				))}
				<div class='h-48' />
				<SavePrompt
					dirty={dirty}
					saving={false}
					onSave={() => {
						}}
					onUndo={handleUndo}
				/> */}
			</div>
			<div class={tw`w-80 flex-shrink hidden 2xl:block`} />
		</div>
	);
}
