import { hydrate } from 'hydrated';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

import Noise from './Noise';

const identifier = 'indieweb:iota';

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
	data: string;
}

interface Props {
	/** The iota data. */
	data: string;

	/** Whether or not the iota is active. This causes patterns to jitter and other types to glow. */
	active: boolean;

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

function getType(iota: string): Type {
	if (iota === 'NULL') return 'null';
	if (iota.startsWith('[')) return 'list';
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

	const scale = Math.min(props.scale / ((bounds[2] - bounds[0]) +
		(props.strokeWidth / (props.scale / props.maxPatternWidth))),
		props.scale / props.maxPatternWidth);
	const scaledSize = [ (bounds[2] - bounds[0]) * scale, (bounds[3] - bounds[1]) * scale ];
	const origin = [ (bounds[0] + bounds[2]) / 2 * scale, (bounds[1] + bounds[3]) / 2 * scale ];

	const width = props.scale;
	const height = scaledSize[1] + props.strokeWidth;

	const points: [ number, number ][] = [ [ width / 2 - origin[0], height / 2 - origin[1] ] ];

	for (const dir of shape) {
		// for (let i = 0; i < props.lineSegments; i++) {
			const last = points[points.length - 1];
			const change = MOVEMENTS[dir];
			points.push([ (last[0] + change[0] * scale), last[1] + change[1] * scale ]);
		// }
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

export function Pattern(props: Props) {
	props.scale ??= 64;
	props.strokeWidth ??= props.scale / 16;
	props.maxPatternWidth ??= 3;
	props.lineSegments ??= 8;
	props.jitterIntensity ??= props.scale / 32;

	if (typeof window === 'undefined') props.lineSegments = 1;

	const [ mounted, setMounted ] = useState<boolean>(false);
	useEffect(() => setMounted(true), []);

	const animationRef = useRef<number>(0);
	const [ animationOffset, setAnimationOffset ] = useState<number>(0);

	const pattern = useMemo(() => {
		console.log('processing');
		return processPatternIota(props);
	}, [ props ]);

	const width = props.scale;
	const height = pattern.scaledSize[1] + props.strokeWidth;

	let path = '';

	if (!('window' in globalThis) && props.active) {
		console.log(pattern);
	}

	if (!mounted || !props.active) {
		if (animationRef.current) {
			window.cancelAnimationFrame(animationRef.current);
			animationRef.current = 0;
		}

		path = `M ${pattern.points[0][0].toFixed(1)} ${pattern.points[0][1].toFixed(1)}` +
			`${pattern.points.slice(1).map(p => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')}`;
	}
	else {
		path = `M ${pattern.points[0][0]} ${pattern.points[0][1]} `;

		for (let i = 1; i < pattern.points.length; i++) {
			const a = pattern.points[i - 1];
			const b = pattern.points[i];

			for (let j = 1; j <= props.lineSegments - 1; j++) {
				const off = i * props.lineSegments + j;
				path += `L ${((a[0] + (b[0] - a[0]) * j / props.lineSegments) +
						Noise[(animationOffset + off) % Noise.length] * props.jitterIntensity).toFixed(1)} ` +
					`${(a[1] + (b[1] - a[1]) * j / props.lineSegments +
						Noise[(animationOffset + off) % Noise.length] * props.jitterIntensity).toFixed(1)} `;
			}

			path += `L ${b[0].toFixed(1)} ${b[1].toFixed(1)} `;
		}

		window.cancelAnimationFrame(animationRef.current);
		animationRef.current = requestAnimationFrame(() => setAnimationOffset(offset => offset + 1));
	}

	return (
		<div class={`${identifier} pattern ${(props.active) ? 'active' : ''}`}>
			<svg xmlns='http://www.w3.org/2000/svg' width={width} height={height}
				fill='transparent' stroke='white' strokeWidth={props.strokeWidth}
				strokeLinecap='round' strokeLinejoin='bevel'>
				<g>
					<rect width={width} height={height}/>
					<path d={path}/>
				</g>
			</svg>
		</div>
	);
}

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
		case 'pattern': {
			return <Pattern {...props} />;
		}
	}

	// function handleRender(elem: HTMLDivElement | null) {
		// const paths = Array.from(elem?.querySelectorAll('path') ?? []);

		// let clicked = -1;
		// let jitterAnimationFrame: number | null = null;

		// const previousOffset = [ 0, 0 ];

		// let jitterOffset = 0;

		// function jitter() {
		// 	for (let i = 0; i <= clicked; i++) {
		// 		const path = paths[i];

		// 		let found = 0;

		// 		const d = paths[i].getAttribute('initialD')!.split(' ').map((section, i) => {
		// 			if (Number.isNaN(Number.parseFloat(section))) return section;
		// 			if (found++ < 2) return section;

		// 			let offset = JITTERS[(i + jitterOffset) % JITTERS.length] * props.jitterIntensity;

		// 			/** Don't jitter endpoints. */
		// 			if (Math.ceil(found / 2) % props.lineVertices === 1) {
		// 				offset = 0;
		// 			}

		// 			const prev = previousOffset[found % 2];
		// 			previousOffset[found % 2] = offset;
		// 			offset -= prev;

		// 			return (Number.parseFloat(section) + offset).toString();
		// 		}).join(' ');
		// 		path.setAttribute('d', d);
		// 	}

		// 	jitterOffset = (jitterOffset - 1 + JITTERS.length) % JITTERS.length;
		// 	jitterAnimationFrame = requestAnimationFrame(jitter);
		// }

		// function handleClick(i: number) {
		// 	clicked = i === clicked ? -1 : i;
		// 	console.log(clicked);

		// 	for (let i = 0; i <= clicked; i++) {
		// 		paths[i].classList.add('active');
		// 	}

		// 	for (let i = clicked + 1; i < paths.length; i++) {
		// 		paths[i].classList.remove('active');
		// 		paths[i].setAttribute('d', paths[i].getAttribute('initialD')!);
		// 	}

		// 	if (clicked === -1) {
		// 		window.cancelAnimationFrame(jitterAnimationFrame!);
		// 		jitterAnimationFrame = null;
		// 	}
		// 	else {
		// 		window.cancelAnimationFrame(jitterAnimationFrame!);
		// 		jitterAnimationFrame = window.requestAnimationFrame(jitter);
		// 	}
		// }

		// paths.forEach((path, i) => {
		// 	path.setAttribute('initialD', path.getAttribute('d') ?? '');
		// 	path.parentElement!.addEventListener('click', () => handleClick(i));
		// });
	// }
}

const HydratedIota = hydrate(identifier, Iota as FunctionalComponent);

export default { identifier, component: HydratedIota }
