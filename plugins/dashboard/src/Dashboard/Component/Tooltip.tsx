import { ComponentChildren, Fragment, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import Portal from './Portal';

import { tw, merge } from '../Twind';
import { elementBounds } from '../Util';

interface Props {
	label?: string;
	for?: HTMLElement;

	position?: 'top' | 'right' | 'bottom' | 'left';
	offset?: number;
	delay?: number;
	bg?: string;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

const TRANSFORM_ORIGINS = {
	top: '50% 150%',
	right: '-50% 50%',
	bottom: '50% -50%',
	left: '150% 50%',
};

const ARROW_POSITIONS = {
	top: '-bottom-2 left-1/2',
	bottom: 'top-0 left-1/2',
	left: 'top-1/2 -right-2',
	right: 'top-1/2 left-0',
};

export default function Tooltip(props: Props) {
	const elemRef = useRef<HTMLDivElement>(null);
	const outerRef = useRef<HTMLDivElement>(null);

	const [visible, setVisible] = useState<boolean>(false);
	const [position, setPosition] = useState<{ top: number; left: number }>({
		top: 0,
		left: 0,
	});

	useEffect(() => {
		const elem = elemRef.current as HTMLElement;
		if (!elem) return;
		const parent = props.for ?? (outerRef.current?.parentElement as HTMLElement);
		if (!parent) return;

		const offset = props.offset ?? 12;

		const onMouseOver = () => {
			const elemBounds = elementBounds(elem);
			const parentBounds = elementBounds(parent);

			const position = { top: 0, left: 0 };

			if ((props.position ?? 'top') === 'top')
				position.top = parentBounds.top - elemBounds.height - offset;
			else if (props.position === 'bottom')
				position.top = parentBounds.top + parentBounds.height + offset;
			else
				position.top = parentBounds.top + parentBounds.height / 2 - elemBounds.height / 2;

			if (props.position === 'left')
				position.left = parentBounds.left - elemBounds.width - offset;
			else if (props.position === 'right')
				position.left = parentBounds.left + parentBounds.width + offset;
			else
				position.left = parentBounds.left + parentBounds.width / 2 - elemBounds.width / 2;

			setPosition(position);
			setVisible(true);
		};
		const onMouseOut = () => setVisible(false);

		parent.addEventListener('mouseover', onMouseOver);
		parent.addEventListener('mouseout', onMouseOut);

		return () => {
			parent.removeEventListener('mouseover', onMouseOver);
			parent.removeEventListener('mouseout', onMouseOut);
		};
	}, [props.position, props.for, props.offset]);

	return (
		<Fragment>
			<div class={tw`sr-only`} ref={outerRef}>
				{props.label}
			</div>
			<Portal
				to={document.querySelector('.AS_ROOT') ?? document.body}
				class={tw`fixed top-0 left-0 z-50 isolate`}>
				<div
					aria-hidden={true}
					ref={elemRef}
					style={{
						...position,
						...(props.style ?? {}),
						transitionDelay: visible ? `${props.delay}ms` : undefined,
						transformOrigin: TRANSFORM_ORIGINS[props.position ?? 'top'],
					}}
					class={merge(
						tw`
						Tooltip~(absolute transition rounded py-1 px-2.5 font-medium
							bg-${props.bg ?? 'gray-700'} drop-shadow-md whitespace-nowrap)
						after:(w-2 h-2 absolute bg-${props.bg ?? 'gray-700'}
							rotate-45 -translate-x-1/2 -translate-y-1/2
							${ARROW_POSITIONS[props.position ?? 'top']})
						${
							visible
								? 'scale-100 opacity-100 will-change-transform'
								: 'scale-95 opacity-0 interact-none'
						}`,
						props.class
					)}>
					{props.children ?? props.label}
				</div>
			</Portal>
		</Fragment>
	);
}
