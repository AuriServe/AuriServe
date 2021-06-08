import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './Tailwind.tw';

import Sidebar from './Sidebar';
import PageEditorControl from './pages/editor/PageEditorControlPage';
import PageEditorRenderer from './pages/editor/PageEditorRendererPage';
import { LoginPage, MainPage, PagesPage, MediaPage, SettingsPage, UserPage } from './pages';

import { useQuery, QUERY_INFO } from './Graph';

type AppState = 'QUERYING' | 'LOGIN' | 'AUTH';

document.documentElement.classList.add('dark');

/**
 * Main entry point for the application.
 * Handles authentication and context data.
 * Renders pages and navigation.
 */

export default function App() {
	const [ ,, reload ] = useQuery(QUERY_INFO);
	const [ state, setState ] = useState<AppState>(() => Cookie.get('tkn') ? 'QUERYING' : 'LOGIN');

	const initData = async () => {
		setState('AUTH');
		reload();
	};

	useEffect(() => {
		if (state === 'QUERYING') initData();
	}, [ state ]);

	return (
		<Preact.Fragment>
			{state === 'LOGIN' ?
				<div class='AS_ROOT grid min-h-screen text-gray-100 dark:text-gray-800  bg-gray-900 dark:bg-gray-050'>
					<LoginPage onLogin={initData} />
				</div> :
				<Router basename='/admin'>
					<Switch>
						<Route exact path='/renderer' component={PageEditorRenderer as any} />
						<Route strict path='/pages/' component={PageEditorControl as any} />

						<Route>
							<div class='AS_ROOT grid pl-14 min-h-screen text-gray-100 dark:text-gray-800 bg-gray-900 dark:bg-gray-050'>
								<div class='grid animate-fadein'>
									<Sidebar/>
									<Switch>
										<Route exact path='/' component={MainPage as any}/>
										<Route exact path='/pages' component={PagesPage as any}/>
										<Route exact path='/media' component={MediaPage as any}/>
										<Route path='/settings' component={SettingsPage as any}/>

										<Route path='/users/' component={UserPage as any}/>

										<Redirect exact to='/'/>
									</Switch>
								</div>
							</div>
						</Route>
					</Switch>
				</Router>
			}
		</Preact.Fragment>
	);
}
