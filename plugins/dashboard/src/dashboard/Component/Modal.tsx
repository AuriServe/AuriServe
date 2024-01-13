import { h, ComponentChildren, Fragment } from 'preact';

import Card from './Card';
import Button from './Button';
import * as Icon from '../Icon';
import { Dialog, Transition } from '@headlessui/react';

import { tw, merge } from '../Twind';

interface Props {
	active: boolean;

	z?: number;

	onClose?: () => void;

	style?: any;
	class?: string;
	children?: ComponentChildren | ((open: boolean) => ComponentChildren);
}

export default function Modal(props: Props) {
	return (
		<Transition
			as={Fragment}
			show={props.active}
			appear={true}
		>
			<Dialog
				onClose={() => props.onClose?.()}
				class={tw`fixed inset-0 w-screen h-screen max-w-[100vw] max-h-screen p-0 m-0
					pl-14 flex overflow-hidden items-center interact-auto z-[${props.z || 100}]`}
			>
				<Transition.Child as={Fragment}
					enter={tw`transition duration-150`} enterFrom={tw`opacity-0`} leaveTo={tw`opacity-0`}
					enterTo={tw`opacity-100`} leaveFrom={tw`opacity-100`} leave={tw`transition duration-150`}>
					<div class={tw`fixed top-0 left-0 transition duration-150 w-14 h-full
						opacity-${props.active ? 100 : 0} bg-gray-900/60`}/>
				</Transition.Child>

				<Transition.Child as={Fragment}
					enter={tw`transition duration-150`} enterFrom={tw`opacity-0`} leaveTo={tw`opacity-0`}
					enterTo={tw`opacity-100`} leaveFrom={tw`opacity-100`} leave={tw`transition duration-150`}>
					<div class={tw`fixed inset-0 inset-0 left-14 transition duration-150 h-full
						opacity-${props.active ? 100 : 0}	grow bg-gray-50/80
						dark:bg-[#081024cc] backdrop-filter backdrop-blur-md`}/>
				</Transition.Child>

				{props.onClose && <Transition.Child as={Fragment}
					enter={tw`transition duration-150`} enterFrom={tw`opacity-0`} leaveTo={tw`opacity-0`}
					enterTo={tw`opacity-30`} leaveFrom={tw`opacity-30`} leave={tw`transition duration-150`}>
					<Button.Ghost class={tw`absolute top-3 right-3`} size={9} icon={Icon.close} iconOnly label='Close'/>
				</Transition.Child>}

				<div class={tw`w-full h-max max-h-full overflow-y-auto will-change-transform flex justify-center p-12`}>
					<Transition.Child
						as={Dialog.Panel}
						enter={merge(tw`transition duration-150`)}
						enterFrom={tw`scale-[98%] opacity-0`}
						enterTo={tw`scale-100 opacity-100`}
						leave={merge(tw`transition duration-150`)}
						leaveFrom={tw`scale-100 opacity-100`}
						leaveTo={tw`scale-[98%] opacity-0`}
						class={tw`w-max h-max shrink-0 text-gray-(800 dark:100)
						icon-p-gray-(500 dark:100) icon-s-gray-(400 dark:300)`}
					>
						{(open: boolean) => (
							<Card
								class={merge(tw``, props.class)}
								style={props.style}
							>
								{props.children instanceof Function ? props.children(open) : props.children}
							</Card>
						)}
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}
