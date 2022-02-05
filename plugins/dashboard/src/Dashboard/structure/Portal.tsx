import { useRef, useEffect } from 'preact/hooks';
import { createPortal, forwardRef } from 'preact/compat';
import { h, Fragment, ComponentChildren, RefObject } from 'preact';

import { tw } from '../twind';

interface Props {
	to: HTMLElement;
	class?: string;
	children?: ComponentChildren;
}

export default forwardRef<HTMLDivElement, Props>(function Portal(
	props: Props,
	ref: RefObject<HTMLDivElement>
) {
	const root = useRef<HTMLDivElement>(document.createElement('div'));

	if (ref) ref.current = root.current;

	useEffect(() => {
		root.current.className = props.class ?? tw`fixed`;
	}, [props.class]);

	useEffect(() => {
		const elem = root.current;
		props.to.appendChild(elem);
		return () => props.to.removeChild(elem);
	}, [props.to]);

	return createPortal(<Fragment>{props.children}</Fragment>, root.current);
});
