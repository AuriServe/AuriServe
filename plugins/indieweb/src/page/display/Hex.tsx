import { hydrate } from 'hydrated';
import { FunctionalComponent, h } from 'preact';
import { useMemo, useState } from 'preact/hooks';

const identifier = 'indieweb:hex';

import { Iota } from './Iota';

interface Props {
	/** The pattern data. */
	data: string;

	/** The display mode. */
	displayMode: 'inactive' | 'active' | 'circle' | 'click';

	/** The padding of the elements. */
	padding?: number;

	/** The gap of the elements. */
	gap?: number;

	/** The scale of the element in pixels. Defaults to 64 */
	scale: number;

	/* Display settings that will be automatically inferred if unset. */

	/** The stroke width, if the element is a pattern iota. Defaults to scale / 16  */
	strokeWidth: number;

	/** The maximum unscaled width of a pattern, in horizontal sections. Defaults to 3. */
	maxPatternWidth: number;

	/** The number of segments per line, which effects how high resolution the jitter looks. Defaults to 8. */
	lineSegments: number;

	/** The internsity of the jitter. Defaults to scale / 32. */
	jitterIntensity: number;
}

export function Hex(props: Props) {
	const [ clicked, setClicked ] = useState<number>(-1);

	const patterns = useMemo(() => {
		return props.data
			.replace(/^\[/, '')
			.replace(/\]$/, '')
			.split(',')
			.map(p => p.trim());
	}, [ props.data ]);

	function handleClick(i: number) {
		if (i === clicked) setClicked(-1);
		else setClicked(i);
	}

	return (
		<div class={identifier} style={`padding: ${props.padding ?? 0}px; gap: ${props.gap ?? 0}px;`}>
			{patterns.map((pattern, i) =>
				<Iota key={i} data={pattern} active={i <= clicked} jitterIntensity={props.jitterIntensity}
					lineSegments={props.lineSegments} maxPatternWidth={props.maxPatternWidth}
					scale={props.scale} strokeWidth={props.strokeWidth} onClick={() => handleClick(i)}/>
			)}
		</div>
	)
}

const HydratedHex = hydrate(identifier, Hex as FunctionalComponent);

export default { identifier, component: HydratedHex }
