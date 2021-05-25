"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("preact/hooks");
const UserCard_1 = tslib_1.__importDefault(require("./UserCard"));
require("./UserTag.sass");
const Hooks_1 = require("../Hooks");
function UserTag({ user }) {
    Hooks_1.useImmediateRerender();
    const ref = hooks_1.useRef(null);
    const [active, setActive] = hooks_1.useState(false);
    return (<button class="UserTag" ref={ref} onClick={() => setActive(true)}>
			{user.username}

			{ref.current && <UserCard_1.default user={user} visible={active} parent={ref.current} onClose={() => setTimeout(() => setActive(false), 0)}/>}
		</button>);
}
exports.default = UserTag;
