import { hydrate, Static } from 'hydrated';
import { h, ComponentChildren } from 'preact';
import { useState, useRef, useLayoutEffect, useCallback } from 'preact/hooks';

import { randomIdentifier } from '../../common/util';

interface Props {
	gap?: number;
	minWidth?: number;
	initialCount?: number;
	revealCount?: number;

	class?: string;
	children?: ComponentChildren;
}

const identifier = 'base:grid';

function RawGrid(props: Props) {
	const ref = useRef<HTMLDivElement>(null);

	const randomID = props.initialCount ? randomIdentifier() : '';
	const [ moreToReveal, setMoreToReveal ] = useState<boolean>(false);
	const [ revealedCount, setRevealedCount ] = useState<number | null>(props.initialCount ?? null);

	function handleReveal() {
		setRevealedCount(revealedCount => revealedCount! + (props.revealCount ?? 1));
	}

	const updateMoreToReveal = useCallback(() => {
		setRevealedCount((revealedCount) => {
			setMoreToReveal(!!ref.current && !!revealedCount &&
				ref.current.querySelectorAll(':scope > .hydrated\\:static > .contents > *').length > revealedCount);
			return revealedCount;
		});
	}, []);

	useLayoutEffect(() => updateMoreToReveal(), [ revealedCount, updateMoreToReveal ]);

	return (
		<div class={`${identifier} ${randomID} ${props.class ?? ''}`} ref={ref}>
			{revealedCount != null && <style dangerouslySetInnerHTML={{ __html:
				`.base\\:grid.${randomID} > .hydrated\\:static > .contents > *:nth-child(n + ${revealedCount + 1}) { display: none !important; }`
			}}/>}
			<Static>
				<div class='contents' style={{
					gap: props.gap,
					gridTemplateColumns: `repeat(auto-fit, minmax(min(${props.minWidth}px, 100%), 1fr))`,
				}}>
					{props.children}
				</div>
			</Static>
			{moreToReveal && <button class='show-more' onClick={handleReveal}>
				Show More
			</button>}
		</div>
	);
}

export const Grid = hydrate(identifier, RawGrid);

export default { identifier, component: Grid };
