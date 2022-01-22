import Cookie from 'js-cookie';
import * as Int from 'common/graph/type';
import { h, createContext } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import CommandPalette from './ShortcutPalette';

import { tw } from './twind';

import {
	LoginPage,
	MainPage,
	PagesPage,
	MediaPage,
	// UserPage,
	SettingsPage,
	// EditorControlPage,
	// EditorRendererPage,
} from './pages';

type AppState = 'QUERYING' | 'LOGIN' | 'AUTH';

document.documentElement.classList.add('dark');

/** Defines the content of the App Context. */
export interface AppContextData {
	data: Partial<Int.Root>;
	mergeData(data: Partial<Int.Root>): void;
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
	const [data, setData] = useState<Partial<Int.Root>>({});
	const [state, setState] = useState<AppState>(() =>
		Cookie.get('tkn') ? 'QUERYING' : 'LOGIN'
	);

	const mergeData = useCallback(
		(data: Partial<Int.Root>) =>
			setData((prevData: Partial<Int.Root>) => {
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
					class={tw`AS_ROOT grid min-h-screen theme-blue
						bg-gray-(100,dark:900) text-gray-(800,dark:100)
						icon-p-gray-(500,dark:100) icon-s-gray-(400,dark:300)`}>
					<LoginPage onLogin={() => setState('AUTH')} />
				</div>
			) : (
				<Router basename='/admin'>
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
									class={tw`AS_ROOT grid min-h-screen font-sans pl-14 theme-blue
										bg-gray-(100,dark:900) text-gray-(800,dark:100)
										icon-p-gray-(500,dark:100) icon-s-gray-(400,dark:300)`}>
									<div class={tw`grid animate-fadein`}>
										<Sidebar />
										<Routes>
											<Route path='/' element={<MainPage />} />
											<Route path='/routes/*' element={<PagesPage />} />
											<Route path='/media/' element={<MediaPage />} />
											<Route path='/media/:id' element={<MediaPage />} />
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
