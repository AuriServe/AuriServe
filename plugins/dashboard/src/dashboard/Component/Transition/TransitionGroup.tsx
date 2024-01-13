// // import { useRerender } from 'vibin-hooks';
// // import { useMemo, useRef } from 'preact/hooks';
// // import { cloneElement, ComponentChildren, ComponentType, Fragment, h, VNode } from 'preact';

// // import { TransitionClasses } from './Types';
// // import { assert } from 'common';

// // import Transition from './Transition';

// // interface Props extends TransitionClasses {
// // 	as?: ComponentType<any> | string;

// // 	duration: number;

// // 	class?: string;
// // 	childClass?: string;
// // 	children?: ComponentChildren;
// // }

// // enum State {
// // 	In,
// // 	Out,
// // }

// // interface Child {
// // 	state: State;
// // 	timeout: number;
// // 	element: VNode;
// // }

// // export default function TransitionGroup(props: Props) {
// // 	const rerender = useRerender();
// // 	const ref = useRef<Map<string, Child>>(new Map());

// // 	useMemo(() => {
// // 		const children = (Array.isArray(props.children) ? props.children : props.children ? [props.children] : []).filter(
// // 			(child: any) => child
// // 		) as VNode[];

// // 		assert(!children.some((child) => child.key === undefined), '[TransitionGroup] All children must have a key!');

// // 		const currentChildren = children.map((child) => child.key);

// // 		ref.current.forEach((child, key) => {
// // 			if (!currentChildren.includes(key)) {
// // 				if (child.state === State.In) clearTimeout(child.timeout);
// // 				child.timeout = window.setTimeout(() => {
// // 					ref.current.delete(key);
// // 					rerender();
// // 				}, props.duration) as number;
// // 				child.state = State.Out;
// // 			}
// // 		});

// // 		children.forEach((child) => {
// // 			const existing = ref.current.get(child.key);
// // 			if (existing) {
// // 				if (existing.state === State.Out) {
// // 					existing.state = State.In;
// // 					clearTimeout(existing.timeout);
// // 				}
// // 				existing.element = cloneElement(child);
// // 			} else {
// // 				ref.current.set(child.key, {
// // 					state: State.In,
// // 					timeout: 0,
// // 					element: cloneElement(child),
// // 				});
// // 			}
// // 		});
// // 	}, [props.children, props.duration, rerender]);

// // 	const Tag: ComponentType<any> | string = props.as ?? Fragment;

// // 	return (
// // 		<Tag className={props.class}>
// // 			{Array.from(ref.current.entries()).map(([key, child]) => (
// // 				<Transition
// // 					key={key}
// // 					initial
// // 					class={props.childClass}
// // 					show={child.state !== State.Out}
// // 					duration={props.duration}
// // 					invertExit={props.invertExit}
// // 					enter={props.enter}
// // 					enterFrom={props.enterFrom}
// // 					enterTo={props.enterTo}
// // 					exit={props.exit}
// // 					exitFrom={props.exitFrom}
// // 					exitTo={props.exitTo}>
// // 					{child.element}
// // 				</Transition>
// // 			))}
// // 		</Tag>
// // 	);
// // }

// // import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
// // import { cloneElement, ComponentChildren, ComponentType, Fragment, h } from 'preact';

// // // import TransitionGroup from './TransitionGroup';

// // import { State, TransitionClasses, merge, getClassesForState } from './Types';
// // import { forwardRef } from 'preact/compat';

// // interface Props extends TransitionClasses {
// // 	[prop: string]: unknown;

// // 	as?: ComponentType<any> | string;
// // 	useClassName?: boolean;

// // 	show: boolean;
// // 	duration: number;
// // 	initial?: boolean;

// // 	class?: string;
// // 	children?: ComponentChildren;
// // }

// // export default forwardRef<HTMLElement, Props>(function Transition(props, ref) {
// // 	const timeoutRef = useRef<any>(null);
// // 	const initialRef = useRef<boolean>(true);
// // 	const [state, setState] = useState<State>(props.show ? State.Entered : State.Exited);
// // 	// TODO: Replace getClassesForState to fix this.
// // 	const classes = useMemo(
// // 		() => merge(props.class, getClassesForState(state, props)),
// // 		// eslint-disable-next-line react-hooks/exhaustive-deps
// // 		[state]
// // 	);

// // 	useLayoutEffect(() => {
// // 		if (initialRef.current) {
// // 			initialRef.current = false;
// // 			if (!props.show || !props.initial) return;
// // 		}

// // 		if (timeoutRef.current) {
// // 			window.clearTimeout(timeoutRef.current);
// // 			timeoutRef.current = 0;
// // 		}

