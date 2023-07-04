import { h, ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import Card from './Card';
import Portal from './Portal';
import { Transition } from './Transition';

import { tw, merge } from '../Twind';

interface Props {
	active: boolean;

	z?: number;

	onClose?: (_: MouseEvent | KeyboardEvent) => void;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

export default function Modal(props: Props) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const closeTimeoutRef = useRef<number>(0);
	const overflowTimeoutRef = useRef<number>(0);

	useEffect(() => {
		if (props.active && dialogRef) {
			if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = 0;
			dialogRef.current?.showModal();
			// requestAnimationFrame(() => {
			// 	const elem = (document.activeElement as HTMLElement);
			// 	elem?.blur();
			// 	elem?.focus({ focusVisible: true } as any);
			// });
		}
		else if (!props.active && dialogRef) {
			if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = setTimeout(() => dialogRef.current?.close(), 150) as any as number;
		}
		else {
			console.warn('invalid state', props.active, dialogRef);
		}
	}, [ props.active ]);

	useEffect(() => {
		const root = document.documentElement;
		const app = document.body.children[0] as HTMLElement;

		if (!root || !app || !props.active) return undefined;

		if (document.documentElement.classList?.contains('custom_scroll')) {
			if (overflowTimeoutRef.current) clearTimeout(overflowTimeoutRef.current);
			root.style.overflow = 'hidden';
			app.style.paddingRight = '14px';

			return () => {
				if (overflowTimeoutRef.current) clearTimeout(overflowTimeoutRef.current);
				overflowTimeoutRef.current = setTimeout(() => {
					root.style.overflow = '';
					app.style.paddingRight = '';
				}, 150) as any as number;
			};
		}
	}, [ props.active ]);

	const { onClose } = props;

	useEffect(() => {
		if (!onClose || !props.active) return;

		function handleKeyPress(evt: KeyboardEvent) {
			if (evt.key === 'Escape') {
				onClose?.(evt);
			}
		}

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [ onClose, props.active ]);

	return (
		<Portal as='dialog' ref={dialogRef} z={props.z || 100} onClick={onClose}
			class={tw`fixed inset-0 w-screen h-screen max-w-none max-h-screen p-0 m-0
				pl-14 flex-(& col) items-center overflow-auto justify-around
				bg-transparent interact-none backdrop:bg-transparent text-gray-(800 dark:100)`}>
			<div class={tw`w-screen h-screen interact-none absolute inset-0 flex`}>
				<div class={tw`opacity-${props.active ? 100 : 0} transition duration-150 w-14 h-full bg-gray-900/60`}/>
				<div class={tw`opacity-${props.active ? 100 : 0} transition duration-150
					grow h-full bg-gray-50/80 dark:bg-[#081024cc] backdrop-filter backdrop-blur-md`}/>
			</div>
			<div class={tw`flex w-full h-auto px-3 py-12 overflow-auto justify-around relative z-10`}>
				{/** TODO: Make a TransitionChild component to make nested transitions like this work without jank. */}
				<Transition
					show={props.active}
					initial
					duration={150}
					invertExit
					enter={tw`transition duration-150`}
					enterFrom={tw`scale-[98%] opacity-0`}
					enterTo={tw`scale-100 opacity-100`}>
					<Card
						class={merge(tw`h-min will-change-transform interact-auto`, props.class)}
						style={props.style}
						onClick={(e: any) => e.stopPropagation()}>
						{props.children}
					</Card>
				</Transition>
			</div>
		</Portal>
	);
}
