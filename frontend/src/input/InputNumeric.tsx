import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';

import { InputProps, FocusableInputProps } from './index';
import { mergeClasses } from 'common/util';

import style from './Input.sss';

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
			
			class={mergeClasses(style.Input, props.class)}
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
