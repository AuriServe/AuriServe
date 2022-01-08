import Cookie from 'js-cookie';
import { h, createContext } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import CommandPalette from './ShortcutPalette';
import {
	LoginPage,
	MainPage,
	PagesPage,
	MediaPage,
	UserPage,
	SettingsPage,
	EditorControlPage,
	EditorRendererPage,
} from './pages';

import './Tailwind.tw';

import * as Int from 'common/graph/type';

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
					class='AS_ROOT grid min-h-screen bg-neutral-100 dark:bg-neutral-900
						icon-p-neutral-500 icon-s-neutral-400 dark:icon-p-neutral-100 dark:icon-s-neutral-300 theme-blue'>
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
						<Route path='/renderer' element={<EditorRendererPage />} />
						<Route
							path='/pages/:page'
							element={
								<div class='AS_ROOT grid min-h-screen bg-neutral-50 dark:bg-neutral-900'>
									<EditorControlPage />
								</div>
							}
						/>
						<Route
							path='*'
							element={
								<div
									class='AS_ROOT grid pl-14 min-h-screen bg-neutral-100 dark:bg-neutral-900
										text-neutral-800 dark:text-neutral-100 font-sans icon-p-neutral-500 icon-s-neutral-400
										dark:icon-p-neutral-100 dark:icon-s-neutral-300 theme-blue'>
									<div class='grid animate-fadein'>
										<Sidebar />
										<Routes>
											<Route path='/' element={<MainPage />} />
											<Route path='/routes/*' element={<PagesPage />} />
											<Route path='/media/' element={<MediaPage />} />
											<Route path='/media/:id' element={<MediaPage />} />
											<Route path='/settings/*' element={<SettingsPage />} />
											<Route path='/users/:id' element={<UserPage />} />
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
