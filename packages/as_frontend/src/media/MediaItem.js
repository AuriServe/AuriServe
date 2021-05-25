"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const as_common_1 = require("as_common");
const hooks_1 = require("preact/hooks");
require("./MediaItem.sass");
const MediaIcon_1 = tslib_1.__importDefault(require("./MediaIcon"));
const Selectable_1 = tslib_1.__importDefault(require("../structure/Selectable"));
function MediaItem({ user, item, ind, onClick }) {
    var _a;
    const callbacks = hooks_1.useMemo(() => ({ onDoubleClick: onClick }), []);
    return (<li class='MediaItem'>
			<Selectable_1.default class='MediaItem-Select' ind={ind} callbacks={callbacks} doubleClickSelects={true}>
				<MediaIcon_1.default path={item.url}/>
				<div class='MediaItem-Description'>
					<p class='MediaItem-Title'>{item.name}</p>
					<p class='MediaItem-Author'>Uploaded by {(_a = user === null || user === void 0 ? void 0 : user.username) !== null && _a !== void 0 ? _a : '[Unknown]'} {as_common_1.Format.date(item.created)}.</p>
					<p class='MediaItem-Size'>{(item.size && as_common_1.Format.vector(item.size, 'px') + ' • ')} {as_common_1.Format.bytes(item.bytes)}</p>
				</div>
			</Selectable_1.default>
		</li>);
}
exports.default = MediaItem;
