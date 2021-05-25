"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
const hooks_1 = require("preact/hooks");
const Graph_1 = require("../Graph");
require("./UserPage.sass");
const Title_1 = tslib_1.__importDefault(require("../Title"));
const UserRolesList_1 = tslib_1.__importDefault(require("../user/UserRolesList"));
function UserPage() {
    const [{ users }] = Graph_1.useQuery(Graph_1.QUERY_USERS);
    const id = hooks_1.useMemo(() => window.location.pathname.replace(/^\/admin\/users\//g, ''), []);
    const user = (users !== null && users !== void 0 ? users : []).filter(u => u.id === id)[0];
    return (<div class='Page UserPage'>
			<Title_1.default>{id}</Title_1.default>
			<section class='Page-Card UserPage-Card'>
				<div class='UserPage-Header'>
					{user && <Preact.Fragment>
						<img class='UserPage-Icon' src='/admin/asset/icon/user-color.svg' alt=''/>
						<div class='UserPage-Details'>
							<h1 class='UserPage-Name'>{user.username}</h1>
							<h2 class='UserPage-Identifier'>{user.id}</h2>
							<UserRolesList_1.default user={user} wrap={true} edit={true}/>
						</div>
					</Preact.Fragment>}
				</div>
			</section>
		</div>);
}
exports.default = UserPage;
