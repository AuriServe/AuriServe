import { h, VNode } from 'preact';
import { useLayoutEffect, useState, useRef, useEffect, useMemo } from 'preact/hooks';

interface Props {
	itemHeight: number;
	position?: number;
	snap?: boolean;

	onScroll?: (index: number) => void;

	class?: string;
	style?: string;
	children: (index: number) => VNode;
}

/**
 * This element is pretty hacky, and to be honest I still have no idea why
 * it resets the scroll position? But uh, it's here.
 * Renders an infinite virtual list of items, with a fixed height. Good for things like... calendars? :)
 */

export default function VirtualScroll(props: Props) {
	const { onScroll } = props;
	const itemHeight = Math.round(props.itemHeight);

	const touching = useRef(false);
	const updateTimeout = useRef<number>(0);
	const autoScrollTarget = useRef<number | null>(null);
	const scrollerRef = useRef<HTMLDivElement | null>(null);

	const [ frameHeight, setFrameHeight ] = useState(0);
	const [ startOffset, setStartOffset ] = useState(0);
	const [ shiftScroll, setShiftScroll ] = useState<number | null>(null);

	const touch = useMemo(() => (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches), []);

	const OVERSCROLL_ELEMS = 10;
	const OVERSCROLL_PX = itemHeight * OVERSCROLL_ELEMS;

	useLayoutEffect(() => {
		if (shiftScroll == null) return;
		scrollerRef.current!.scrollTop += shiftScroll;
		if (autoScrollTarget.current) autoScrollTarget.current! += (shiftScroll);
		setShiftScroll(null);
	}, [ shiftScroll ]);

	useLayoutEffect(() => setShiftScroll(itemHeight * (OVERSCROLL_ELEMS + (props.position ?? 0))),
		[ itemHeight, props.position ]);

	const start = Math.floor(startOffset - OVERSCROLL_ELEMS);
	const num = Math.ceil((frameHeight / itemHeight) * 2 + 1) + OVERSCROLL_ELEMS * 2;

	useLayoutEffect(() => onScroll?.(start + OVERSCROLL_ELEMS), [ onScroll, start ])

	function handleSetHeight(elem: HTMLDivElement | null) {
		requestAnimationFrame(() => setFrameHeight(elem?.clientHeight ?? 0));
	}

	function update() {
		const elem = scrollerRef.current;
		updateTimeout.current = 0;
		if (!elem) return;

		if (touching.current) {
			updateTimeout.current = setTimeout(update, 50) as any;
			return;
		}

		if (elem.scrollTop < OVERSCROLL_PX) {
			const diff = Math.ceil(Math.abs((OVERSCROLL_PX - elem.scrollTop) / itemHeight));
			setStartOffset(offset => offset - diff);
			setShiftScroll(diff * itemHeight);
		}
		else if (elem.scrollTop > OVERSCROLL_PX + itemHeight) {
			const diff = Math.ceil(Math.abs((OVERSCROLL_PX + itemHeight - elem.scrollTop) / itemHeight));
			setStartOffset(offset => offset + diff);
			setShiftScroll(-diff * itemHeight);
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
		// console.log('scrolling!', console.log(evt));
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

		if (autoScrollTarget.current == null) {
			const STEP = 3;

			function snappedScroll() {
				const diff = (autoScrollTarget.current ?? 0) - elem.scrollTop;

				if (diff === 0 || autoScrollTarget.current == null) {
					autoScrollTarget.current = null;
					return;
				}

				if (Math.abs(diff) > 2) elem.scrollTop += Math.round(diff / STEP);
				else elem.scrollTop = autoScrollTarget.current;

				window.requestAnimationFrame(snappedScroll);
			}

			window.requestAnimationFrame(snappedScroll);
		}

		autoScrollTarget.current = (autoScrollTarget.current ?? elem.scrollTop) + (evt.deltaY > 0 ? 1 : -1) * itemHeight;
	}

	const items = [];
	for (let i = start; i < start + num; i++) {
		items.push(
			<div key={`${start}_${i}`}
				style={`height:${itemHeight}px;${props.snap && touch && 'scroll-snap-stop: normal;scroll-snap-align: start;'}`}>
				{props.children(i)}
			</div>
		);
	}

	return (
		<div onScroll={handleScroll} onWheel={handleWheel}
			ref={elem => { handleSetHeight(elem); scrollerRef.current = elem; }}
			style={`overflow:auto;${props.style};${props.snap && touch && 'snap-y snap-proximity'};`}
			class='scroll-hide'>
			{items}
		</div>
	);
}
