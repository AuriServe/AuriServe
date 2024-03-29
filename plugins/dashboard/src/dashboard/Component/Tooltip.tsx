import { ComponentChildren, Fragment, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import Portal from './Portal';

import { tw, merge } from '../Twind';
import { elementBounds } from '../Util';
import { Transition } from './Transition';

interface Props {
	label?: string;
	for?: HTMLElement;

	position?: 'top' | 'right' | 'bottom' | 'left';
	offset?: number;
	delay?: number;
	bg?: string;
	small?: boolean;

	style?: any;
	class?: string;
	children?: ComponentChildren;
}

const TRANSFORM_ORIGINS = {
	top: '50% 150%',
	right: '-50% 50%',
	bottom: '50% -50%',
	left: '50% 50%',
};

const ARROW_POSITIONS = {
	top: '-bottom-2 left-1/2',
	bottom: 'top-0 left-1/2',
	left: 'top-1/2 -right-2',
	right: 'top-1/2 left-0',
};

const TRANSFORM_OFFSETS = {
	top: '-translate-y-full -translate-x-1/2',
	left: '-translate-x-full -translate-y-1/2',
	right: '-translate-y-1/2',
	bottom: '-translate-x-1/2',
};

export default function Tooltip(props: Props) {
	const elemRef = useRef<HTMLDivElement>(null);
	const outerRef = useRef<HTMLDivElement>(null);

	const appearTimeout = useRef<number>(0);

	const [visible, setVisible] = useState<boolean>(false);
	const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

	useEffect(() => {
		const parent = props.for ?? (outerRef.current?.parentElement as HTMLElement);
		if (!parent) return;

		const offset = props.offset ?? 12;

		const onMouseEnter = () => {
			const parentBounds = elementBounds(parent);

			const position = { top: 0, left: 0 };

			if ((props.position ?? 'top') === 'top') position.top = Math.floor(parentBounds.top - offset);
			else if (props.position === 'bottom')
				position.top = Math.floor(parentBounds.top + parentBounds.height + offset);
			else position.top = Math.floor(parentBounds.top + parentBounds.height / 2);

			if (props.position === 'left') position.left = Math.floor(parentBounds.left - offset);
			else if (props.position === 'right')
				position.left = Math.floor(parentBounds.left + parentBounds.width + offset);
			else position.left = Math.floor(parentBounds.left + parentBounds.width / 2);

			setPosition(position);
			if (!appearTimeout.current) appearTimeout.current =
				setTimeout(() => setVisible(true), props.delay) as any as number;
		};

		const onMouseLeave = () => {
			setVisible(false);
			if (appearTimeout.current) clearTimeout(appearTimeout.current);
			appearTimeout.current = 0;
		};

		parent.addEventListener('mouseenter', onMouseEnter);
		parent.addEventListener('mouseleave', onMouseLeave);

		return () => {
			parent.removeEventListener('mouseenter', onMouseEnter);
			parent.removeEventListener('mouseleave', onMouseLeave);
		};
	}, [props.position, props.for, props.offset]);

	return (
		<Fragment>
			<div class={tw`sr-only`} ref={outerRef}>
				{props.label}
			</div>
			{/* This transition renders a portal which renders a div which is our tooltip */}
			<Transition
				show={visible}
				enter={tw`transition duration-75`}
				enterFrom={tw`opacity-0 scale-95`}
				enterTo={tw`opacity-100 scale-100`}
				invertExit
				as={Portal}
				ref={elemRef}
				aria-hidden={true}
				wrapperClass={tw`absolute interact-none`}
				class={merge(
					tw`Tooltip~(absolute transition rounded font-medium will-change-transform whitespace-pre-line text-center
						${props.small ? 'text-sm py-1 px-2 text-gray-100' : 'py-1 px-2.5'}
						bg-${props.bg ?? 'gray-700'}) drop-shadow-md w-max)
						after:(w-2 h-2 absolute bg-${props.bg ?? 'gray-700'}
							rotate-45 -translate-x-1/2 -translate-y-1/2
							${ARROW_POSITIONS[props.position ?? 'top']})
						${TRANSFORM_OFFSETS[props.position ?? 'top']}`,
					props.class
				)}
				style={{
					...position,
					...(props.style ?? {}),
					transformOrigin: TRANSFORM_ORIGINS[props.position ?? 'top'],
				}}>
				{props.children ?? props.label}
			</Transition>
		</Fragment>
	);
}
