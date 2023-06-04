import { h, ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import Card from './Card';
import Portal from './Portal';
import { Transition } from './Transition';
import useTrapFocus from './useTrapFocus';

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
	const trapRef = useTrapFocus();
	const overflowTimeoutRef = useRef<number>(0);

	useEffect(() => {
		const root = document.documentElement;
		const app = document.body.children[0] as HTMLElement;

		if (!root || !app || !props.active) return undefined;

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
	}, [ props.active ]);

	const { onClose } = props;

	useEffect(() => {
		if (!onClose) return;

		function handleKeyPress(evt: KeyboardEvent) {
			if (evt.key === 'Escape') {
				onClose?.(evt);
			}
		}

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [ onClose ]);

	return (
		<Portal
			z={props.z || 100}
			onClick={onClose}>
			<Transition show={props.active} duration={150} invertExit
				class={tw`fixed h-full ml-14 flex-(& col) !w-[calc(100%-56px)] h-full items-center overflow-auto
					justify-around bg-gray-50/80 dark:bg-[#081024cc] backdrop-filter backdrop-blur-md`}
				enter={tw`will-change-transform transition duration-150`}
				enterFrom={tw`opacity-0`}
				enterTo={tw`opacity-100`}>
				<div class={tw`flex w-full h-auto px-3 py-12 overflow-auto justify-around`}>
					{/** TODO: Make a TransitionChild component to make nested transitions like this work without jank. */}
					<Transition
						show={props.active}
						initial
						duration={150}
						invertExit
						enter={tw`transition duration-150`}
						enterFrom={tw`scale-[98%]`}
						enterTo={tw`scale-100`}>
						<Card
							ref={trapRef}
							class={merge(tw`h-min will-change-transform`, props.class)}
							style={props.style}
							onClick={(e: any) => e.stopPropagation()}>
							{props.children}
						</Card>
					</Transition>
				</div>
				</Transition>
		</Portal>
	);
}