// // 		if (props.show) setState(State.BeforeEnter);
// // 		else setState(State.BeforeExit);
// // 	}, [props.show, props.initial]);

// // 	useLayoutEffect(() => {
// // 		window.requestAnimationFrame(() => {
// // 			if (state === State.BeforeEnter)
// // 				window.requestAnimationFrame(() => setState(State.Entering));
// // 			else if (state === State.Entering)
// // 				timeoutRef.current = setTimeout(() => setState(State.Entered), props.duration);
// // 			else if (state === State.BeforeExit)
// // 				window.requestAnimationFrame(() => setState(State.Exiting));
// // 			else if (state === State.Exiting)
// // 				timeoutRef.current = setTimeout(() => setState(State.Exited), props.duration);
// // 		});
// // 	}, [state, props.duration]);

// // 	if (state === State.Exited) return null;

// // 	const Tag: ComponentType<any> | string = props.as ?? Fragment;

// // 	if (Tag === Fragment) {
// // 		const children: any[] = props.children
// // 			? Array.isArray(props.children)
// // 				? props.children
// // 				: [props.children]
// // 			: [];
// // 		return children.map((child) =>
// // 			cloneElement(child, {
// // 				[props.useClassName ? 'className' : 'class']: merge(
// // 					child.props.className,
// // 					child.props.class,
// // 					classes
// // 				),
// // 				[props.useClassName ? 'class' : 'className']: undefined,
// // 			})
// // 		) as any;
// // 	}

// // 	const passedProps: Partial<Props> & { className?: string } = { ...props };
// // 	delete passedProps.as;
// // 	delete passedProps.show;
// // 	delete passedProps.initial;
// // 	delete passedProps.class;
// // 	delete passedProps.duration;
// // 	delete passedProps.enter;
// // 	delete passedProps.enterFrom;
// // 	delete passedProps.enterTo;
// // 	delete passedProps.exit;
// // 	delete passedProps.exitFrom;
// // 	delete passedProps.exitTo;
// // 	delete passedProps.invertExit;
// // 	passedProps.ref = ref;

// // 	passedProps[props.useClassName ? 'className' : 'class'] = merge(classes);

// // 	return <Tag {...passedProps} />;
// // });

// // // Transition.Group = TransitionGroup;

// import { forwardRef, useRef, memo, useCallback } from 'preact/compat';
// import { Transition as HeadlessUITransition } from '@headlessui/react';
// import { ComponentChildren, ComponentType, h, cloneElement, ComponentChild, VNode } from 'preact';

// interface Props {
// 	[prop: string]: unknown;

// 	as?: ComponentType<any> | string;

// 	initial?: boolean;

// 	class?: string;
// 	className?: string;
// 	children?: ComponentChildren;

// 	enter?: string;
// 	enterFrom?: string;
// 	enterTo?: string;
// 	entered?: string;

// 	exit?: string;
// 	exitFrom?: string;
// 	exitTo?: string;

// 	invertExit?: boolean;
// }

// interface RenderChild {

// 	/**
// 	 * The *`TransitionGroup`'s* key for this child, which will NOT be the same as `elem`'s key.
// 	 */

// 	key: number;

// 	/**
// 	 * The element that should be rendered. This will either be the
// 	 *  up-to-date child, or a cloned one, if the child is exiting.
// 	 */

// 	elem: VNode;

// 	/**
// 	 * Whether or not the child is exiting the group.
// 	 */

// 	exiting: boolean;
// }

// function useUniqueNumber(loop = Number.MAX_SAFE_INTEGER) {
// 	const lastRef = useRef<number>(0);
// 	return useCallback(() => (lastRef.current = (lastRef.current + 1) % loop, lastRef.current), [ loop ]);
// }

// const TransitionGroup = memo(forwardRef<HTMLDivElement, Props>((props, ref) => {
// 	const { children, ...transitionProps } = props;
// 	const keyGen = useUniqueNumber();

// 	// Collect `currElems` and `newElems`, ensure that all children are keyed.
// 	const currElemsRef = useRef<RenderChild[]>([]);
// 	const currElems = currElemsRef.current;
// 	const newElems = (Array.isArray(children) ? children : children ? [ children ] : [])
// 		.filter(c => c && typeof c === 'object' && 'key' in c) as VNode[];
// 	if (newElems.length < (Array.isArray(children) ? children.length : children ? 1 : 0))
// 		console.warn('[TransitionGroup] An unkeyed child has been ignored.');

// 	// Find existing elements which are not already exiting, and which are in the new array as well.
// 	// const matchedElemKeys: Map<unknown, number> = new Map(newElems
// 	// 	.map(child => currElems.find(c => c.elem.key === child.key && c.elem.type === child.type && !c.exiting))
// 	// 	.filter(Boolean)
// 	// 	.map(c => ([ c!.elem.key as unknown, c!.key ])));

