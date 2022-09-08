import { tw, merge } from 'dashboard';
import { ComponentChildren, h } from 'preact';
import { useCallback, useMemo, useLayoutEffect, useRef } from 'preact/hooks';

import { useElement } from './Element';
import getBoundingBox from './BoundingBox';
import { createPortal } from 'preact/compat';

interface Props {
	for?: HTMLElement;
	children?: ComponentChildren;

	style?: any;
	class?: string;
}

export default function Overlay(props: Props) {
	const element = useElement();
	const ref = useRef<HTMLElement>(null);

	const setSize = useCallback(() => {
		const elem = ref.current;
		const parent = props.for ?? document.getElementById(element.path);
		if (!elem || !parent) return;

		const bounds = getBoundingBox(parent);

		elem.style.top = `${bounds.top}px`;
		elem.style.left = `${bounds.left}px`;
		elem.style.width = `${bounds.width}px`;
		elem.style.height = `${bounds.height}px`;
	}, [ props.for, element.path ])

	const resizeObserver = useMemo(() => new ResizeObserver(setSize), [ setSize ]);

	useLayoutEffect(() => {
		const elem = ref.current;
		if (!elem) return;
		setSize();
		resizeObserver.observe(elem);
		return () => resizeObserver.unobserve(elem);
	});

	return createPortal(
		<div ref={ref as any} class={merge(tw`absolute grid interact-none`, props.class)} style={props.style}>
			{props.children}
		</div>,
		document.body.children[0]);
}
