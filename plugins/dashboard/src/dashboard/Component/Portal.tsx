import { useEffect, useMemo } from 'preact/hooks';
import { ForwardedRef, createPortal, forwardRef } from 'preact/compat';
import {
	h,
	ComponentChildren,
	FunctionalComponent,
	ComponentClass,
} from 'preact';

import { tw, merge } from '../Twind';

interface Props {
	[prop: string]: unknown;

	z?: number;
	to?: HTMLElement;
	as?: string | FunctionalComponent<any> | ComponentClass<any, any>;

	style?: any;
	class?: string;
	wrapperClass?: string;
	children?: ComponentChildren;
}

export default forwardRef<HTMLElement, Props>(function Portal(
	props: Props,
	ref: ForwardedRef<HTMLElement>
) {
	const root = useMemo(() => document.createElement('div'), []);

	useEffect(() => {
		root.className = merge(tw`Portal~(fixed top-0 left-0 w-0 h-0)`, props.wrapperClass);
		if (props.z) root.style.zIndex = props.z.toString();
	}, [props.wrapperClass, root, props.z]);

	useEffect(() => {
		const parent = props.to ?? document.querySelector('#portal') ?? document.body;
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
