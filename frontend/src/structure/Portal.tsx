import { h, Fragment, ComponentChildren, RefObject } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { createPortal, forwardRef } from 'preact/compat';

interface Props {
	to: HTMLElement;
	class?: string;
	children?: ComponentChildren;
}

export default forwardRef<HTMLDivElement, Props>(function Portal(props: Props, ref: RefObject<HTMLDivElement>) {
	const root = useRef<HTMLDivElement>(document.createElement('div'));

	if (ref) ref.current = root.current;

	useEffect(() => {
		root.current.className = props.class ?? '';
	}, [ props.class ]);

	useEffect(() => {
		props.to.appendChild(root.current);
		return () => props.to.removeChild(root.current);
	}, [ props.to ]);

	return (
		createPortal(
			<Fragment>{props.children}</Fragment>,
			root.current
		)
	);
});
