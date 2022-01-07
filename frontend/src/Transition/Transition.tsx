import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { cloneElement, ComponentChildren, ComponentType, Fragment, h } from 'preact';

// import TransitionGroup from './TransitionGroup';

import { State, TransitionClasses, merge, getClassesForState } from './Types';

interface Props extends TransitionClasses {
	[key: string]: any;

	as?: ComponentType<any> | string;

	show: boolean;
	duration: number;
	initial?: boolean;

	class?: string;
	children?: ComponentChildren;
}

export default function Transition(props: Props) {
	const timeoutRef = useRef<any>(null);
	const initialRef = useRef<boolean>(!(props.initial || false));
	const [state, setState] = useState<State>(props.show ? State.Entered : State.Exited);
	// TODO: Replace getClassesForState to fix this.
	const classes = useMemo(
		() => merge(props.class, getClassesForState(state, props)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[state]
	);

	useLayoutEffect(() => {
		if (initialRef.current) {
			initialRef.current = false;
			return;
		}

		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = 0;
		}

		if (props.show) setState(State.BeforeEnter);
		else setState(State.BeforeExit);
	}, [props.show]);

	useLayoutEffect(() => {
		window.requestAnimationFrame(() => {
			if (state === State.BeforeEnter)
				window.requestAnimationFrame(() => setState(State.Entering));
			else if (state === State.Entering)
				timeoutRef.current = setTimeout(() => setState(State.Entered), props.duration);
			else if (state === State.BeforeExit)
				window.requestAnimationFrame(() => setState(State.Exiting));
			else if (state === State.Exiting)
				timeoutRef.current = setTimeout(() => setState(State.Exited), props.duration);
		});
	}, [state, props.duration]);

	if (state === State.Exited) return null;

	const Tag: ComponentType<any> | string = props.as ?? Fragment;

	if (Tag === Fragment) {
		const children: any[] = props.children
			? Array.isArray(props.children)
				? props.children
				: [props.children]
			: [];
		return children.map((child) =>
			cloneElement(child, {
				className: merge(child.props.className, child.props.class, classes),
				class: undefined,
			})
		) as any;
	}

	const renderProps: Partial<Props> & { className?: string } = { ...props };
	delete renderProps.as;
	delete renderProps.show;
	delete renderProps.initial;
	delete renderProps.class;
	renderProps.className = merge(props.class, classes);
	console.log(renderProps.className);

	return <Tag {...renderProps} />;
}

// Transition.Group = TransitionGroup;
