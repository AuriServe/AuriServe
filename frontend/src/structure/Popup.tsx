import { forwardRef } from 'preact/compat';
import { h, ComponentChildren } from 'preact';

import Portal from './Portal';
import { Transition } from '../Transition';

interface Props {
	active: boolean;
	duration?: number;

	z?: number;

	class?: string;
	children: ComponentChildren;
}

const Popup = forwardRef<HTMLDivElement, Props>((props, fRef) => {
	return (
		<Portal class='absolute' ref={fRef} to={document.querySelector('.AS_ROOT') ?? document.body}>
			<Transition show={props.active} duration={75} invertExit class='transition duration-75'
				enter='will-change-transform' enterFrom='opacity-0 scale-95' enterTo='opacity-100 scale-100'>
				<div style={{ zIndex: props.z ?? 100 }}
					className='fixed flex w-full h-full inset-0 pointer-events-none'>
					{props.children}
				</div>
			</Transition>
		</Portal>
	);
});

export default Popup;
