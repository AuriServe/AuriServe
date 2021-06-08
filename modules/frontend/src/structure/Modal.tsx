import * as Preact from 'preact';
// import { useEffect } from 'preact/hooks';
import { CSSTransition } from 'preact-transitioning';

import Card from './Card';
import Portal from './Portal';

import { mergeClasses } from '../Util';

import style from './DefaultAnimation.sss';

interface Props {
	active: boolean;
	duration?: number;
	defaultAnimation?: boolean;

	z?: number;

	onClose?: (_: MouseEvent) => void;

	style?: any;
	class?: string;
	children?: Preact.ComponentChildren;
}

export default function Modal(props: Props) {
	// useEffect(() => {
	// 	const body = document.documentElement;
	// 	if (!body || !props.active) return;
	// 	body.style.overflow = 'hidden';
	// 	return () => body.style.overflow = '';
	// }, [ props.active ]);

	return (
		<Portal to={document.querySelector('.AS_ROOT') ?? document.body}>
			<CSSTransition in={props.active} duration={props.duration ?? 150} classNames='Animate'>
				<div style={{ zIndex: props.z ?? 20 }} onClick={props.onClose}
					class={mergeClasses('fixed flex w-full h-full inset-0 ml-14 place-items-center bg-gray-900/90 dark:bg-gray-200/90',
						props.defaultAnimation && style.DefaultAnimation)}>
					<div class='flex w-full h-auto overflow-auto px-3 py-16 justify-around'>
						<Card class='h-min !shadow-md' onClick={(e: any) => e.stopPropagation()}>{props.children}</Card>
					</div>
				</div>
			</CSSTransition>
		</Portal>
	);
}
