import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';

import './InputNumeric.sass';

import { InputProps, FocusableInputProps } from './index';

interface Props extends InputProps, FocusableInputProps {}

/**
 * A numeric input widget.
 */

const InputNumeric = forwardRef<HTMLInputElement, Props>((props, fRef) => {
	const cb = (evt: any) => props.onValue?.(evt.target.value);

	return (
		<input
			value={props.value}
			onInput={cb}
			onChange={cb}
			
			class={('InputNumeric ' + (props.class ?? '')).trim()}
			style={props.style}

			type='number'
			ref={fRef as any}
			placeholder={props.placeholder}
			disabled={!(props.enabled ?? true)}

			onFocus={props.onFocus}
			onBlur={props.onBlur}
		/>
	);
});

export default InputNumeric;
