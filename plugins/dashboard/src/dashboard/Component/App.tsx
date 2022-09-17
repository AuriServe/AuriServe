import { h, createContext, Fragment } from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Title from './Title';
import Sidebar from './Sidebar';
import { getPages } from '../Page';
import CommandPalette from './ShortcutPalette';
import { getShortcut, Shortcut } from '../Shortcut';
import { Page, LoginPage, UnknownPage, LoadingPage, ResetPasswordPage } from './Page';

import { tw } from '../Twind';
import { executeQuery } from '../Main';
import { QUERY_INFO, QUERY_SELF_USER } from '../Graph';

type AppState = 'QUERYING' | 'LOGIN' | 'AUTH';

function setHijackScrollbar(hijack: boolean) {
	document.documentElement.classList[hijack ? 'add' : 'remove']('custom_scroll',
		...tw`scroll-(gutter-gray-900 bar-(gray-500 hover-gray-400)`.split(' ')
	);
}

document.documentElement.classList.add('dark');
setHijackScrollbar(true);

/** Defines the content of the App Context. */
export interface AppContextData {
	data: Partial<any>;
	mergeData(data: Partial<any>): void;

	setShowChrome: (show: boolean) => void;
	setHijackScrollbar: (hijack: boolean) => void;
}

/** The App Context containing graph data. */
export const AppContext = createContext<AppContextData>({
	data: {},
	mergeData: () => {
		throw 'Accessed default AppContext';
	},
	setShowChrome: () => void(0),
	setHijackScrollbar: () => void(0)
});

/**
 * Main entry point for the application.
 * Handles authentication and context data.
 * Renders pages and navigation.
 */

export default function App() {
	const [ showChrome, setShowChrome ] = useState(true);

	const [data, setData] = useState<Partial<any>>({});
	const [state, setState] = useState<AppState>(() =>
		window.localStorage.getItem('token') ? 'QUERYING' : 'LOGIN'
	);

	const mergeData = useCallback(
		(data: Partial<any>) =>
			setData((prevData: Partial<any>) => {
				return { ...prevData, ...data };
			}),
		[]
	);

	useEffect(() => {
		if (state === 'QUERYING') executeQuery(`{ ${QUERY_INFO}, ${QUERY_SELF_USER} }`)
			.then((data) => {
				setState('AUTH');
				mergeData(data);
			})
			.catch(() => setState('LOGIN'));
	}, [ state, mergeData ]);

	return (
		<AppContext.Provider value={{ data, mergeData, setShowChrome, setHijackScrollbar }}>
			<div
				class={tw`
				${state !== 'LOGIN' && showChrome && 'pl-14'} grid min-h-screen font-sans theme-${data.user?.theme ?? 'blue'}
				bg-gray-(100 dark:900) text-gray-(800 dark:100)
				icon-p-gray-(500 dark:100) icon-s-gray-(400 dark:300)`}>
				<Router basename='/dashboard'>
					{state === 'AUTH' && showChrome && <Fragment>
						<CommandPalette />
						<Sidebar
							shortcuts={
								[
									getShortcut('dashboard:page_home'),
									getShortcut('tax_calculator:edit_calculator'),
									getShortcut('calendar:edit_calendar'),
									getShortcut('page-editor:pages'),
									// getShortcut('dashboard:page_routes')!,
									// getShortcut('dashboard:page_media')!,
									'spacer',
									// getShortcut('dashboard:page_settings')!,
									getShortcut('dashboard:shortcut_palette'),
									getShortcut('dashboard:page_settings'),
									getShortcut('dashboard:log_out'),
								].filter(Boolean) as (Shortcut | 'spacer')[]
							}
						/>
					</Fragment>}
					<Routes>
						{state === 'AUTH' && <Fragment>
							{[...getPages().entries()].map(
								([key, { path, title, component: Component }]) => (
									<Route
										key={key}
										path={path === '/' ? path : `${path}/*`}
										element={
											<Page>
												<Title>{title}</Title>
												<Component />
											</Page>
										}
									/>
								)
							)}
						</Fragment>}
						{state !== 'QUERYING' && <Route path='/reset_password/:token' element={
							<ResetPasswordPage onReset={() => setState('AUTH')}/>} />}
						{state === 'LOGIN' && <Route path='*' element={
							<LoginPage onLogin={() => setState('AUTH')} />} />}
						{state === 'AUTH' && <Route path='*' element={<UnknownPage />} />}
						{state === 'QUERYING' && <Route path='*' element={<LoadingPage />} />}
					</Routes>
				</Router>
				<div id='portal' class={tw`absolute top-0 left-0 w-0 h-0`}/>
			</div>
		</AppContext.Provider>
	);
}