// 	// // Flag any existing elements which weren't found in the new array as exiting.
// 	// currElems.forEach(elem => elem.exiting ||= !matchedElemKeys.has(elem.key));

// 	let lastIndex = -1;

// 	for (let i = 0; i < newElems.length; i++) {
// 		// Find the next non-exiting element in the current array, to compare against our new child.
// 		const newElem = newElems[i];
// 		let nextNonExitingInd = -1;
// 		for (let j = lastIndex + 1; j < currElems.length; j++) {
// 			if (!currElems[j].exiting) { nextNonExitingInd = j; break; }
// 		}

// 		// If there is no next non-exiting element, push the new element to the end of the array.
// 		if (nextNonExitingInd === -1) {
// 			currElems.push({
// 				key: keyGen(),
// 				elem: newElem,
// 				exiting: false
// 			});
// 			lastIndex = currElems.length - 1;
// 		}
// 		// Else, if the element exists and is of the same type, replace it.
// 		else if (currElems[nextNonExitingInd].elem.type === newElem.type) {
// 			currElems[nextNonExitingInd].elem = newElem;
// 			lastIndex = nextNonExitingInd;
// 		}
// 		// Else, if the element exists, but is not of the same type, push the new element after it.
// 	}

// 	// for (let ch of newElems) {
// 	// 	if ()
// 	// }

// 	// for (let ch of passedChildrenArray) {
// 	// 	if (!ch) continue;
// 	// 	if (typeof ch !== 'object' || !('key' in ch))
// 	// 		throw new Error('[TransitionGroup] All non-null children must be keyed.');
// 	// 	const key = ch.key as string;


// 	// 	let currentWithKey: number | undefined;
// 	// 	let currentFits = true;

// 	// 	for (let i = lastFitIndex + 1; i < renderChildren.current.length; i++) {
// 	// 		if (renderChildren.current[i].key === key) {
// 	// 			renderChildren.current[i].elem = ch;
// 	// 			currentFits &&= renderChildren.current[i].elem.type === ch.type;
// 	// 			lastFitIndex = i;
// 	// 			break;
// 	// 		}
// 	// 		else if (renderChildren.current[i].before != null) {
// 	// 			currentFits = false;
// 	// 			break;
// 	// 		}
// 	// 	}

// 	// 	if (currentWithKey) {
// 	// 		if (currentFits) {
// 	// 			renderChildren.current[currentWithKey].elem = ch;
// 	// 			renderChildren.current[currentWithKey].before = undefined;
// 	// 			lastFitIndex = currentWithKey;
// 	// 		}
// 	// 		else {
// 	// 			// set the old one to exiting, give it a new key, update previous element if `before` is set to that key, push new element at the end, don't update last fit index. ACTUALLY - doing so might end up with elements out of order, because if B can't be inserted in but C can, it would end up with ACB. I'd need to either update the last fit index to the end of the array, or insert the new element right after the current found one, which shouldn't cause later elements to have any problems I don't *think*. think more about this edge case because i can't figure it out RIGHT now
// 	// 		}
// 	// 	}



// 	// }

// 	// console.log(childArray[0])

// 	// const {
// 	// 	as,
// 	// 	show,
// 	// 	initial: appear,
// 	// 	unmount,
// 	// 	class: className = props.className,
// 	// 	children,
// 	// 	enter,
// 	// 	enterFrom,
// 	// 	enterTo,
// 	// 	entered,
// 	// 	invertExit,
// 	// 	exit: leave = invertExit ? enter : undefined,
// 	// 	exitFrom: leaveFrom = invertExit ? enterTo : undefined,
// 	// 	exitTo: leaveTo = invertExit ? enterFrom : undefined,
// 	// 	...passedProps
// 	// } = props;

// 	// const classProps: any = {};
// 	// if (props.className) classProps.className = className;
// 	// else if (props.class) classProps.class = className;

// 	// return (
// 	// 	<HeadlessUITransition
// 	// 		as={as}
// 	// 		show={show}
// 	// 		appear={appear}
// 	// 		unmount={unmount}
// 	// 		{...classProps}
// 	// 		enter={enter}
// 	// 		enterFrom={enterFrom}
// 	// 		enterTo={enterTo}
// 	// 		entered={entered}
// 	// 		leave={leave}
// 	// 		leaveFrom={leaveFrom}
// 	// 		leaveTo={leaveTo}
// 	// 		{...passedProps}
// 	// 	>
// 	// 		{props.children}
// 	// 	</HeadlessUITransition>
// 	// )
// }));

// export default TransitionGroup;
