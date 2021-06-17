import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ServerDefinition, ClientDefinition, AdminDefinition } from 'auriserve-api';

import { withHydration, Static } from '../Hydration';

interface Props {
	threshold?: number;
	target?: string;

	class?: string;
	children?: Preact.VNode[];
}

/**
 * Renders a container that has a class applied to it when the page is scrolled.
 * Can be used to allow for floating headers.
 */

function Float(props: Props) {
	const [ floating, setFloating ] = useState<boolean>(false);

	useEffect(() => {
		const elem = document.querySelector(props.target ?? 'html');
		if (!elem) return;
		let eventTarget = ((props.target ?? 'html') === 'html' ? document : elem)!;

		let scrolled = true;

		const markScroll = () => scrolled = true;
		
		const onScroll = () => {
			if (!scrolled) return;
			setFloating(elem.scrollTop > (props.threshold ?? 32));
			scrolled = false;
		};
		
		const interval = setInterval(onScroll, 50);
		onScroll();

		eventTarget.addEventListener('scroll', markScroll, { passive: true });

		return () => {
			window.clearInterval(interval);
			eventTarget.removeEventListener('scroll', markScroll);
		};
	}, [ props.target, props.threshold ]);

	return (
		<div class={[ 'Float', floating && 'Floating', props.class ].filter(s => s).join(' ')}>
			<Static class='Float-Contents'>{props.children}</Static>
		</div>
	);
}

const HydratedFloat = withHydration('Float', Float);

export const server: ServerDefinition = {
	identifier: 'Float',
	element: HydratedFloat,
	config: {
		props: {
			threshold: { type: 'number', default: 32 },
			target: { type: 'text', default: 'html' }
		}
	}
};

export const client: ClientDefinition = {
	identifier: 'Float',
	element: Float
};

export const admin: AdminDefinition = {
	...server,
	...client
};

