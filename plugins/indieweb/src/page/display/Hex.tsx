import { hydrate } from 'hydrated';
import { FunctionalComponent, h } from 'preact';
import { useMemo, useRef, useState } from 'preact/hooks';

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

	const animationRef = useRef<number>(0);

	const tokens: string[] = [];

	props.data = props.data.replace(/^\[/, '').replace(/\]$/, '');
	let i = 0;
	while (i < props.data.length) {
		if (props.data[i] === ' ' || props.data[i] === ',') {
			i++;
		}
		else if (props.data[i] === '[') {
			tokens.push('[');
			i++;
		}
		else if (props.data[i] === ']') {
			tokens.push(']');
			i++;
		}
		else {
			const token = props.data.substring(i).match(
				/^([\w\d][\w\d. ()]+|\(\d+(?:.\d+)?, ?\d+(?:.\d+)?, ?\d+(?:.\d+)?\))/);
			if (!token) throw new Error('Invalid token');
			tokens.push(token[1]);
			i += token[1].length;
		}
	}

	function handleClick(i: number) {
		if (i === clicked) setClicked(-1);
		else {
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
			function animate() {
				setClicked(curr => {
					if (curr < i) {
						animationRef.current = setTimeout(animate, 50) as any;
						return curr + 1;
					}
					return curr;
				});
			}
			animate();
		}
	}

	return (
		<div class={identifier} style={`padding: ${props.padding ?? 0}px; gap: ${props.gap ?? 0}px;`}>
			{tokens.map((tokens, i) =>
				<Iota key={i} data={tokens} active={i <= clicked} jitterIntensity={props.jitterIntensity}
					lineSegments={props.lineSegments} maxPatternWidth={props.maxPatternWidth}
					scale={props.scale} strokeWidth={props.strokeWidth} onClick={() => handleClick(i)}/>
			)}
		</div>
	)
}

const HydratedHex = hydrate(identifier, Hex as FunctionalComponent);

export default { identifier, component: HydratedHex }
