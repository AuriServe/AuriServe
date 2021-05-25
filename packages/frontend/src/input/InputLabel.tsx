import * as Preact from 'preact';

import './InputLabel.sass';

interface Props {
	label: string;

	class?: string;
	style?: any;
	children?: Preact.ComponentChildren;
}

export default function InputLabel(props: Props) {
	return (
		<label class={('InputLabel ' + (props.class ?? '')).trim()} style={props.style}>
			<p class='InputLabel-Label'>{props.label}</p>
			{props.children}
		</label>
	);
}
