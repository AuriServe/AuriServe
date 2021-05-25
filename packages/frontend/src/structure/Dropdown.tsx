import * as Preact from 'preact';
import { usePopupCancel } from '../Hooks';
import { useState, useRef } from 'preact/hooks';

import './Dropdown.sass';

import Popup from './Popup';

interface Props {
	class?: string;
	children?: Preact.ComponentChildren;
	
	buttonClass?: string;
	buttonChildren?: Preact.ComponentChildren;
}

export default function Dropdown(props: Props) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [ dropdownActive, setDropdownActive ] = useState<boolean>(false);

	usePopupCancel([ buttonRef, dropdownRef ], () => setDropdownActive(false));

	const style: any = {};
	if (buttonRef.current && dropdownRef.current) {
		style.top = buttonRef.current.getBoundingClientRect().bottom + 'px';
		style.left = buttonRef.current.getBoundingClientRect().left + buttonRef.current.getBoundingClientRect().width / 2 + 'px';
	}

	return (
		<Preact.Fragment>
			<button ref={buttonRef}
				onClick={() => setDropdownActive(!dropdownActive)}
				class={('DropdownButton ' + (props.buttonClass ?? '')).trim()}>
				{props.buttonChildren}
			</button>

			<Popup class={('Dropdown ' + (props.class ?? '')).trim()} defaultAnimation={true}
				active={dropdownActive} ref={dropdownRef}>
				<div class='Dropdown-Card' ref={dropdownRef} style={style}>
					{props.children}
				</div>
			</Popup>
		</Preact.Fragment>
	);
}
