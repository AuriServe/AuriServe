import { hydrate } from 'hydrated';
import { memo } from 'preact/compat';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useMemo, useRef } from 'preact/hooks';

import Noise from './Noise';

type Type = 'pattern' | 'entity' | 'number' | 'vector' | 'garbage' | 'null' | 'list';

type Direction = 0 | 1 | 2 | 3 | 4 | 5;

const DIRECTIONS: Record<string, Direction> = {
	NORTH_EAST: 0, EAST: 1, SOUTH_EAST: 2, SOUTH_WEST: 3, WEST: 4, NORTH_WEST: 5,
};

const OFFSETS: Record<string, number> = {
	a: -2, q: -1, w: 0, e: 1, d: 2
};

const DIAGONAL_Y = Math.cos(30 * (Math.PI / 180));
const DIAGONAL_X = Math.sin(30 * (Math.PI / 180));

const MOVEMENTS: [ number, number ][] = [
	[ DIAGONAL_X, -DIAGONAL_Y ],
	[ 1, 0 ],
	[ DIAGONAL_X,  DIAGONAL_Y ],
	[-DIAGONAL_X,  DIAGONAL_Y ],
	[-1, 0 ],
	[-DIAGONAL_X, -DIAGONAL_Y ]
]

interface PatternData {
	bounds: [ number, number, number, number ],
	shape: Direction[],
	scale: number,
	scaledSize: [ number, number ],
	points: [ number, number ][],
	origin: [ number, number ]
};

interface Props {
	/** The iota data. */
	data: string;

	/** Whether or not the iota is active. This causes patterns to jitter and other types to glow. */
	active: boolean;

	/** The scale of the element in pixels. Defaults to 64 */
	scale: number;

	/** The start color of the iota's gradient. */
	activeStartColor?: string;

	/** The end color of the iota's gradient. */
	activeEndColor?: string;

	/** The inactive color of the iota.  */
	inactiveColor?: string;

