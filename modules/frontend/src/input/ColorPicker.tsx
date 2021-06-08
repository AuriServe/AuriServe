import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { useEffect, useRef } from 'preact/hooks';

import { Color } from 'common';

import './ColorPicker.sass';

interface Props {
	value: Color.HSVA;
	onValue?: (color: Color.HSVA) => void;

	parent?: HTMLElement;
	
	writable?: boolean;
	displayHex?: boolean;
}

export default forwardRef<HTMLDivElement, Props>(function ColorPicker(props, ref) {
	const color: Color.HSVA = Color.convert(props.value).toHSVA() as any;

	const mouseTarget = useRef<string>('');
	const satValElem = useRef<HTMLDivElement>(null);
	const hueElem = useRef<HTMLDivElement>(null);

	const inputHex = (evt: any) => {
		const val = evt.target.value;
		if (val.length !== 7) return;
		props.onValue?.(Color.convert(val).toHSVA());
	};

	const handleHueMove = (evt: MouseEvent) => {
		const bounds = hueElem.current.getBoundingClientRect();
		const h = Math.max(Math.min((evt.clientX - bounds.left) / bounds.width, 1), 0);
		props.onValue?.({ ...color, h });
	};

	const handleSatValMove = (evt: MouseEvent) => {
		const bounds = satValElem.current.getBoundingClientRect();
		const sat = Math.max(Math.min((evt.clientX - bounds.left) / bounds.width, 1), 0);
		const val = Math.max(Math.min((bounds.bottom - evt.clientY) / bounds.height, 1), 0);
		props.onValue?.({ ...color, s: sat, v: val });
	};

	const handleMouseMove = (evt: MouseEvent) => {
		switch (mouseTarget.current) {
		default: return;
		case 'hue': return handleHueMove(evt);
		case 'satval': return handleSatValMove(evt);
		}
	};

	const handleMouseClick = (evt: MouseEvent, target: string) => {
		evt.stopImmediatePropagation();
		evt.preventDefault();

		mouseTarget.current = target;
		handleMouseMove(evt);
	};

	useEffect(() => {
		const clearMouse = () => mouseTarget.current = '';
		document.body.addEventListener('mouseup', clearMouse);
		document.body.addEventListener('mousemove', handleMouseMove);
		return () => {
			document.body.removeEventListener('mouseup', clearMouse);
			document.body.removeEventListener('mousemove', handleMouseMove);
		};
	}, [ handleMouseMove ]);

	const hueHex = Color.convert({ h: color.h, s: 1, v: 1, a: 1 }).toHex();
	const fullHex = Color.convert({ ...color, a: 1 }).toHex();

	const style: any = {};
	if (props.parent) {
		style.top = props.parent.getBoundingClientRect().bottom + 'px';
		style.left = ((props.parent.getBoundingClientRect().left +
			props.parent.getBoundingClientRect().right) / 2) + 'px';
	}

	return (
		<div class={('ColorPicker ' + (props.writable ? 'Write ' : '' + (props.parent ? 'Absolute' : ''))).trim()}
			ref={ref} style={style}>
			
			<div class='ColorPicker-SatVal' ref={satValElem}
				onMouseDown={(evt) => handleMouseClick(evt, 'satval')}
				style={{ backgroundColor: hueHex }}>

				{props.displayHex && <p class='ColorPicker-Hex'>{fullHex}</p>}

				<div class='ColorPicker-Indicator' style={{ left: (color.s * 100) + '%',
					top: ((1 - color.v) * 100) + '%', backgroundColor: fullHex }} />

			</div>
			<div class='ColorPicker-Separator' />
			<div class='ColorPicker-Hue' ref={hueElem}
				onMouseDown={(evt) => handleMouseClick(evt, 'hue')}>
				<div class='ColorPicker-Indicator' style={{ left: (color.h * 100) + '%', backgroundColor: hueHex }} />
			</div>
			{props.writable && <div class='ColorPicker-Details'>
				<div class='ColorPicker-ColorBlock' style={{ backgroundColor: fullHex }} />
				<input class='ColorPicker-ColorInput' value={fullHex} onChange={inputHex} onInput={inputHex} maxLength={7} />
			</div>}
		</div>
	);
});
