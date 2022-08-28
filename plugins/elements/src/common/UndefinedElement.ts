import { h } from 'preact';

const style = {
	'margin': '8px',
	'display': 'flex',
	'align-items': 'center',
	'justify-content': 'center',
	'min-height': '128px',

	'background-color': 'white',
	'color': 'black',
	'border': '2px solid #ccc',
	'border-radius': '8px',
};

interface Props {
	elem: string;
}

export default function UndefinedElement(props: Props) {
	return h(
		'div',
		{ class: 'UndefinedElement', style },
		h('p', null, h('strong', null, props.elem), ' is undefined.')
	);
}
