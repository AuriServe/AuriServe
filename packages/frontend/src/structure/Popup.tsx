import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { CSSTransition } from 'preact-transitioning';

import './Popup.sass';

import Portal from './Portal';

interface Props {
	active: boolean;
	duration?: number;
	defaultAnimation?: boolean;

	z?: number;

	class?: string;
	children: Preact.ComponentChildren;
}

const Popup = forwardRef<HTMLDivElement, Props>((props, fRef) => {
	return (
		<Portal to={document.querySelector('.App') ?? document.body}>
			<div ref={fRef}>
				<CSSTransition in={props.active} duration={props.duration ?? 150} classNames='Animate'>
					<div class={('Popup ' + (props.class ?? '') + (props.defaultAnimation ? ' DefaultAnim' : '')).trim()}
						style={{zIndex: props.z ?? 5}}>
						{props.children}
					</div>
				</CSSTransition>
			</div>
		</Portal>
	);
});

export default Popup;