	/** Triggered when the element is clicked. */
	onClick?: () => void;

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

const identifier = 'indieweb:iota';

function getType(iota: string): Type {
	if (iota === 'NULL') return 'null';
	if (iota.startsWith('[') || iota.startsWith(']')) return 'list';
	if (iota === 'arimfexendrapuse') return 'garbage';
	if (iota.startsWith('HexPattern')) return 'pattern';
	if (iota.match(/^\d+(?:.\d+)?$/)) return 'number';
	if (iota.match(/^\( ?\d+(?:.\d+)?, ?\d+(?:.\d+)?, ?\d+(?:.\d+)? ?\)$/)) return 'vector';
	return 'entity';
}

function processPatternIota(props: Props): PatternData {
	const [ start, turns ] = props.data.replace(/^HexPattern\(/, '').replace(/\)$/, '').split(' ');

	const startDir = DIRECTIONS[start];
	let pos = [ MOVEMENTS[startDir][0], MOVEMENTS[startDir][1] ];
	let bounds = [ Math.min(0, pos[0]), Math.min(0, pos[1]), Math.max(0, pos[0]), Math.max(0, pos[1]) ];

	const shape: Direction[] = [ startDir ];

	for (const i of (turns ?? '').split('')) {
		const dir = ((shape[shape.length - 1] + OFFSETS[i] + 6) % 6) as Direction;
		pos = [ pos[0] + MOVEMENTS[dir][0], pos[1] + MOVEMENTS[dir][1] ];
		bounds = [ Math.min(bounds[0], pos[0]), Math.min(bounds[1], pos[1]),
			Math.max(bounds[2], pos[0]), Math.max(bounds[3], pos[1]) ];
			shape.push(dir);
	}

	const scale = Math.min(props.scale / (Math.max(bounds[2] - bounds[0], bounds[3] - bounds[1]) +
		(props.strokeWidth / (props.scale / props.maxPatternWidth))),
		props.scale / props.maxPatternWidth);
	const scaledSize = [ (bounds[2] - bounds[0]) * scale, (bounds[3] - bounds[1]) * scale ];
	const origin = [ (bounds[0] + bounds[2]) / 2 * scale, (bounds[1] + bounds[3]) / 2 * scale ];

	const width = props.scale;
	const height = scaledSize[1] + props.strokeWidth;

	const points: [ number, number ][] = [ [ width / 2 - origin[0], height / 2 - origin[1] ] ];

	for (const dir of shape) {
		const last = points[points.length - 1];
		const change = MOVEMENTS[dir];
		points.push([ (last[0] + change[0] * scale), last[1] + change[1] * scale ]);
	}

	return {
		bounds,
		shape,
		scale,
		scaledSize,
		points,
		origin
	} as PatternData;
}

export const Pattern = memo(function Pattern(props: Props) {
	props.scale ??= 64;
	props.strokeWidth ??= props.scale / 16;
	props.maxPatternWidth ??= 3;
	props.lineSegments ??= 4;
	props.jitterIntensity ??= props.scale / 32;

	if (typeof window === 'undefined') props.lineSegments = 1;

	const animationRef = useRef<number>(0);
	const ref = useRef<HTMLDivElement>(null);

	const pattern = useMemo(() => processPatternIota(props), [ props ]);

	const id = useMemo(() => Date.now() + Math.random(), []);

	const basePath = `M ${pattern.points[0][0].toFixed(1)} ${pattern.points[0][1].toFixed(1)}` +
		`${pattern.points.slice(1).map(p => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')}`;

	useEffect(() => {
		const path = ref.current!.querySelector('svg path') as SVGPathElement;

		if (!props.active && animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = 0;

			path.setAttribute('d', basePath);
			ref.current!.querySelector('.indicator')?.remove();
		}
		else if (props.active && !animationRef.current) {
			let animationOffset = 0;

			const len = path.getTotalLength();

			const dupe = path.cloneNode() as SVGPathElement;
			dupe.classList.add('indicator');
			ref.current!.querySelector('svg g')!.appendChild(dupe);

			dupe.setAttribute('stroke-dasharray', (len + 200).toString());
			dupe.style.setProperty('--length', (len + 200).toString());

			setTimeout(() => ref.current?.classList.add('glow'), 1600);
			setTimeout(() => ref.current!.querySelector('.indicator')?.remove(), 3200);

			function animate() {
				let d = `M ${pattern.points[0][0].toFixed(1)} ${pattern.points[0][1].toFixed(1)} `;

				for (let i = 1; i < pattern.points.length; i++) {
					const a = pattern.points[i - 1];
					const b = pattern.points[i];

					for (let j = 1; j <= props.lineSegments - 1; j++) {
						const off = i * props.lineSegments + j;
						d += `L ${((a[0] + (b[0] - a[0]) * j / props.lineSegments) +
								Noise[(animationOffset - off + Noise.length) % Noise.length] * props.jitterIntensity).toFixed(1)} ` +
							`${(a[1] + (b[1] - a[1]) * j / props.lineSegments +
								Noise[(animationOffset - off + Noise.length) % Noise.length] * props.jitterIntensity).toFixed(1)} `;
					}

					d += `L ${b[0].toFixed(1)} ${b[1].toFixed(1)} `;
				}

				path.setAttribute('d', d);
				dupe.setAttribute('d', d);
				window.cancelAnimationFrame(animationRef.current);
				animationOffset++;
				animationRef.current = requestAnimationFrame(animate);
			}

			animate();
		}

	}, [ props.active, pattern, props.jitterIntensity, props.lineSegments, basePath ]);

	const width = props.scale;
	const height = pattern.scaledSize[1] + props.strokeWidth;

	function handleClick(evt: MouseEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		props.onClick?.();
	}

	return (
		<div ref={ref} class={`${identifier} pattern ${props.active ? 'active' : ''}`}>
			<svg xmlns='http://www.w3.org/2000/svg'
				width={width}
				height={height}
				fill='transparent'
				strokeWidth={props.strokeWidth}
				strokeLinecap='round'
				strokeLinejoin='bevel'
				style={
					(true && `--gradient-url: url(#g-${id});`) +
					(props.inactiveColor ? `--inactive-color: ${props.inactiveColor};` : '') +
					(props.activeStartColor ? `--active-start-color: ${props.activeStartColor};` : '') +
					(props.activeEndColor ? `--active-end-color: ${props.activeEndColor};` : '')}
			>
				<defs>
					<linearGradient id={`g-${id}`} x1='20%' y1="0%" x2='80%' y2='100%'
						gradientUnits='userSpaceOnUse'>
						<stop offset='20%'/>
						<stop offset='100%'/>
					</linearGradient>
				</defs>

				<g>
					<rect width={width} height={height} onClick={handleClick}/>
					<path d={basePath}/>
				</g>
			</svg>
		</div>
	);
});

export function Iota(props: Props) {
	const type = getType(props.data);

	switch (type) {
		default: {
			return (
				<div class={`${identifier} unknown`}>
					{props.data}
				</div>
			);
		}
		case 'list': {
			// return <Pattern {...props} data={props.data === '['
			// 	? 'HexPattern(NORTH_EAST ewe)'
			// 	: 'HexPattern(SOUTH_EAST qwq)'}
			// 	activeStartColor='rgb(255, 255, 122)'
			// 	activeEndColor='rgb(255, 153, 0)'/>
			return <Pattern {...props} data={props.data === '['
				? 'HexPattern(WEST qqq)'
				: 'HexPattern(EAST eee)'}
				activeStartColor='rgb(255, 255, 122)'
				activeEndColor='rgb(255, 153, 0)'/>
		}
		case 'pattern': {
			// if (props.data === 'HexPattern(WEST qqqaw)') {
			// 	return <Pattern {...props} activeStartColor='rgb(255, 255, 122)' activeEndColor='rgb(255, 153, 0)'/>
			// }
			return <Pattern {...props} />;
		}
	}
}

const HydratedIota = hydrate(identifier, Iota as FunctionalComponent);

export default { identifier, component: HydratedIota }
