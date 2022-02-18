import { Node } from 'pages';
import { assert } from 'common';
import { h, createContext } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { tw, elementBounds, TransitionGroup } from 'dashboard';

import ElementMenu from './ElementMenu';

import { Text } from './mock/Text';
import { Stack } from './mock/Stack';

export interface ElementContextData {
	path: string;
	setProps(props: any): void;
}

export const ElementContext = createContext<ElementContextData>(null as any);

export interface Props {
	node: Node;
	path: string;
}

type WHBox = { top: number; left: number; width: number; height: number };
type PBox = { top: number; left: number; bottom: number; right: number };

function getBoundingBox(wrapper: HTMLElement): WHBox {
	const elemBounds = (Array.from(wrapper.children) as HTMLElement[])
		.map((elem) => elementBounds(elem))
		.map(({ top, left, width, height }) => ({
			top,
			left,
			bottom: top + height,
			right: left + width,
		}));

	const bound = elemBounds.reduce<PBox>(
		(bound, { top, bottom, left, right }) => ({
			top: Math.min(bound.top, top),
			bottom: Math.max(bound.bottom, bottom),
			left: Math.min(bound.left, left),
			right: Math.max(bound.right, right),
		}),
		{
			top: Infinity,
			left: Infinity,
			bottom: -Infinity,
			right: -Infinity,
		}
	);

	return {
		top: bound.top,
		left: bound.left,
		width: bound.right - bound.left,
		height: bound.bottom - bound.top,
	};
}

interface InteractState {
	bounds: WHBox;
	clickPos: { top: number; left: number };
}

export default function Element({ node, path }: Props) {
	assert('element' in node, 'Not a component node');
	assert(node.element === 'Stack' || node.element === 'Text', 'Not a supported element');

	const ctx = {
		path,
		setProps: (props: any) => console.warn(props),
	};

	const wrapperRef = useRef<HTMLDivElement>(null);

	const Elem = node.element === 'Stack' ? Stack : Text;

	const [intState, setIntState] = useState<InteractState | null>(null);

	const handleInteract = (evt: MouseEvent) => {
		evt.preventDefault();
		evt.stopPropagation();

		setIntState({
			bounds: getBoundingBox(wrapperRef.current as HTMLElement),
			clickPos: {
				top: evt.clientY + window.scrollY,
				left: evt.clientX + window.scrollX,
			},
		});
	};

	const handleInteractEnd = () => {
		setIntState(null);
	};

	return (
		<ElementContext.Provider value={ctx}>
			<div class={tw`contents`} ref={wrapperRef} onContextMenu={handleInteract}>
				<Elem {...(node.props as any)}>
					{(node.children ?? []).map((child, i) => (
						<Element key={i} node={child} path={`${path}.children[${i}]`} />
					))}
				</Elem>
			</div>
			<ElementMenu
				path={path}
				onClose={handleInteractEnd}
				position={intState?.clickPos}
			/>
			<TransitionGroup
				duration={150}
				enterFrom={tw`opacity-0 scale-[99.5%]`}
				enter={tw`transition duration-150`}
				invertExit>
				{intState && (
					<div
						key={'a'}
						class={tw`absolute border-(2 accent-400) ring-(& accent-500/25) rounded-lg`}
						style={{
							top: intState.bounds.top - 8,
							left: intState.bounds.left - 8,
							width: intState.bounds.width + 16,
							height: intState.bounds.height + 16,
						}}
					/>
				)}
			</TransitionGroup>
		</ElementContext.Provider>
	);
}
