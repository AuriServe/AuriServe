// import * as Preact from 'preact';
// import { useState } from 'preact/hooks';
// import { Page, Prop, PropsTable, FieldProp, ArrayProp } from 'auriserve-api';

// import './ElementEditor.sass';

// import ElementPropInput from './ElementPropInput';
// import ElementPropArray from './ElementPropArray';

// import { PluginElements } from '../../LoadPlugins';

// interface Props {
// 	defs: PluginElements;
// 	element: Page.Element;

// 	onCancel: () => void;
// 	onSave: (props: any) => void;
// }

// export default function ElementEditor(props: Props) {
// 	const [ data, setData ] = useState<{ element: Page.Element; props: any }>({ element: props.element,
// 		props: JSON.parse(JSON.stringify(props.element.props)) });
	
// 	if (props.element !== data.element) {
// 		setData({ element: props.element, props: JSON.parse(JSON.stringify(props.element.props))});
// 		return null;
// 	}

// 	const definition = props.defs[props.element.elem];
// 	if (!definition) return null;

// 	const propDefs = definition.config.props;
// 	const EditElement = definition?.editing?.propertyEditor;

// 	const handleSetProps = (object: any) => setData({ ...data, props: { ...data.props, ...object } });
// 	const handleSetProp = (identifier: string, object: any) => handleSetProps({ [identifier]: object });

// 	let renderProp: (identifier: string, p: Prop, values: any, fullIdentifier: string) => void;

// 	const renderPropsTable = (props: PropsTable, values: any, fullIdentifier: string) => {
// 		return (
// 			<div className='ElementEditor-PropsTable'>
// 				{Object.entries(props).map(([k, v]) => renderProp(
// 					k, v, values, fullIdentifier + (fullIdentifier !== '' ? '.' : '') + k))}
// 			</div>
// 		);
// 	};

// 	renderProp = (identifier: string, p: Prop, values: any, fullIdentifier: string) => {
// 		// Table
// 		if ('fields' in p) {
// 			const friendlyName = p.name || identifier.split(' ').map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(' ');

// 			return (
// 				<label key={fullIdentifier + '-LABEL'} className='ElementEditor-TableWrap'>
// 					<span>{friendlyName}</span>
// 					{renderPropsTable(p.fields, values[identifier], fullIdentifier)}
// 				</label>
// 			);
// 		}
// 		// Array
// 		else if ('entries' in p) {
// 			return (
// 				<ElementPropArray
// 					prop={p as ArrayProp}
// 					key={fullIdentifier}
// 					identifier={identifier}
// 					value={values[identifier]}
// 					onChange={handleSetProps}
// 				/>
// 			);
// 		}
// 		// Field
// 		else {
// 			return (
// 				<ElementPropInput
// 					prop={p as FieldProp}
// 					key={fullIdentifier}
// 					identifier={identifier}
// 					value={values[identifier]}
// 					onChange={(value) => handleSetProp(identifier, value)}
// 				/>
// 			);
// 		}
// 	};

// 	return (
// 		<div class={'ElementEditor ' + (EditElement ? 'Custom' : 'Automatic')}>
// 			{(EditElement && typeof EditElement != 'boolean' ?
// 				<EditElement props={data.props} setProps={handleSetProps} /> :
// 				renderPropsTable(propDefs, data.props, '')
// 			)}

// 			<div className='ElementEditor-ActionBar'>
// 				<button onClick={() => props.onSave(data.props)}>Confirm</button>
// 				<button onClick={props.onCancel}>Cancel</button>
// 			</div>
// 		</div>
// 	);
// }
