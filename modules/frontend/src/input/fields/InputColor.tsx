import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { useState, useRef } from 'preact/hooks';

import { Color } from 'common';

import { WidgetProps } from '../Input';

import InputText from './InputText';
import ColorPicker from '../ColorPicker';
import Popup from '../../structure/Popup';
import { usePopupCancel } from '../../Hooks';

import './InputColor.sass';

interface Props {
	writable?: boolean;
	displayHex?: boolean;
	full?: boolean;
}

const InputColor = forwardRef<HTMLInputElement, Props & WidgetProps>((props, fRef) => {
	const value = props.value ?? { h: 0.58, s: 0.52, v: 0.41 };
	const inputRef = useRef<HTMLDivElement>(null);
	const [ pickerActive, setPickerActive ] = useState(false);

	usePopupCancel(inputRef, () => setPickerActive(false));

	return (
		<div class={('InputColor ' + (props.full ? 'Full ' : '') + (props.class ?? '')).trim()}
			style={props.style} onFocusCapture={() => setPickerActive(true)} ref={inputRef}>
			<InputText
				ref={fRef}
				value={Color.convert(value).toHex()}
				setValue={hex => props.setValue(Color.convert(hex).toHSVA())}
				max={7}
			/>
			<div class='InputColor-ColorIndicator' style={{ backgroundColor: Color.convert(value).toHex() }}/>
			<Popup z={6} active={pickerActive} defaultAnimation={true}>
				<ColorPicker {...props} value={value} parent={inputRef.current} />
			</Popup>
		</div>
	);
});

export default InputColor;
