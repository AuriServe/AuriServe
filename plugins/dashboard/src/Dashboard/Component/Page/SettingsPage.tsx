import { h } from 'preact';
// import { memo } from 'preact/compat';
// import { useEffect, useRef } from 'preact/hooks';
import { useMemo, useState } from 'preact/hooks';
import { NavLink as Link } from 'react-router-dom';

import Svg from '../Svg';
import { SavePrompt } from '../SavePrompt';
import { getSettings, SettingsEvent } from '../../Settings';

import { tw } from '../../Twind';
import EventEmitter from '../../EventEmitter';
import { QUERY_SELF_USER, useData } from '../../Graph';

export default function SettingsPage() {
	const [{ user }] = useData(QUERY_SELF_USER, []);
	const [dirty, setDirty] = useState<boolean>(false);

	const [dirtySet, event] = useMemo(() => {
		const dirty = new Set();
		const emitter = new EventEmitter<SettingsEvent>();
		return [dirty, emitter];
	}, []);

	const settings = useMemo(() => {
		if (!user) return null;

		if (user.permissions.includes('administrator')) return [...getSettings().values()];

		return [...getSettings().values()].filter(
			(setting) =>
				setting.permissions?.findIndex((perm) => !user.permissions.includes(perm)) ??
				-1 === -1
		);
		// eslint-disable-next-line
	}, [...(user?.permissions ?? [])]);

	if (!settings) return null;

	const handleSetDirty = (identifier: string, dirty: boolean) => {
		if (dirty) dirtySet.add(identifier);
		else dirtySet.delete(identifier);
		setDirty(dirtySet.size > 0);
	};

	const handleUndo = () => {
		event.emit('undo');
	};
	// const location = useLocation();
	// const navigate = useNavigate();

	// const ignoreScroll = useRef<{ state: boolean; timeout: any }>({
	// 	state: false,
	// 	timeout: 0,
	// });
	// const refs = useRef<Record<string, HTMLDivElement | null>>({});

	// useEffect(() => {
	// 	const section = location.pathname.split('/')[2];
	// 	if (!section) navigate('/settings/overview/', { replace: true });
	// 	const ref = refs.current[section];
	// 	if (ref)
	// 		setTimeout(
	// 			() => window.scrollTo({ top: ref.offsetTop - 6 * 4, behavior: 'auto' }),
	// 			200
	// 		);
	// });

	// useEffect(() => {
	// 	if ((location.state as any)?.scrollInitiated) return;
	// 	const section = location.pathname.split('/')[2];
	// 	if (!section && location.pathname.startsWith('/settings'))
	// 		navigate('/settings/overview/', { replace: true });
	// 	const ref = refs.current[section];
	// 	if (!ref) return;

	// 	window.scrollTo({ top: ref.offsetTop - 6 * 4, behavior: 'smooth' });
	// 	ignoreScroll.current.state = true;
	// 	clearTimeout(ignoreScroll.current.timeout);
	// 	ignoreScroll.current.timeout = setTimeout(
	// 		() => (ignoreScroll.current.state = false),
	// 		750
	// 	);
	// }, [location, navigate]);

	// useEffect(() => {
	// 	let scrolled = false;
	// 	const onScroll = () => (scrolled = true);
	// 	window.addEventListener('scroll', onScroll);

	// 	const interval = setInterval(() => {
	// 		if (!scrolled || ignoreScroll.current.state) {
	// 			scrolled = false;
	// 			return;
	// 		}
	// 		scrolled = false;

	// 		let lastSection = '';
	// 		Object.entries(refs.current).some(([section, elem]) => {
	// 			if (elem!.offsetTop > window.scrollY + 36 * 2) return true;

	// 			lastSection = section;
	// 			return false;
	// 		});

	// 		if (lastSection)
	// 			navigate(`/settings/${lastSection}/`, {
	// 				replace: true,
	// 				state: { scrollInitiated: true },
	// 			});
	// 	}, 50);

	// 	return () => {
	// 		window.removeEventListener('scroll', onScroll);
	// 		clearInterval(interval);
	// 	};
	// }, [navigate]);

	return (
		<div class={tw`w-full flex justify-center`}>
			<div class={tw`w-full md:w-64 h-full pl-4 flex-shrink-0`}>
				<ul class={tw`sticky top-6 flex-(& col) gap-2 mt-6`} role='navigation'>
					{[...settings.values()].map((setting) => (
						<li key={setting.identifier}>
							<Link
								to={setting.path}
								// activeClassName='!bg-neutral-800 shadow-md !text-accent-200 icon-p-accent-50 icon-s-accent-400'>
								className={tw`flex gap-3 p-2 items-end rounded-md transition text-gray-200 hover:bg-gray-800/50`}>
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
				{[...settings.values()].map(({ identifier, component: Component }) => (
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
						/** */
					}}
					onUndo={handleUndo}
				/>
			</div>
			<div class={tw`w-48 flex-shrink hidden 2xl:block`} />
		</div>
	);
}
