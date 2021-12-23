import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { cloneElement, ComponentChildren, ComponentType, Fragment, h } from 'preact';

// import TransitionGroup from './TransitionGroup';

import { State, TransitionClasses, merge, getClassesForState } from './Types';

interface Props extends TransitionClasses {
	as?: ComponentType<any> | string;

	show: boolean;
	duration: number;

	class?: string;
	children?: ComponentChildren;
}

export default function Transition(props: Props) {
	const timeoutRef = useRef<any>(null);
	const [ state, setState ] = useState<State>(props.show ? State.Entered : State.Exited);
	const classes = useMemo(() => merge(props.class, getClassesForState(state, props)), [ state ]);

	useLayoutEffect(() => {
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = 0;
		}

		if (props.show) setState(State.BeforeEnter);
		else setState(State.BeforeExit);
	}, [ props.show ]);

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
	}, [ state ]);

	if (state === State.Exited) return null;

	const Tag: ComponentType<any> | string = props.as ?? Fragment;

	if (Tag === Fragment) {
		const children: any[] = props.children ? Array.isArray(props.children) ? props.children : [ props.children ] : [];
		return children.map(child => cloneElement(child, { className: merge(
			child.props.className, child.props.class, classes) })) as any;
	}

	return (
		<Tag className={classes}>
			{props.children}
		</Tag>
	);
}

// Transition.Group = TransitionGroup;
