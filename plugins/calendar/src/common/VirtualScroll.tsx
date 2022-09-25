import { h, VNode } from 'preact';
import { merge, tw } from 'dashboard';
import { useLayoutEffect, useState, useRef } from 'preact/hooks';

// interface Hooks {
// 	setPosition: (index: number) => void;
// 	onPositionChange: (callback: (index: number) => void) => void;
// }

interface Props {
	itemHeight: number;
	initialPosition: number;

	onScroll?: (index: number) => void;

	class?: string;
	style?: string;
	scrollerClass?: string;
	scrollerStyle?: string;
	children: (index: number) => VNode;
}

export default function VirtualScroll(props: Props) {
	const { onScroll, itemHeight } = props;

	const scrollerRef = useRef<HTMLDivElement>(null);

	const [ frameHeight, setFrameHeight ] = useState(0);
	const [ scrollPos, setScrollPos ] = useState(0);
	const [ startOffset, setStartOffset ] = useState(0);
	const [ shiftScroll, setShiftScroll ] = useState<number | null>(null);

	const OVERSCROLL_ELEMS = 2;
	const BUFFER_ELEMS = 10;
	const BUFFER_PX = props.itemHeight * BUFFER_ELEMS;

	useLayoutEffect(() => {
		if (shiftScroll == null) return;
		scrollerRef.current!.scrollTop = shiftScroll;
		setShiftScroll(null);
	}, [ shiftScroll ]);

	useLayoutEffect(() => {
		setShiftScroll(props.itemHeight * (BUFFER_ELEMS + props.initialPosition));
	}, [ props.itemHeight, props.initialPosition ]);

	const start = Math.floor(scrollPos / itemHeight + startOffset - BUFFER_ELEMS - OVERSCROLL_ELEMS);
	const num = Math.ceil((frameHeight / itemHeight) + 1) + OVERSCROLL_ELEMS * 2;

	useLayoutEffect(() => onScroll?.(start + OVERSCROLL_ELEMS), [ onScroll, start ])

	function handleSetHeight(elem: HTMLDivElement | null) {
		requestAnimationFrame(() => {
			setFrameHeight(elem?.clientHeight ?? 0);
		});
	}

	function handleScroll(e: Event) {
		const elem = e.target as HTMLDivElement;
		if (!elem) return;

		let newStartOffset = startOffset;
		const frameSize = Math.ceil((frameHeight / itemHeight) + 1);

		let scrollPos = elem.scrollTop;
		let shiftScroll = false;

		if (scrollPos < BUFFER_PX) {
			scrollPos += frameSize * itemHeight;
			newStartOffset -= frameSize;
			shiftScroll = true;
		}
		else if (scrollPos > BUFFER_PX + frameHeight * 2) {
			scrollPos -= frameSize * itemHeight;
			newStartOffset += frameSize;
			shiftScroll = true;
		}

		setScrollPos(scrollPos);
		if (shiftScroll) setShiftScroll(scrollPos);
		setStartOffset(newStartOffset);
	}

	const items = [];
	for (let i = start; i < start + num; i++) {
		items.push(
			<div key={i} class={tw`absolute left-0 right-0`} style={{ top:
				(i - startOffset + BUFFER_ELEMS) * itemHeight }}>
				{props.children(i)}
			</div>
		);
	}

	return (
		<div class={merge(tw`overflow-hidden grid`, props.class)} style={props.style} ref={handleSetHeight} >
			<div class={merge(tw`overflow-auto relative grow scroll-hide`, props.scrollerClass)}
				style={props.scrollerStyle} ref={scrollerRef} onScroll={handleScroll}>
				<div class={tw`interact-none`} style={`height: ${BUFFER_PX}px`}/>
				<div class={tw`interact-none h-[200%]`}/>
				<div class={tw`interact-none`} style={`height: ${BUFFER_PX}px`}/>
				{items}
			</div>
		</div>
	);
}
