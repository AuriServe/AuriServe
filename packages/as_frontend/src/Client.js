"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const js_cookie_1 = tslib_1.__importDefault(require("js-cookie"));
const Preact = tslib_1.__importStar(require("preact"));
const Popout_1 = tslib_1.__importDefault(require("./structure/Popout"));
let root;
const onLogout = () => {
    js_cookie_1.default.remove('tkn');
    Preact.render('', document.body, root);
};
root = Preact.render(Preact.h(Popout_1.default, { onLogout }), document.body);
