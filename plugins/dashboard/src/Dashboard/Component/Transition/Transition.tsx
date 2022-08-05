import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { cloneElement, ComponentChildren, ComponentType, Fragment, h } from 'preact';

// import TransitionGroup from './TransitionGroup';

import { State, TransitionClasses, merge, getClassesForState } from './Types';
import { forwardRef } from 'preact/compat';

interface Props extends TransitionClasses {
	[prop: string]: unknown;

	as?: ComponentType<any> | string;
	useClassName?: boolean;

	show: boolean;
	duration: number;
	initial?: boolean;

	class?: string;
	children?: ComponentChildren;
}

export default forwardRef<HTMLElement, Props>(function Transition(props, ref) {
	const timeoutRef = useRef<any>(null);
	const initialRef = useRef<boolean>(true);
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
			if (!props.show || !props.initial) return;
		}

		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = 0;
		}

		if (props.show) setState(State.BeforeEnter);
		else setState(State.BeforeExit);
	}, [props.show, props.initial]);

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
				[props.useClassName ? 'className' : 'class']: merge(
					child.props.className,
					child.props.class,
					classes
				),
				[props.useClassName ? 'class' : 'className']: undefined,
			})
		) as any;
	}

	const passedProps: Partial<Props> & { className?: string } = { ...props };
	delete passedProps.as;
	delete passedProps.show;
	delete passedProps.initial;
	delete passedProps.class;
	delete passedProps.duration;
	delete passedProps.enter;
	delete passedProps.enterFrom;
	delete passedProps.enterTo;
	delete passedProps.exit;
	delete passedProps.exitFrom;
	delete passedProps.exitTo;
	delete passedProps.invertExit;
	passedProps.ref = ref;

	passedProps[props.useClassName ? 'className' : 'class'] = merge(classes);

	return <Tag {...passedProps} />;
});

// Transition.Group = TransitionGroup;
