import { h, ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';

import Card from '../Card';
import Portal from './Portal';

import { merge } from 'common/util';

import style from './DefaultAnimation.sss';
import { Transition } from '../Transition';

interface Props {
	active: boolean;
	defaultAnimation?: boolean;

	z?: number;

	onClose?: (_: MouseEvent) => void;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default function Modal(props: Props) {
	useEffect(() => {
		const body = document.documentElement;
		const root = document.querySelector('.AS_ROOT') as HTMLElement;
		if (!body || !root || !props.active) return;
		body.style.overflow = 'hidden';
		root.style.paddingRight = '14px';
		return () => {
			body.style.overflow = '';
			root.style.paddingRight = '';
		};
	}, [ props.active ]);

	return (
		<Portal class='absolute' to={document.querySelector('.AS_ROOT') ?? document.body}>
			<Transition show={props.active} duration={150} class='transition duration-150'
				enterFrom='opacity-0' enterTo='opacity-100' invertExit>
				<div style={{ zIndex: props.z ?? 100 }} onClick={props.onClose}
					className={merge('fixed flex flex-col w-[calc(100%-56px)] h-full items-center overflow-auto top-0 left-0 ml-14',
						'justify-around bg-neutral-50/80 dark:bg-neutral-900/80',
						props.defaultAnimation && style.DefaultAnimation)}>
					<div class='flex w-full h-auto px-3 py-12 overflow-auto justify-around'>
						<Card class={merge('h-min', props.class)} style={props.style}
							onClick={(e: any) => e.stopPropagation()}>{props.children}</Card>
					</div>
				</div>
			</Transition>
		</Portal>
	);
}
