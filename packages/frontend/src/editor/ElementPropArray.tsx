import * as Preact from 'preact';
import * as AS from 'auriserve-api';

import './ElementPropArray.sass';

interface Props {
	identifier: string;
	prop: AS.ArrayProp;

	value: any;
	onChange: (val: any) => void;
}

export default class ElementPropArray extends Preact.Component<Props, {}> {
	render() {
		const friendlyName = this.props.prop.name ||
			this.props.identifier.split(' ').map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(' ');

		return (
			<label key={this.props.identifier} className="ElementPropArray">
				<span className="ElementPropArray-Label">{friendlyName}</span>
				<span className="ElementPropArray-Disclaimer">
					Array props can't be edited by the builtin element editor.
					Use a custom editElement until this is implemented.
				</span>
			</label>
		);
	}
}
