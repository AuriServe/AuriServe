import { h, ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import Card from '../Card';
import Portal from './Portal';
import { Transition } from '../Transition';

import { merge } from 'common/util';

interface Props {
	active: boolean;

	z?: number;

	onClose?: (_: MouseEvent) => void;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default function Modal(props: Props) {
	const overflowTimeoutRef = useRef<number>(0);
	useEffect(() => {

		const body = document.documentElement;
		const root = document.querySelector('.AS_ROOT') as HTMLElement;
		if (!body || !root || !props.active) return;

		if (overflowTimeoutRef.current) clearTimeout(overflowTimeoutRef.current);
		body.style.overflow = 'hidden';
		root.style.paddingRight = '14px';

		return () => {
			if (overflowTimeoutRef.current) clearTimeout(overflowTimeoutRef.current);
			overflowTimeoutRef.current = setTimeout(() => {
				body.style.overflow = '';
				root.style.paddingRight = '';
			}, 150) as any as number;
		};
	}, [ props.active ]);

	return (
		<Portal class='absolute' to={document.querySelector('.AS_ROOT') ?? document.body}>
			<Transition as='div' show={props.active} duration={150} invertExit
				class='fixed flex flex-col w-[calc(100%-56px)] h-full items-center overflow-auto
					top-0 left-0 ml-14 justify-around bg-neutral-50/80 dark:bg-[#081024]/80 backdrop-blur-md'
				style={{ zIndex: props.z ?? 100 }} onClick={props.onClose}
				enter='will-change-transform transition duration-150' enterFrom='opacity-0' enterTo='opacity-100'>
				<div class='flex w-full h-auto px-3 py-12 overflow-auto justify-around'>
					{/** TODO: Make a TransitionChild component to make nested transitions like this work without jank. */}
					<Transition show={props.active} initial duration={150} invertExit
						enter='transition duration-150' enterFrom='scale-[98%]' enterTo='scale-100'>
						<Card class={merge('h-min will-change-transform', props.class)} style={props.style}
							onClick={(e: any) => e.stopPropagation()}>{props.children}</Card>
					</Transition>
				</div>
			</Transition>
		</Portal>
	);
}
