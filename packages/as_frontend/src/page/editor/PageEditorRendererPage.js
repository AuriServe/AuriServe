"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
const react_helmet_1 = tslib_1.__importDefault(require("react-helmet"));
const use_async_memo_1 = require("use-async-memo");
const LoadPlugins_1 = tslib_1.__importDefault(require("../../plugin/LoadPlugins"));
function PageEditorRendererPage() {
    const elements = use_async_memo_1.useAsyncMemo(() => LoadPlugins_1.default({ scripts: true, styles: true, themes: true }), []);
    if (!elements)
        return;
    return (<Preact.Fragment>
			<react_helmet_1.default><style>{'body { height: auto; overflow: auto; }'}</style></react_helmet_1.default>
			
		</Preact.Fragment>);
}
exports.default = PageEditorRendererPage;
