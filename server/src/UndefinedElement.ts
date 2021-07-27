import { h } from 'preact';

const style = {
	'margin': '8px',
	'display': 'flex',
	'align-items': 'center',
	'justify-content': 'center',
	'min-height': '128px',

	'background-color': 'white',
	'border': '2px solid #ccc',
	'border-radius': '8px'
};

export default function UndefinedElement(props: any) {
	return (
		h('div', { class: 'UndefinedElement', style: style },
			h('p', null,
				h('strong', null, props.elem),
				' is undefined.'
			)
		)
	);
}
