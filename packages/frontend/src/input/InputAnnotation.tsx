import * as Preact from 'preact';

import './InputAnnotation.sass';

interface Props {
	title: string;
	description?: string;

	children?: Preact.ComponentChildren;
}

export default function InputAnnotation(props: Props) {
	return (
		<label class='InputAnnotation'>
			<p class='InputAnnotation-Title'>{props.title}</p>
			{props.description && <p class='InputAnnotation-Description'>{props.description}</p>}

			{props.children}
		</label>
	);
}
