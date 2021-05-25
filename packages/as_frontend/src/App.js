"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const js_cookie_1 = tslib_1.__importDefault(require("js-cookie"));
const Preact = tslib_1.__importStar(require("preact"));
const hooks_1 = require("preact/hooks");
const react_router_dom_1 = require("react-router-dom");
require("./App.sass");
const AppHeader_1 = tslib_1.__importDefault(require("./AppHeader"));
const Pages = tslib_1.__importStar(require("./page/Pages"));
const Graph_1 = require("./Graph");
const PageEditorControlPage_1 = tslib_1.__importDefault(require("./page/editor/PageEditorControlPage"));
const PageEditorRendererPage_1 = tslib_1.__importDefault(require("./page/editor/PageEditorRendererPage"));
function App() {
    const [, , reload] = Graph_1.useQuery(Graph_1.QUERY_INFO);
    const [state, setState] = hooks_1.useState(() => js_cookie_1.default.get('tkn') ? 'QUERYING' : 'LOGIN');
    const initData = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        setState('AUTH');
        reload();
    });
    hooks_1.useEffect(() => {
        if (state === 'QUERYING')
            initData();
    }, [state]);
    return (<Preact.Fragment>
			{state === 'LOGIN' ?
            <div class='App'>
					<Pages.Login onLogin={initData}/>
				</div> :
            <react_router_dom_1.BrowserRouter basename='/admin'>
					<react_router_dom_1.Switch>
						<react_router_dom_1.Route exact path='/renderer' component={PageEditorRendererPage_1.default}/>
						<react_router_dom_1.Route strict path='/pages/' component={PageEditorControlPage_1.default}/>

						<react_router_dom_1.Route>
							<div class='App'>
								<div class='App-Wrap'>
									<AppHeader_1.default />
									<react_router_dom_1.Switch>
										<react_router_dom_1.Route exact path='/' component={Pages.Main}/>
										<react_router_dom_1.Route exact path='/pages' component={Pages.Pages}/>
										<react_router_dom_1.Route exact path='/media' component={Pages.Media}/>
										<react_router_dom_1.Route path='/settings' component={Pages.Settings}/>

										<react_router_dom_1.Route path='/users/' component={Pages.User}/>

										<react_router_dom_1.Redirect exact to='/'/>
									</react_router_dom_1.Switch>
								</div>
							</div>
						</react_router_dom_1.Route>
					</react_router_dom_1.Switch>
				</react_router_dom_1.BrowserRouter>}
		</Preact.Fragment>);
}
exports.default = App;
