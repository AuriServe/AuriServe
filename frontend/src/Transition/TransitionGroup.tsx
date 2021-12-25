import { useRerender } from 'vibin-hooks';
import { useMemo, useRef } from 'preact/hooks';
import { cloneElement, ComponentChildren, ComponentType, Fragment, h, VNode } from 'preact';

import { TransitionClasses } from './Types';
import { assert } from 'common';

import Transition from './Transition';

interface Props extends TransitionClasses {
	as?: ComponentType<any> | string;

	duration: number;

	class?: string;
	childClass?: string;
	children?: ComponentChildren;
}

enum State {
	In, Out
}

interface Child {
	state: State;
	timeout: number;
	element: VNode;
}

export default function TransitionGroup(props: Props) {
	const rerender = useRerender();
	const ref = useRef<Map<string, Child>>(new Map());

	useMemo(() => {
		const children =
			(Array.isArray(props.children) ? props.children : props.children ? [ props.children ] : [])
				.filter((child: any) => child) as VNode[];

		assert(!children.some(child => child.key === undefined), '[TransitionGroup] All children must have a key!');

		const currentChildren = children.map(child => child.key);

		ref.current.forEach((child, key) => {
			if (!currentChildren.includes(key)) {
				if (child.state === State.In) clearTimeout(child.timeout);
				child.timeout = window.setTimeout(() => {
					ref.current.delete(key);
					rerender();
				}, props.duration) as number;
				child.state = State.Out;
			}
		});

		children.forEach(child => {
			const existing = ref.current.get(child.key);
			if (existing) {
				if (existing.state === State.Out) {
					existing.state = State.In;
					clearTimeout(existing.timeout);
				}
				existing.element = cloneElement(child);
			}
			else {
				ref.current.set(child.key, {
					state: State.In,
					timeout: 0,
					element: cloneElement(child)
				});
			}
		});
	}, [ props.children ]);

	const Tag: ComponentType<any> | string = props.as ?? Fragment;

	return (
		<Tag className={props.class}>
			{Array.from(ref.current.entries()).map(([ key, child ]) =>
				<Transition key={key} initial class={props.childClass}
					show={child.state !== State.Out} duration={props.duration} invertExit={props.invertExit}
					enter={props.enter} enterFrom={props.enterFrom} enterTo={props.enterTo}
					exit={props.exit} exitFrom={props.exitFrom} exitTo={props.exitTo}
				>
					{child.element}
				</Transition>
			)}
		</Tag>
	);
}
