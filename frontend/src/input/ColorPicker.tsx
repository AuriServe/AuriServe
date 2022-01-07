/* eslint-disable */

import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useEffect, useRef } from 'preact/hooks';

import { merge, to, HSVA } from 'common';

import style from './ColorPicker.sss';

interface Props {
	value: HSVA;
	onValue?: (color: HSVA) => void;

	parent?: HTMLElement;

	writable?: boolean;
	displayHex?: boolean;
}

export default forwardRef<HTMLDivElement, Props>(function ColorPicker(props, ref) {
	const color: HSVA = to(props.value, 'hsva');

	const mouseTarget = useRef<string>('');
	const satValElem = useRef<HTMLDivElement>(null);
	const hueElem = useRef<HTMLDivElement>(null);

	const inputHex = (evt: any) => {
		const val = evt.target.value;
		if (val.length !== 7) return;
		props.onValue?.(to(val, 'hsva'));
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
			default:
				return;
			case 'hue':
				return handleHueMove(evt);
			case 'satval':
				return handleSatValMove(evt);
		}
	};

	const handleMouseClick = (evt: MouseEvent, target: string) => {
		evt.stopImmediatePropagation();
		evt.preventDefault();

		mouseTarget.current = target;
		handleMouseMove(evt);
	};

	useEffect(() => {
		const clearMouse = () => (mouseTarget.current = '');
		document.body.addEventListener('mouseup', clearMouse);
		document.body.addEventListener('mousemove', handleMouseMove);
		return () => {
			document.body.removeEventListener('mouseup', clearMouse);
			document.body.removeEventListener('mousemove', handleMouseMove);
		};
	}, [handleMouseMove]);

	const hueHex = to({ h: color.h, s: 1, v: 1, a: 1 }, 'hex');
	const fullHex = to({ ...color, a: 1 }, 'hex');

	const position: any = {};
	if (props.parent) {
		position.top = props.parent.getBoundingClientRect().bottom + 'px';
		position.left =
			(props.parent.getBoundingClientRect().left + props.parent.getBoundingClientRect().right) / 2 - 144 + 'px';
	}

	return (
		<div
			class={merge('w-72 h-48 mt-2 select-none flex flex-col pointer-events-auto', props.parent && 'absolute')}
			ref={ref}
			style={position}>
			<div
				class={merge(style.SatVal, 'relative flex-grow cursor-pointer')}
				ref={satValElem}
				onMouseDown={(evt) => handleMouseClick(evt, 'satval')}
				style={{ backgroundColor: hueHex }}>
				{props.displayHex && <p class=''>{fullHex}</p>}

				<div
					class={style.Indicator}
					style={{ left: color.s * 100 + '%', top: (1 - color.v) * 100 + '%', backgroundColor: fullHex }}
				/>
			</div>
			<div class='h-2 bg-black' />
			<div
				class={merge(style.Hue, 'relative h-6 cursor-pointer')}
				ref={hueElem}
				onMouseDown={(evt) => handleMouseClick(evt, 'hue')}>
				<div class={merge(style.Indicator, 'top-1/2')} style={{ left: color.h * 100 + '%', backgroundColor: hueHex }} />
			</div>
			{props.writable && (
				<div class='ColorPicker-Details'>
					<div class='ColorPicker-ColorBlock' style={{ backgroundColor: fullHex }} />
					<input class='ColorPicker-ColorInput' value={fullHex} onChange={inputHex} onInput={inputHex} maxLength={7} />
				</div>
			)}
		</div>
	);
});
