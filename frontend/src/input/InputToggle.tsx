import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import './InputCheckbox.sass';

import { InputProps } from './index';

interface Props extends InputProps {
	alignRight?: boolean;
}

/**
 * A two-state checkbox input widget.
 */

const InputCheckbox = forwardRef<HTMLInputElement, Props>((props, fRef) => {
	const cb = () => props.onValue?.(!props.value);

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
