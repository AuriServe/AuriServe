import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';

import './InputNumeric.sass';

import { WidgetProps as Props } from '../Input';


/**
 * A numeric input widget.
 */

const InputNumeric = forwardRef<HTMLInputElement, Props>((props, fRef) => {
	const cb = (evt: any) => props.setValue(evt.target.value);

	return (
		<input
			value={props.value}
			onInput={cb}
			onChange={cb}
			
			class={('InputNumeric ' + (props.class ?? '')).trim()}
			style={props.style}

			type='number'
			ref={fRef as any}
			disabled={props.disabled}
			placeholder={props.placeholder}

			onFocus={props.onFocusChange ? () => props.onFocusChange!(true) : undefined}
			onBlur={props.onFocusChange ? () => props.onFocusChange!(false) : undefined}
		/>
	);
});

export default InputNumeric;
