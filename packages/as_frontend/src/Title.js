"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_helmet_1 = require("react-helmet");
const Graph_1 = require("./Graph");
function Title({ children: title }) {
    const [{ info }] = Graph_1.useQuery(Graph_1.QUERY_INFO, { loadOnMount: false });
    const titleStr = (info === null || info === void 0 ? void 0 : info.name) ? `${title} • ${info.name}` : `${title} • AuriServe`;
    return (<react_helmet_1.Helmet>
			<title>{titleStr}</title>
		</react_helmet_1.Helmet>);
}
exports.default = Title;
