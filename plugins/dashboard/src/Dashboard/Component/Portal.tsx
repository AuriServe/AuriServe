import { useEffect, useMemo } from 'preact/hooks';
import { createPortal, forwardRef } from 'preact/compat';
import {
	h,
	ComponentChildren,
	RefObject,
	FunctionalComponent,
	ComponentClass,
} from 'preact';

import { tw, merge } from '../Twind';

interface Props {
	[prop: string]: unknown;

	to?: HTMLElement;
	as?: string | FunctionalComponent<any> | ComponentClass<any, any>;

	style?: any;
	class?: string;
	wrapperClass?: string;
	children?: ComponentChildren;
}

export default forwardRef<HTMLDivElement, Props>(function Portal(
	props: Props,
	ref: RefObject<HTMLDivElement>
) {
	const root = useMemo(() => document.createElement('div'), []);

	useEffect(() => {
		root.className = merge(tw`Portal~(fixed top-0 left-0 w-0 h-0)`, props.wrapperClass);
	}, [props.wrapperClass, root]);

	useEffect(() => {
		const parent = props.to ?? document.querySelector('.AS_ROOT') ?? document.body;
		parent.appendChild(root);
		return () => parent.removeChild(root);
	}, [props.to, root]);

	const Tag = props.as ?? 'div';

	const passedProps = { ...props };
	delete passedProps.to;
	delete passedProps.as;
	delete passedProps.wrapperClass;
	passedProps.ref = ref;

	return createPortal(<Tag {...passedProps} />, root);
});
