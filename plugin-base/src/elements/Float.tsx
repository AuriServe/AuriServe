import { h, ComponentChildren } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ServerDefinition, ClientDefinition } from 'common/definition';

import { withHydration, Static } from '../Hydration';
import { mergeClasses } from 'common/util';

export interface Props {
	target?: string;
	threshold?: number;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

/**
 * Renders a container that has a class applied to it when the page is scrolled.
 * Can be used to allow for floating headers.
 */

export function Float(props: Props) {
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
		<div class={mergeClasses('Float', floating && 'Floating', props.class)}>
			<Static class='Float-Contents'>{props.children}</Static>
		</div>
	);
}

export const HydratedFloat = withHydration('Float', Float);

export const server: ServerDefinition = { identifier: 'Float', element: HydratedFloat };

export const client: ClientDefinition = { identifier: 'Float', element: Float };

