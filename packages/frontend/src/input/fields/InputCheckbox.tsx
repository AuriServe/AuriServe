import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';

import './InputCheckbox.sass';

import { WidgetProps } from '../Input';

interface Props extends WidgetProps {
	alignRight?: boolean;
}

/**
 * A two-state checkbox input widget.
 */

const InputCheckbox = forwardRef<HTMLInputElement, Props>((props, fRef) => {
	const cb = () => props.setValue(!props.value);
	
	return (
		<input
			class={('InputCheckbox ' + (props.alignRight ? 'AlignRight ' : '') + (props.class ?? '')).trim()}
			style={props.style}

			checked={props.value}
			onChange={cb}
			
			ref={fRef as any}
			type='checkbox'
		/>
	);
});

export default InputCheckbox;
