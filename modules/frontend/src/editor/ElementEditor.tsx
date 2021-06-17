import * as Preact from 'preact';
import { useState } from 'preact/hooks';
import { ComponentNode } from 'common/Page';
import { Prop, PropsTable, FieldProp, ArrayProp } from 'common/definition';

import { Form } from '../input';
import { Button } from '../structure';

import ElementPropInput from './ElementPropInput';
import ElementPropArray from './ElementPropArray';

import { PluginElements } from './LoadPlugins';

interface Props {
	defs: PluginElements;
	element: ComponentNode;

	onCancel: () => void;
	onSave: (props: any) => void;
}

export default function ElementEditor(props: Props) {
	const [ data, setData ] = useState<{ element: ComponentNode; props: any }>(
		{ element: props.element, props: JSON.parse(JSON.stringify(props.element.props ?? {})) });
	
	if (props.element !== data.element) {
		setData({ element: props.element, props: JSON.parse(JSON.stringify(props.element.props ?? {}))});
		return null;
	}

	const definition = props.defs[props.element.elem];
	if (!definition) return null;

	const propDefs = definition.config.props;
	const EditElement = definition?.editing?.propertyEditor;

	const handleSetProps = (object: any) => {
		const newData = { ...data, props: { ...data.props, ...object } };
		setData(newData);
		props.onSave(newData.props);
	};
	const handleSetProp = (identifier: string, object: any) => handleSetProps({ [identifier]: object });

	let renderProp: (identifier: string, p: Prop, values: any, fullIdentifier: string) => void;

	const renderPropsTable = (props: PropsTable, values: any, fullIdentifier: string) => {
		return (
			<div className='ElementEditor-PropsTable'>
				{Object.entries(props).map(([k, v]) => renderProp(
					k, v, values, fullIdentifier + (fullIdentifier !== '' ? '.' : '') + k))}
			</div>
		);
	};

	renderProp = (identifier: string, p: Prop, values: any, fullIdentifier: string) => {
		// Table
		if ('fields' in p) {
			const friendlyName = p.name || identifier.split(' ').map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(' ');

			return (
				<label key={fullIdentifier + '-LABEL'} className='ElementEditor-TableWrap'>
					<span>{friendlyName}</span>
					{renderPropsTable(p.fields, values[identifier], fullIdentifier)}
				</label>
			);
		}
		// Array
		else if ('entries' in p) {
			return (
				<ElementPropArray
					prop={p as ArrayProp}
					key={fullIdentifier}
					identifier={identifier}
					value={values[identifier]}
					onChange={handleSetProps}
				/>
			);
		}
		// Field
		else {
			return (
				<ElementPropInput
					prop={p as FieldProp}
					key={fullIdentifier}
					identifier={identifier}
					value={values[identifier]}
					onChange={(value) => handleSetProp(identifier, value)}
				/>
			);
		}
	};

	return (
		<Form onSubmit={() => props.onSave(data.props)}>
			<div class='flex flex-row-reverse justify-between pb-3'>
				<Button type='submit' label='Save'/>
				<Button onClick={props.onCancel} label='Close'/>
			</div>

			{(EditElement && typeof EditElement != 'boolean' ?
				<EditElement props={data.props} setProps={handleSetProps} /> :
				renderPropsTable(propDefs, data.props, '')
			)}
		</Form>
	);
}
