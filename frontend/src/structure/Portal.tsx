import * as Preact from 'preact';
import { createPortal } from 'preact/compat';
import { useRef, useEffect } from 'preact/hooks';

export default function Portal(props: { to: HTMLElement; children: Preact.ComponentChildren }) {
	const root = useRef<HTMLDivElement>(document.createElement('div'));

	useEffect(() => {
		props.to.appendChild(root.current);
		return () => props.to.removeChild(root.current);
	}, [ props.to ]);

	return (
		createPortal(
			<Preact.Fragment>{props.children}</Preact.Fragment>,
			root.current
		)
	);
};
