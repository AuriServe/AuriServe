"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryData = exports.AppContext = void 0;
const tslib_1 = require("tslib");
const js_cookie_1 = tslib_1.__importDefault(require("js-cookie"));
const Preact = tslib_1.__importStar(require("preact"));
exports.AppContext = Preact.createContext({
    data: {}, mergeData: () => { throw 'Accessed default AppContext'; }
});
function queryData(mergeData, query) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const refreshArray = Array.isArray(query) ? query : [query];
        const res = yield fetch('/admin/data/' + refreshArray.join('&'), { cache: 'no-cache' });
        if (res.status !== 200) {
            js_cookie_1.default.remove('tkn');
            location.href = '/admin';
            return {};
        }
        else {
            mergeData(yield res.json());
            return res;
        }
    });
}
exports.queryData = queryData;
;
