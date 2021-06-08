// import * as Preact from 'preact';
// import { FieldProp, PropType } from 'auriserve-api';

// import * as Input from '../input/Input';

// interface Props {
// 	identifier: string;
// 	prop: FieldProp;
// 	value: any;

// 	onChange: (newValue: any) => void;
// }


// /**
//  * Main Input Element, determines the type of the property,
//  * and renders the appropriate Input wrapped in a label.
//  */

// export default function ElementPropInput(props: Props) {
// 	const types = (Array.isArray(props.prop.type) ? props.prop.type : [props.prop.type]) as PropType[];
// 	const currentType = types[0];
// 	const baseType = (Array.isArray(currentType) ? 'enum' : (types[0] as string).split(':')[0]) as PropType | 'enum';

// 	const displayName = props.prop.name ||
// 		props.identifier.split(' ').map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(' ');

// 	const widgetProps = {
// 		value: props.value,
// 		setValue: props.onChange
// 	};

// 	return (
// 		<Input.Label key={props.identifier} label={displayName}>
// 			{(() => {
// 				switch (baseType) {
// 				default:
// 					console.error(`Unhandled baseType '${baseType}'`);
// 					// fall through

// 				case 'text':
// 					return <Input.Text {...widgetProps} />;

// 				case 'long_text':
// 					return <Input.Text {...widgetProps} long={true} />;
				
// 				case 'html':
// 					return <Input.Text {...widgetProps} long={true} code={true} />;

// 				case 'number':
// 					return <Input.Numeric {...widgetProps} />;

// 				case 'datetime':
// 					return <Input.DateTime {...widgetProps} />;

// 				case 'boolean':
// 					return <Input.Checkbox {...widgetProps} alignRight={true} />;

// 				case 'color':
// 					return <Input.Color {...widgetProps} />;

// 				case 'media':
// 					return <Input.Media value={props.value.identifier}
// 						setValue={() => props.onChange(undefined)} />;

// 				case 'enum':
// 					let options: { [key: string]: string } = {};
// 					(currentType as string[]).forEach(v => options[v] = '');
// 					return <Input.Select {...widgetProps} options={options} />;

// 				case 'custom':
// 					return <span class='ElementPropArray-Disclaimer'>
// 						Custom props can't be edited by the builtin element editor.
// 						Use a custom editElement until this is implemented.
// 					</span>;
// 				}
// 			})()}
// 		</Input.Label>
// 	);
// }
