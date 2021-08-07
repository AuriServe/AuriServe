import { usePopupCancel } from '../Hooks';
import { h, ComponentChildren } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

import Card, { Props as CardProps } from './Card';
import Button, { Props as ButtonProps } from './Button';

import { mergeClasses } from 'common/util';

import Popup from './Popup';

interface Props {
	button?: ButtonProps;
	dropdown?: CardProps;

	class?: string;
	children?: ComponentChildren;
}

export default function Dropdown(props: Props) {
	const buttonRef = useRef<HTMLElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [ style, setStyle ] = useState<any>({});
	const [ dropdownActive, setDropdownActive ] = useState<boolean>(false);

	usePopupCancel([ buttonRef, dropdownRef ], () => setDropdownActive(false));

	useEffect(() => {
		const style: any = {};
		if (buttonRef.current && dropdownRef.current) {
			style.top = buttonRef.current.getBoundingClientRect().bottom + 12 + 'px';
			style.left = buttonRef.current.getBoundingClientRect().left + buttonRef.current.getBoundingClientRect().width / 2 -
				dropdownRef.current.getBoundingClientRect().width / 2 + 'px';
		}
		setStyle(style);
	}, [ dropdownActive ]);


	return (
		<Button ref={buttonRef} {...props.button} onClick={() => setDropdownActive(!dropdownActive)}>
			<Popup defaultAnimation={true} active={dropdownActive} ref={dropdownRef}>
				<Card ref={dropdownRef} {...props.dropdown} style={style}
					class={mergeClasses('fixed !p-3 my-0 pointer-events-auto !shadow-lg', props.class)}>
					{props.children}
				</Card>
			</Popup>
		</Button>
	);
}
