import { h } from 'preact';
import { useData, QUERY_MEDIA } from '../Graph';
import { FieldProp, PropType } from 'common/definition';

import * as Input from '../input';

interface Props {
	identifier: string;
	prop: FieldProp;
	value: any;

	onChange: (newValue: any) => void;
}


/**
 * Main Input Element, determines the type of the property,
 * and renders the appropriate Input wrapped in a label.
 */

export default function PropInput(props: Props) {
	const [ { media } ] = useData(QUERY_MEDIA, []);

	const types = (Array.isArray(props.prop.type) ? props.prop.type : [props.prop.type]) as PropType[];
	const currentType = types[0];
	const baseType = (Array.isArray(currentType) ? 'enum' : (types[0] as string).split(':')[0]) as PropType | 'enum';

	const displayName = props.prop.name ||
		props.identifier.split(' ').map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(' ');

	const widgetProps = {
		value: props.value,
		onValue: props.onChange
	};

	return (
		<Input.Label key={props.identifier} label={displayName}>
			{(() => {
				switch (baseType) {
				default:
					console.error(`Unhandled baseType '${baseType}'`);
					return <Input.Text {...widgetProps} />;

				case 'text':
					return <Input.Text {...widgetProps} />;

				case 'long_text':
					return <Input.Text {...widgetProps} multiline={true} />;

				case 'html':
					return <Input.Text {...widgetProps} multiline={true} mono={true} />;

				case 'number':
					return <Input.Numeric {...widgetProps} />;

					// case 'datetime':
					//	return <Input.DateTime {...widgetProps} />;*/}

				case 'boolean':
					return <Input.Toggle {...widgetProps} alignRight={true} />;

				case 'color':
					return <Input.Color {...widgetProps} />;

				case 'media':
					return <Input.Media value={props.value.id} onValue={id =>
						props.onChange((media ?? []).filter(media => media.id === id)[0])} />;

					// case 'enum':
					//	let options: { [key: string]: string } = {};
					//	(currentType as string[]).forEach(v => options[v] = '');
					//	return <Input.Select {...widgetProps} options={options} />;

				case 'custom':
					return <span>
						Custom props can't be edited by the builtin element editor.
						Use a custom editElement until this is implemented.
					</span>;
				}
			})()}
		</Input.Label>
	);
}
