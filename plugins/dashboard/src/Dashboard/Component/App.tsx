import { h, createContext } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Title from './Title';
import Sidebar from './Sidebar';
import { getPages } from '../Page';
import { getShortcut } from '../Shortcut';
import CommandPalette from './ShortcutPalette';
import { Page, LoginPage, UnknownPage } from './Page';

import { tw } from '../Twind';

type AppState = 'QUERYING' | 'LOGIN' | 'AUTH';

document.documentElement.classList.add('dark');

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
		if (state === 'QUERYING') setState('AUTH');
	}, [state]);

	return (
		<AppContext.Provider value={{ data, mergeData }}>
			<div
				class={tw`
				AS_ROOT ${state !== 'LOGIN' && 'pl-14'} grid min-h-screen font-sans theme-cyan
				bg-gray-(100 dark:900) text-gray-(800 dark:100)
				icon-p-gray-(500 dark:100) icon-s-gray-(400 dark:300)`}>
				{state === 'LOGIN' ? (
					<LoginPage onLogin={() => setState('AUTH')} />
				) : (
					<Router basename='/dashboard'>
						<CommandPalette />
						<Sidebar
							shortcuts={[
								getShortcut('dashboard:page_home')!,
								// getShortcut('page-editor:pages')!,
								// getShortcut('dashboard:page_routes')!,
								// getShortcut('dashboard:page_media')!,
								'spacer',
								getShortcut('dashboard:page_settings')!,
								getShortcut('dashboard:shortcut_palette')!,
								getShortcut('dashboard:log_out')!,
							]}
						/>
						<Routes>
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
							<Route path='*' element={<UnknownPage />} />
						</Routes>
					</Router>
				)}
			</div>
		</AppContext.Provider>
	);
}
