import { Fragment, h, VNode } from 'preact';
import { useMediaMatches, usePrevious } from 'vibin-hooks';
import { useLayoutEffect, useState, useRef, useEffect, useCallback } from 'preact/hooks';
interface Props {
	position?: number;
	minRow?: number;
	maxRow?: number;

	itemHeight: number;
	snap?: boolean;
	overScroll?: number;

	onScroll?: (index: number) => void;

	class?: string;
	style?: string;
	children: (index: number) => VNode;
}

const DEFAULT_OVERSCROLL_PX = 2000;

/**
 * Renders an infinite virtual list of items, with a fixed height. Good for things like... calendars? :)
 */

export default function VirtualScroll(props: Props) {
	const { onScroll, minRow = 0, maxRow = Infinity, position = 0, snap = false } = props;

	if (!props.itemHeight) throw new Error('VirtualScroll requires a nonzero itemHeight prop!');

	/** The height of each item. */
	const itemHeight = Math.round(props.itemHeight);

	/** A reference to the containing element. */
	const scrollerRef = useRef<HTMLDivElement | null>(null);

	/** A ref for the autoscroll to detect if it has been moving successfully. */
	const autoScrollLastPos = useRef<number | null>(null);

	/** The number of elements to overscroll when not at the start or the end. */
	const overScroll = Math.max(props.overScroll ?? Math.ceil(DEFAULT_OVERSCROLL_PX / itemHeight), 1);

	/** Whether or not touch controls are in use or not. */
	const touch = useMediaMatches('(pointer: coarse)');

	/** True if the user is currently touching the calendar with a touch gesture. */
	const touching = useRef(false);

	/** Timeout before the `update` function runs, recomputing the scroll elements. */
	const updateTimeout = useRef<number>(0);

	/** The target scroll position for the autoscroll function. */
	const autoScrollTarget = useRef<number | null>(null);

	/* Set when a rerender is about to change the visible elements to keep the view stable,
	 * should be applied to the autoscroll target and the scroll position. */
	const shiftScroll = useRef<number>(0);

	/** The index of the first viewable row. */
	const [ viewOffset, setViewOffset ] = useState(props.position ?? 0);

	useLayoutEffect(() => {
		if (!shiftScroll.current || !scrollerRef.current) return;
		scrollerRef.current.scrollTop += shiftScroll.current;
		if (autoScrollTarget.current) autoScrollTarget.current! += shiftScroll.current;
		shiftScroll.current = 0;
	});

	/** The number of visible rows in the container. */
	const numVisibleRows = Math.min(Math.floor((scrollerRef.current?.offsetHeight ?? 0) / itemHeight + 0.25),
		maxRow - minRow + 1);

	/** The number of elements above the viewable region to render. */
	const numOverscrollUp = Math.min(viewOffset - minRow, overScroll);

	/** The number of elements below the viewable region to render. */
	const numOverscrollDown = Math.max(Math.min(maxRow + 1 - viewOffset - numVisibleRows, overScroll), 0);

	/** The index to start rendering rows at. */
	const renderStart = Math.max(Math.floor(viewOffset - numOverscrollUp), minRow);

	/** Call the onScroll callback when the view position changes. */
	useLayoutEffect(() => onScroll?.(viewOffset), [ viewOffset, onScroll ]);

	/** Once invoked, will animate to `autoScrollTarget`. */
	const autoScroll = useCallback(() => {
		const STEP = 3;
		const elem = scrollerRef.current!;
		if (!elem) return;

		if (autoScrollLastPos.current == null) {
			elem.classList.remove('vscroll_snap');
			autoScrollLastPos.current = -Infinity;
		}

		const diff = (autoScrollTarget.current ?? 0) - elem.scrollTop;
		if (diff === 0 || autoScrollTarget.current == null || autoScrollLastPos.current === elem.scrollTop) {
			autoScrollTarget.current = null;
			return;
		}

		if (Math.abs(diff) > 1) {
			autoScrollLastPos.current = elem.scrollTop;
			elem.scrollTop += Math.min(Math.abs(Math.round(diff / STEP)), Math.abs(diff)) * (diff < 0 ? -1 : 1);
			window.requestAnimationFrame(autoScroll);
		}
		else {
			elem.scrollTop = autoScrollTarget.current;
			// console.log('SETTING');
			autoScrollLastPos.current = null;
			if (snap) elem.classList.add('vscroll_snap');
			window.requestAnimationFrame(autoScroll);
		}
	}, [ snap ]);

	/** Updates the view position when the position property changes, and sets the initial scroll position. */
	const prevPropsPosition = usePrevious(props.position);
	if (prevPropsPosition == null && props.position != null) {
		const numOverscrollUp = Math.min(position - minRow, overScroll);
		shiftScroll.current = (itemHeight * numOverscrollUp + position);
	}
	else if (prevPropsPosition != null && props.position != null && prevPropsPosition !== props.position) {
		const diff = props.position - viewOffset;
		if (autoScrollTarget.current == null) requestAnimationFrame(autoScroll);
		console.log(autoScrollTarget.current, scrollerRef.current?.scrollTop, diff, minRow);
		// autoScrollTarget.current = Math.max((autoScrollTarget.current ?? scrollerRef.current?.scrollTop ?? 0)

		const scrollOffset = Math.ceil((scrollerRef.current?.scrollTop ?? 0) / itemHeight) - numOverscrollUp;
		console.log(scrollOffset);
			// + diff * itemHeight, minRow);
		autoScrollTarget.current = (props.position - viewOffset + numOverscrollUp - scrollOffset) * itemHeight;
	};

	/** Updates visible rows on scroll, and fixes `autoScrollTarget` when the rows are changed. */
	const update = useCallback(() => {
		updateTimeout.current = 0;
		const elem = scrollerRef.current;
		if (!elem) return;

		if (touching.current) {
			updateTimeout.current = setTimeout(update, 50) as any;
			return;
		}

		setViewOffset(viewOffset => {
			const numOverscrollUp = Math.min(viewOffset - minRow, overScroll);
			// console.log(numOverscrollUp, overScroll, viewOffset);

			if (elem.scrollTop / itemHeight < numOverscrollUp) {
				const moveDiff = Math.ceil(elem.scrollTop / itemHeight - numOverscrollUp);
				const scrollDiff = -moveDiff;
				shiftScroll.current = scrollDiff * itemHeight;
				// console.log('up', moveDiff, scrollDiff);
				return viewOffset + moveDiff;
			}
			else if (elem.scrollTop / itemHeight >= numOverscrollUp + 1) {
				const moveDiff = Math.floor(elem.scrollTop / itemHeight - numOverscrollUp);
				const scrollDiff = -Math.max(Math.floor(elem.scrollTop / itemHeight - overScroll), 0);
				// const newScrollDiff = scrollDiff + Math.max((viewOffset + numVisibleRows + moveDiff - maxRow), 0)
				// if (viewOffset + numVisibleRows + moveDiff >= maxRow) scrollDiff++;
				shiftScroll.current = scrollDiff * itemHeight;
				// console.log('down', elem.scrollTop, moveDiff, scrollDiff, viewOffset, shiftScroll.current);
				return viewOffset + moveDiff;
			}
			return viewOffset;
		});
	}, [ itemHeight, overScroll, minRow ]);

	/** Store when the user is touching the screen, to avoid reflowing the document while they are scrolling. */
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

	/** Called when the scroll wheel is spun or the document is dragged. Updates the rows. */
	function handleScroll() {
		// console.log('SCROLL');
		if (touch) {
			if (updateTimeout.current) window.clearTimeout(updateTimeout.current);
			updateTimeout.current = window.setTimeout(update, 100);
		}
		else if (!updateTimeout.current) updateTimeout.current = window.setTimeout(update, 100);
	}

	/** Called when the mouse wheel is spun. Initiates the autoscroll. */
	function handleWheel(evt: any) {
		if (!snap) return;
		evt.preventDefault();
		if (autoScrollTarget.current == null) requestAnimationFrame(autoScroll);
		autoScrollTarget.current = Math.max((autoScrollTarget.current ?? scrollerRef.current?.scrollTop ?? 0)
			+ (evt.deltaY > 0 ? 1 : -1) * itemHeight, minRow);
	}

	// Create the items to display in the container, and render them.

	const items = [];

	for (let i = 0; i < numVisibleRows + numOverscrollUp + numOverscrollDown; i++) {
		items.push(
			<div
				key={`${i + renderStart}`}
				class='vscroll_item'
				style={`height:${itemHeight}px;`}>
				{props.children(i + renderStart)}
			</div>
		);
	}

	return (
		<Fragment>
			<style dangerouslySetInnerHTML={{ __html: `
				.vscroll {
					overflow: hidden auto;
					overflow-anchor: none;
					margin-right: -20px;
					scrollbar-color: var(--calendar-background-color) var(--calendar-background-color);
					&::-webkit-scrollbar { width: 20px; }
					@supports (scrollbar-width: none) { margin-right: 0; scrollbar-width: none; }

					@media screen and (pointer: coarse) {
						.vscroll.vscroll_snap {
							scroll-snap-type: y mandatory;
						}

						.vscroll.vscroll_snap > .vscroll_item {
							scroll-snap-stop: normal;
							scroll-snap-align: start;
						}
					}
				}
			`}}/>
			<div
				onScroll={handleScroll}
				onWheel={handleWheel}
				ref={scrollerRef}
				style={props.style}
				class={`vscroll${snap ? ' vscroll_snap' : ''}`}>
				{items}
			</div>
		</Fragment>
	);
}
