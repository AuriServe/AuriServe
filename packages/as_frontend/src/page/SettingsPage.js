"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("preact/hooks");
const react_router_dom_1 = require("react-router-dom");
require("./SettingsPage.sass");
const Title_1 = tslib_1.__importDefault(require("../Title"));
const Settings = tslib_1.__importStar(require("./settings/Settings"));
function SettingsPage() {
    const [mobile, setMobile] = hooks_1.useState(window.innerWidth <= 800);
    const location = react_router_dom_1.useLocation();
    hooks_1.useEffect(() => {
        const query = window.matchMedia('screen and (max-width: 800px)');
        const int = setInterval(() => setMobile(query.matches), 250);
        return () => clearInterval(int);
    }, []);
    hooks_1.useEffect(() => {
        const app = document.querySelector('.App');
        if (!app)
            return;
        app.style.overflowY = 'scroll';
        return () => app.style.overflowY = '';
    }, []);
    const inPage = location.pathname.replace(/\/settings\/?/, '');
    return (<div class={('Page SettingsPage ' + (mobile ? 'Mobile' : '')).trim()}>
			<Title_1.default>Settings</Title_1.default>
			{(!mobile || !inPage) && <div class='Settings-Aside'>
				<ul class='Settings-Nav'>
					<li><span class='SettingsPage-Label'>Settings</span></li>
					<li><react_router_dom_1.NavLink activeClassName="active" to="/settings/overview">Overview</react_router_dom_1.NavLink></li>
					<li><hr /></li>
					<li><react_router_dom_1.NavLink activeClassName="active" to="/settings/themes">Themes</react_router_dom_1.NavLink></li>
					<li><react_router_dom_1.NavLink activeClassName="active" to="/settings/plugins">Plugins</react_router_dom_1.NavLink></li>
					<li><react_router_dom_1.NavLink activeClassName="active" to="/settings/media">Media</react_router_dom_1.NavLink></li>
					<li><hr /></li>
					<li><react_router_dom_1.NavLink activeClassName="active" to="/settings/users">Users</react_router_dom_1.NavLink></li>
					<li><react_router_dom_1.NavLink activeClassName="active" to="/settings/roles">Roles</react_router_dom_1.NavLink></li>
				</ul>
			</div>}
			{(!mobile || inPage) && <div class='Settings-Main'>
				<react_router_dom_1.Switch>
					<react_router_dom_1.Route exact path='/settings/overview' component={Settings.Main}/>
					<react_router_dom_1.Route exact path='/settings/themes' component={Settings.Themes}/>
					<react_router_dom_1.Route exact path='/settings/plugins' component={Settings.Plugins}/>
					<react_router_dom_1.Route exact path='/settings/media' component={Settings.Media}/>

					<react_router_dom_1.Route exact path='/settings/users' component={Settings.Users}/>
					<react_router_dom_1.Route exact path='/settings/roles' component={Settings.Roles}/>

					{!mobile && <react_router_dom_1.Redirect exact to='/settings/overview'/>}
				</react_router_dom_1.Switch>
			</div>}
		</div>);
}
exports.default = SettingsPage;
