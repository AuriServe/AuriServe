"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const as_common_1 = require("as_common");
const react_router_dom_1 = require("react-router-dom");
const Title_1 = tslib_1.__importDefault(require("../Title"));
const Meter_1 = tslib_1.__importDefault(require("../structure/Meter"));
const CardHeader_1 = tslib_1.__importDefault(require("../structure/CardHeader"));
const Graph_1 = require("../Graph");
require("./MainPage.sass");
function MainPage() {
    var _a, _b, _c, _d, _e, _f;
    const [{ info, quotas }] = Graph_1.useQuery([Graph_1.QUERY_INFO, Graph_1.QUERY_QUOTAS]);
    return (<div class='MainPage'>
			<Title_1.default>Home</Title_1.default>
			<div class='MainPage-Header'>
				<h1>
					<img src='/admin/asset/icon/globe-dark.svg' alt=''/>
					{(_a = info === null || info === void 0 ? void 0 : info.domain) !== null && _a !== void 0 ? _a : '...'}
				</h1>
				<h2>{(_b = info === null || info === void 0 ? void 0 : info.name) !== null && _b !== void 0 ? _b : '...'}</h2>
			</div>
			<div class='MainPage-Content'>
				<aside>
					{false && <div class='MainPage-Card MainPage-Update'>
						<div class='MainPage-UpdateImage'>
							<img src='/admin/asset/icon/serve-light.svg'/>
						</div>
						<h3>AuriServe is ready to Update!</h3>
						<h4>— Changes and Improvements —</h4>
						<ul>
							<li>New stuff</li>
							<li>Crazy cool features</li>
							<li>Ability score improvement</li>
							<li>30% Less viruses</li>
						</ul>
						<react_router_dom_1.NavLink className='MainPage-UpdateButton' to='/'>Update Now</react_router_dom_1.NavLink>
					</div>}

					<div class='MainPage-Card MainPage-Storage'>
						<CardHeader_1.default title='Storage Overview' icon='/admin/asset/icon/element-dark.svg' subtitle={`${as_common_1.Format.bytes((_c = quotas === null || quotas === void 0 ? void 0 : quotas.storage.used) !== null && _c !== void 0 ? _c : 0)} / ${as_common_1.Format.bytes((_d = quotas === null || quotas === void 0 ? void 0 : quotas.storage.allocated) !== null && _d !== void 0 ? _d : 0)} consumed`}/>

						<Meter_1.default class='MainPage-StorageMeter' usage={(_e = quotas === null || quotas === void 0 ? void 0 : quotas.storage.used) !== null && _e !== void 0 ? _e : 0} size={(_f = quotas === null || quotas === void 0 ? void 0 : quotas.storage.allocated) !== null && _f !== void 0 ? _f : 1}/>

						<react_router_dom_1.NavLink to='/media'>Manage Media</react_router_dom_1.NavLink>
					</div>
				</aside>
				<main>
					<div class='MainPage-Card MainPage-Other'>
						<CardHeader_1.default title='Quick Links' subtitle='Access admin content quickly.' icon='/admin/asset/icon/view-dark.svg'/>
						<h3><a href='/admin/pages/index'>Edit Calendar</a></h3>
						<p>Open the home page editor, which allows you to edit the calendar within it.</p>

						<h3><react_router_dom_1.NavLink to='/admin/settings/overview'>Manage site metadata</react_router_dom_1.NavLink></h3>
						<p>Change the site name, description, and favicon.</p>
					</div>
				</main>
			</div>
		</div>);
}
exports.default = MainPage;
