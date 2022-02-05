import Cookie from 'js-cookie';
// import * as Int from 'common/graph/type';
import { h, createContext } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import { getShortcut } from './Shortcut';
import CommandPalette from './ShortcutPalette';

import { tw } from './Twind';

import {
	LoginPage,
	MainPage,
	// PagesPage,
	// MediaPage,
	// UserPage,
	SettingsPage,
	// EditorControlPage,
	// EditorRendererPage,
} from './pages';

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
		Cookie.get('tkn') ? 'QUERYING' : 'LOGIN'
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
			{state === 'LOGIN' ? (
				<div
					class={tw`AS_ROOT grid min-h-screen theme-indigo
						bg-gray-(100 dark:900) text-gray-(800 dark:100)
						icon-p-gray-(500 dark:100) icon-s-gray-(400 dark:300)`}>
					<LoginPage onLogin={() => setState('AUTH')} />
				</div>
			) : (
				<Router basename='/dashboard'>
					{/* <Route
						path='/:url*'
						strict
						render={(props) => <Redirect to={`${props.location.pathname}/${props.location.search}`} />}
					/> */}
					<CommandPalette />
					<Routes>
						{/* <Route path='/renderer' element={<EditorRendererPage />} /> */}
						<Route
							path='/pages/:page'
							element={
								<div class={tw`AS_ROOT grid min-h-screen bg-gray-(50,dark:900)`}>
									{/* <EditorControlPage /> */}
								</div>
							}
						/>
						<Route
							path='*'
							element={
								<div
									class={tw`AS_ROOT grid min-h-screen font-sans pl-14 theme-indigo
										bg-gray-(100 dark:900) text-gray-(800 dark:100)
										icon-p-gray-(500 dark:100) icon-s-gray-(400 dark:300)`}>
									<div class={tw`grid animate-fadein`}>
										<Sidebar
											shortcuts={[
												getShortcut('dashboard:page_home')!,
												// getShortcut('dashboard:page_routes')!,
												// getShortcut('dashboard:page_media')!,
												'spacer',
												getShortcut('dashboard:page_settings')!,
												getShortcut('dashboard:shortcut_palette')!,
												getShortcut('dashboard:log_out')!,
											]}
										/>
										<Routes>
											<Route path='/' element={<MainPage />} />
											{/* <Route path='/routes/*' element={<PagesPage />} /> */}
											{/* <Route path='/media/' element={<MediaPage />} /> */}
											{/* <Route path='/media/:id' element={<MediaPage />} /> */}
											<Route path='/settings/*' element={<SettingsPage />} />
											{/* <Route path='/users/:id' element={<UserPage />} /> */}
											<Route element={<Navigate to='/' />} />
										</Routes>
									</div>
								</div>
							}
						/>
					</Routes>
				</Router>
			)}
		</AppContext.Provider>
	);
}
