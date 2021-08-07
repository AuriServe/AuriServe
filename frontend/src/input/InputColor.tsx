import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useState, useRef } from 'preact/hooks';

import { Color } from 'common';

import Text from './InputText';
import Popup from '../structure/Popup';
import ColorPicker from './ColorPicker';

import { usePopupCancel } from '../Hooks';
import { InputProps, FocusableInputProps } from './index';

import { mergeClasses } from 'common/util';

import style from './Input.sss';


/** Props for the color input element. */
interface Props extends InputProps, FocusableInputProps {

	/** Whether or not you can directly input a hex value. */
	writable?: boolean;

	/** Whether or not the hex value is displayed on the picker. */
	displayHex?: boolean;

	/** Whether or not to only display a button. */
	button?: boolean;
}


/**
 *
 */

export default forwardRef<HTMLInputElement, Props>(function InputColor(props, fRef) {
	const ref = useRef<HTMLDivElement>(null);
	const [ pickerActive, setPickerActive ] = useState(false);

	usePopupCancel(ref, () => setPickerActive(false));

	const value: Color.HSVA = props.value ?? { h: 0.58, s: 0.52, v: 0.41, a: 1 };

	return (
		<div ref={ref} style={props.style}
			class={mergeClasses('relative p-0 overflow-hidden',
				style.Input, props.class)}
			onFocusCapture={() => setPickerActive(true)}>

			<Text ref={fRef} maxLength={7}
				class='pl-12 font-mono p-0 border-none bg-transparent'
				value={Color.convert(value).toHex()}
				onValue={hex => props.onValue?.(Color.convert(hex).toHSVA())}/>

			<div style={{ backgroundColor: Color.convert(value).toHex() }}
				class='absolute top-2 left-2 -m-px w-8 h-8 rounded pointer-events-none shadow-sm'/>

			<Popup active={pickerActive} defaultAnimation={true}>
				<ColorPicker value={value} onValue={props.onValue} parent={ref.current} />
			</Popup>
		</div>
	);
});
