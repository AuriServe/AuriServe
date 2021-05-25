"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
require("./ElementPropArray.sass");
class ElementPropArray extends Preact.Component {
    render() {
        const friendlyName = this.props.prop.name ||
            this.props.identifier.split(' ').map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(' ');
        return (<label key={this.props.identifier} className="ElementPropArray">
				<span className="ElementPropArray-Label">{friendlyName}</span>
				<span className="ElementPropArray-Disclaimer">
					Array props can't be edited by the builtin element editor.
					Use a custom editElement until this is implemented.
				</span>
			</label>);
    }
}
exports.default = ElementPropArray;
