import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { CSSTransition } from 'preact-transitioning';

import Portal from './Portal';

import { mergeClasses } from '../Util';

import style from './DefaultAnimation.sss';

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
		<Portal to={document.querySelector('.AS_ROOT') ?? document.body}>
			<div ref={fRef}>
				<CSSTransition in={props.active} duration={props.duration ?? 150} classNames='Animate'>
					<div style={{ zIndex: props.z ?? 30 }}
						class={mergeClasses('fixed flex w-full h-full inset-0 pointer-events-none',
							props.defaultAnimation && style.DefaultAnimation)}>
						{props.children}
					</div>
				</CSSTransition>
			</div>
		</Portal>
	);
});

export default Popup;
