import Cookie from 'js-cookie';
import { h, createContext } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Sidebar from './Sidebar';
import CommandPalette from './ShortcutPalette';
import { LoginPage, MainPage, PagesPage, MediaPage, UserPage,
	SettingsPage, EditorControlPage, EditorRendererPage } from './pages';

import './Tailwind.tw';

import * as Int from 'common/graph/type';

type AppState = 'QUERYING' | 'LOGIN' | 'AUTH';

document.documentElement.classList.add('dark');


/** Defines the content of the App Context. */
export interface AppContextData { data: Partial<Int.Root>; mergeData(data: Partial<Int.Root>): void }


/** The App Context containing graph data. */
export const AppContext = createContext<AppContextData>({
	data: {}, mergeData: () => { throw 'Accessed default AppContext'; }});;;;


/**
 * Main entry point for the application.
 * Handles authentication and context data.
 * Renders pages and navigation.
 */

export default function App() {
	const [ data, setData ] = useState<Partial<Int.Root>>({});
	const [ state, setState ] = useState<AppState>(() => Cookie.get('tkn') ? 'QUERYING' : 'LOGIN');

	const mergeData = useCallback((data: Partial<Int.Root>) =>
		setData((prevData: Partial<Int.Root>) => { return { ...prevData, ...data }; }), []);

	useEffect(() => {
		if (state === 'QUERYING') setState('AUTH');
	}, [ state ]);

	return (
		<AppContext.Provider value={{ data, mergeData }}>
			{state === 'LOGIN' ?
				<div class='AS_ROOT grid min-h-screen bg-neutral-100 dark:bg-neutral-900'>
					<LoginPage onLogin={() => setState('AUTH')} />
				</div> :
				<Router basename='/admin'>
					<Route path="/:url*" exact strict render={(props) =>
						<Redirect to={`${props.location.pathname}/${props.location.search}`} />} />

					<Switch>
						<Route exact path='/renderer' component={EditorRendererPage as any} />
						<Route strict path='/pages/:page'>
							<div class='AS_ROOT grid min-h-screen bg-neutral-50 dark:bg-neutral-900'>
								<EditorControlPage/>
							</div>
						</Route>

						<Route>
							<div class='AS_ROOT grid pl-14 min-h-screen bg-neutral-100 dark:bg-neutral-900
								text-neutral-800 dark:text-neutral-100 font-sans icon-p-neutral-500 icon-s-neutral-400
								dark:icon-p-neutral-100 dark:icon-s-neutral-300 theme-cyan'>
								<div class='grid animate-fadein'>
									<Sidebar/>
									<Switch>
										<Route exact path='/' component={MainPage as any}/>
										<Route exact path={[ '/routes/', '/routes/edit/*' ]} component={PagesPage as any}/>
										<Route exact path='/media/:id?' component={MediaPage as any}/>
										<Route path='/settings/' component={SettingsPage as any}/>

										<Route path='/users/:id' component={UserPage as any}/>

										<Redirect exact to='/'/>
									</Switch>
								</div>
							</div>
						</Route>
					</Switch>

					<CommandPalette/>
				</Router>
			}
		</AppContext.Provider>
	);
}
