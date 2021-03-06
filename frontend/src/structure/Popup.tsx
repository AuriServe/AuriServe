import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { CSSTransition } from 'preact-transitioning';

import Portal from './Portal';

import { mergeClasses } from 'common/util';

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
		<Portal class='absolute' ref={fRef} to={document.querySelector('.AS_ROOT') ?? document.body}>
			<CSSTransition in={props.active} duration={props.duration ?? 150} classNames='Animate'>
				<div style={{ zIndex: props.z ?? 100 }}
					className={mergeClasses('fixed flex w-full h-full inset-0 pointer-events-none',
						props.defaultAnimation && style.DefaultAnimation)}>
					{props.children}
				</div>
			</CSSTransition>
		</Portal>
	);
});

export default Popup;
