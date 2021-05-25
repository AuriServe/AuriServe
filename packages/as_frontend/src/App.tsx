import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.sass';

import AppHeader from './AppHeader';
import * as Pages from './page/Pages';
import { useQuery, QUERY_INFO } from './Graph';
import PageEditorControl from './page/editor/PageEditorControlPage';
import PageEditorRenderer from './page/editor/PageEditorRendererPage';

type AppState = 'QUERYING' | 'LOGIN' | 'AUTH';


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
				<div class='App'>
					<Pages.Login onLogin={initData} />
				</div> :
				<Router basename='/admin'>
					<Switch>
						<Route exact path='/renderer' component={PageEditorRenderer as any} />
						<Route strict path='/pages/' component={PageEditorControl as any} />

						<Route>
							<div class='App'>
								<div class='App-Wrap'>
									<AppHeader/>
									<Switch>
										<Route exact path='/' component={Pages.Main as any}/>
										<Route exact path='/pages' component={Pages.Pages as any}/>
										<Route exact path='/media' component={Pages.Media as any}/>
										<Route path='/settings' component={Pages.Settings as any}/>

										<Route path='/users/' component={Pages.User as any}/>

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
