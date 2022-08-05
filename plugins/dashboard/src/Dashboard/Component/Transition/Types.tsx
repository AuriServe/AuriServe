/** The states that a Transition can be in. */
export enum State {
	BeforeEnter,
	Entering,
	Entered,
	BeforeExit,
	Exiting,
	Exited,
}

/** Merges the provided classes, ignoring falsy or undefined values. */
export function merge(...classes: (string | undefined | false)[]) {
	return classes.filter((c) => c).join(' ');
}

/** The transition classes that may be applied to a Transition element. */
export interface TransitionClasses {
	enter?: string;
	enterFrom?: string;
	enterTo?: string;

	exit?: string;
	exitFrom?: string;
	exitTo?: string;

	invertExit?: boolean;
}

/** Combines the relevant transition classes for a transition State. */
export function getClassesForState(state: State, props: TransitionClasses) {
	switch (state) {
		case State.BeforeEnter:
			return merge(props.enterFrom);
		case State.Entering:
			return merge(props.enter, props.enterTo);
		case State.BeforeExit:
			return merge(props.exitFrom, props.invertExit && props.enterTo);
		case State.Exiting:
			return merge(props.exit, props.exitTo, props.invertExit && props.enter, props.invertExit && props.enterFrom);
		default:
			return '';
	}
}
