import * as Preact from 'preact';
import { useEffect } from 'preact/hooks';
import { CSSTransition } from 'preact-transitioning';

import Card from './Card';
import Portal from './Portal';

import { mergeClasses } from 'common/util';

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
	useEffect(() => {
		const body = document.documentElement;
		const root = document.querySelector('.AS_ROOT') as HTMLElement;
		if (!body || !root || !props.active) return;
		body.style.overflow = 'hidden';
		root.style.paddingRight = '8px';
		return () => {
			body.style.overflow = '';
			root.style.paddingRight = '';
		};
	}, [ props.active ]);

	return (
		<Portal class='absolute' to={document.querySelector('.AS_ROOT') ?? document.body}>
			<CSSTransition in={props.active} duration={props.duration ?? 150} classNames='Animate'>
				<div style={{ zIndex: props.z ?? 100 }} onClick={props.onClose}
					className={mergeClasses('fixed flex flex-col w-[calc(100%-56px)] h-full items-center overflow-auto top-0 left-0 ml-14',
						'justify-around bg-gray-900/80 dark:bg-gray-200/90 ',
						props.defaultAnimation && style.DefaultAnimation)}>
					<div class='flex w-full h-auto px-3 py-12 overflow-auto justify-around'>
						<Card class='h-min !shadow-md' onClick={(e: any) => e.stopPropagation()}>{props.children}</Card>
					</div>
				</div>
			</CSSTransition>
		</Portal>
	);
}
