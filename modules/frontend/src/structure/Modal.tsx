import * as Preact from 'preact';
import { CSSTransition } from 'preact-transitioning';

import './Modal.sass';

import Portal from './Portal';

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
	return (
		<Portal to={document.querySelector('.App') ?? document.body}>
			<CSSTransition in={props.active} duration={props.duration ?? 150} classNames='Animate'>
				<div class={('Modal ' + (props.active ? 'Active ' : '') + (props.class ?? '') + ' ' + (props.defaultAnimation ?
					'DefaultAnim ' : '') + (props.onClose ? 'Closes ' : '')).trim()} style={{ zIndex: props.z ?? 5 }} onClick={props.onClose}>
					<div class='Modal-CardWrap'>
						<div class='Modal-Card' onClick={e => e.stopPropagation()}>
							{props.children}
						</div>
					</div>
				</div>
			</CSSTransition>
		</Portal>
	);
}
