"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("preact/hooks");
require("./ElementEditor.sass");
const ElementPropInput_1 = tslib_1.__importDefault(require("./ElementPropInput"));
const ElementPropArray_1 = tslib_1.__importDefault(require("./ElementPropArray"));
function ElementEditor(props) {
    var _a;
    const [data, setData] = hooks_1.useState({ element: props.element,
        props: JSON.parse(JSON.stringify(props.element.props)) });
    if (props.element !== data.element) {
        setData({ element: props.element, props: JSON.parse(JSON.stringify(props.element.props)) });
        return null;
    }
    const definition = props.defs[props.element.elem];
    if (!definition)
        return null;
    const propDefs = definition.config.props;
    const EditElement = (_a = definition === null || definition === void 0 ? void 0 : definition.editing) === null || _a === void 0 ? void 0 : _a.propertyEditor;
    const handleSetProps = (object) => setData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), object) }));
    const handleSetProp = (identifier, object) => handleSetProps({ [identifier]: object });
    let renderProp;
    const renderPropsTable = (props, values, fullIdentifier) => {
        return (<div className='ElementEditor-PropsTable'>
				{Object.entries(props).map(([k, v]) => renderProp(k, v, values, fullIdentifier + (fullIdentifier !== '' ? '.' : '') + k))}
			</div>);
    };
    renderProp = (identifier, p, values, fullIdentifier) => {
        if ('fields' in p) {
            const friendlyName = p.name || identifier.split(' ').map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(' ');
            return (<label key={fullIdentifier + '-LABEL'} className='ElementEditor-TableWrap'>
					<span>{friendlyName}</span>
					{renderPropsTable(p.fields, values[identifier], fullIdentifier)}
				</label>);
        }
        else if ('entries' in p) {
            return (<ElementPropArray_1.default prop={p} key={fullIdentifier} identifier={identifier} value={values[identifier]} onChange={handleSetProps}/>);
        }
        else {
            return (<ElementPropInput_1.default prop={p} key={fullIdentifier} identifier={identifier} value={values[identifier]} onChange={(value) => handleSetProp(identifier, value)}/>);
        }
    };
    return (<div class={'ElementEditor ' + (EditElement ? 'Custom' : 'Automatic')}>
			{(EditElement && typeof EditElement != 'boolean' ?
            <EditElement props={data.props} setProps={handleSetProps}/> :
            renderPropsTable(propDefs, data.props, ''))}

			<div className='ElementEditor-ActionBar'>
				<button onClick={() => props.onSave(data.props)}>Confirm</button>
				<button onClick={props.onCancel}>Cancel</button>
			</div>
		</div>);
}
exports.default = ElementEditor;
