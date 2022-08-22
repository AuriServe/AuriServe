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
import { QUERY_INFO } from '../Graph';

type AppState = 'QUERYING' | 'LOGIN' | 'AUTH';

document.documentElement.classList.add('dark');
document.documentElement.classList.add(
	...tw`scroll-(gutter-gray-900 bar-(gray-500 hover-gray-400)`.split(' ')
);
/** Defines the content of the App Context. */
export interface AppContextData {
	data: Partial<any>;
	mergeData(data: Partial<any>): void;
}

/** The App Context containing graph data. */
export const AppContext = createContext<AppContextData>({
	data: {},
	mergeData: () => {
		throw 'Accessed default AppContext';
	},
});

/**
 * Main entry point for the application.
 * Handles authentication and context data.
 * Renders pages and navigation.
 */

export default function App() {
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
		if (state === 'QUERYING') executeQuery(QUERY_INFO).then(() => setState('AUTH')).catch(() => setState('LOGIN'));
	}, [ state ]);

	return (
		<AppContext.Provider value={{ data, mergeData }}>
			<div
				class={tw`
				AS_ROOT ${state !== 'LOGIN' && 'pl-14'} grid min-h-screen font-sans theme-blue
				bg-gray-(100 dark:900) text-gray-(800 dark:100)
				icon-p-gray-(500 dark:100) icon-s-gray-(400 dark:300)`}>
				<Router basename='/dashboard'>
					{state === 'AUTH' && <Fragment>
						<CommandPalette />
						<Sidebar
							shortcuts={
								[
									getShortcut('tax_calculator:edit_calculator'),
									// getShortcut('page-editor:pages')!,
									// getShortcut('dashboard:page_routes')!,
									// getShortcut('dashboard:page_media')!,
									'spacer',
									// getShortcut('dashboard:page_settings')!,
									getShortcut('dashboard:shortcut_palette'),
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
			</div>
		</AppContext.Provider>
	);
}