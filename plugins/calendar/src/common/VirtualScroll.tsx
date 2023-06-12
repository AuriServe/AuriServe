import { h, VNode } from 'preact';
import { useMediaMatches, usePrevious } from 'vibin-hooks';
import { useLayoutEffect, useState, useRef, useEffect } from 'preact/hooks';
interface Props {
	itemHeight: number;
	position?: number;
	snap?: boolean;
	negative?: boolean;

	onScroll?: (index: number) => void;

	class?: string;
	style?: string;
	children: (index: number) => VNode;
}

const OVERSCROLL_ELEMS = 10;

/**
 * Renders an infinite virtual list of items, with a fixed height. Good for things like... calendars? :)
 */

export default function VirtualScroll(props: Props) {
	const { onScroll } = props;
	const itemHeight = Math.round(props.itemHeight);

	/** Whether or not touch controls are in use or not. */
	const touch = useMediaMatches('(pointer: coarse)');

	/** A reference to the containing element. */
	const scrollerRef = useRef<HTMLDivElement | null>(null);

	/** True if the user is currently touching the calendar with a touch gesture. */
	const touching = useRef(false);

	/** Timeout before the `update` function runs, recomputing the scroll elements. */
	const updateTimeout = useRef<number>(0);

	/** The target scroll position for the autoscroll function. */
	const autoScrollTarget = useRef<number | null>(null);

	/*
	 * Set when a rerender is about to change the visible elements to keep the view stable,
	 * should be applied to the autoscroll target and the scroll position.
	 */
	const shiftScroll = useRef<number>(0);

	/** The index of the first viewable row. */
	const [ viewOffset, setViewOffset ] = useState(0);

	useLayoutEffect(() => {
		if (!shiftScroll.current) return;
		scrollerRef.current!.scrollTop += shiftScroll.current;
		if (autoScrollTarget.current) autoScrollTarget.current! += shiftScroll.current;
		shiftScroll.current = 0;
	});

	/** The number of elements above the viewable region to render. */
	const numOverscrollUp = props.negative ? OVERSCROLL_ELEMS : Math.min(viewOffset, OVERSCROLL_ELEMS);

	/** The number of elements below the viewable region to render. */
	const numOverscrollDown = OVERSCROLL_ELEMS;

	/** The index to start rendering rows at. */
	const renderStart = Math.max(Math.floor(viewOffset - numOverscrollUp), props.negative ? -Infinity : 0);

	/** The number of elements to render. */
	const num = Math.ceil(((scrollerRef.current?.offsetHeight ?? 0) / itemHeight) * 2 + 1)
		+ numOverscrollUp + numOverscrollDown;

	/** Set the initial scroll position. */
	useLayoutEffect(() => {
		const numOverscrollUp = (props.negative ? OVERSCROLL_ELEMS : Math.min(props.position ?? 0, OVERSCROLL_ELEMS));
		shiftScroll.current = (itemHeight * numOverscrollUp + (props.position ?? 0));
	}, [ itemHeight, props.negative, props.position ]);

	/** Call the onScroll callback when the view position changes. */
	useLayoutEffect(() => onScroll?.(viewOffset), [ viewOffset, onScroll ]);

	function update() {
		const elem = scrollerRef.current;
		updateTimeout.current = 0;
		if (!elem) return;

		if (touching.current) {
			updateTimeout.current = setTimeout(update, 50) as any;
			return;
		}

		if (elem.scrollTop / itemHeight < numOverscrollUp) {
			const moveDiff = Math.ceil(elem.scrollTop / itemHeight - numOverscrollUp);
			const scrollDiff = Math.min(-moveDiff, Math.max(viewOffset - OVERSCROLL_ELEMS, 0));
			setViewOffset(offset => offset + moveDiff);
			shiftScroll.current = scrollDiff * itemHeight;
		}
		else if (elem.scrollTop / itemHeight >= numOverscrollUp + 1) {
			const moveDiff = Math.floor(elem.scrollTop / itemHeight - numOverscrollUp);
			const scrollDiff = -Math.max(Math.floor(elem.scrollTop / itemHeight - OVERSCROLL_ELEMS), 0);
			setViewOffset(offset => offset + moveDiff);
			shiftScroll.current = scrollDiff * itemHeight;
		}
	}

	useEffect(() => {
		if (!touch) return;

		const onTouchStart = () => touching.current = true;
		const onTouchEnd = () => touching.current = false;

		window.addEventListener('touchstart', onTouchStart);
		window.addEventListener('touchend', onTouchEnd);

		return () => {
			window.removeEventListener('touchstart', onTouchStart);
			window.removeEventListener('touchend', onTouchEnd);
		}
	}, [ touch ]);

	function handleScroll() {
		if (touch) {
			if (updateTimeout.current) window.clearTimeout(updateTimeout.current);
			updateTimeout.current = window.setTimeout(update, 100);
		}
		else if (!updateTimeout.current) updateTimeout.current = window.setTimeout(update, 50);
	}

	function handleWheel(evt: any) {
		if (!props.snap) return;
		evt.preventDefault();
		const elem = scrollerRef.current!;
		if (!elem) return;

		elem.classList.remove('vscroll_snap');

		if (autoScrollTarget.current == null) {
			const STEP = 3;

			function snappedScroll() {
				const diff = (autoScrollTarget.current ?? 0) - elem.scrollTop;

				if (diff === 0 || autoScrollTarget.current == null) {
					autoScrollTarget.current = null;
					return;
				}

				if (Math.abs(diff) > 2) elem.scrollTop += Math.round(diff / STEP);
				else {
					elem.scrollTop = autoScrollTarget.current;
					if (props.snap) elem.classList.add('vscroll_snap');
				}

				window.requestAnimationFrame(snappedScroll);
			}

			window.requestAnimationFrame(snappedScroll);
		}

		autoScrollTarget.current = Math.max(
			(autoScrollTarget.current ?? elem.scrollTop) + (evt.deltaY > 0 ? 1 : -1) * itemHeight,
			props.negative ? -Infinity : 0);
	}

	const items = [];

	for (let i = renderStart; i < renderStart + num; i++) {
		items.push(
			<div key={`${renderStart}_${i}`}
				class='vscroll_item'
				style={`height:${itemHeight}px;`}>
				{props.children(i)}
			</div>
		);
	}

	return (
		<div
			onScroll={handleScroll}
			onWheel={handleWheel}
			ref={scrollerRef}
			style={props.style}
			class={`vscroll${props.snap ? ' vscroll_snap' : ''}`}>
			{items}
		</div>
	);
}
