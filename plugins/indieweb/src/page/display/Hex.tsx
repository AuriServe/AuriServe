// import { FunctionalComponent, h } from 'preact';
// import { Static, hydrate } from 'hydrated';

// const identifier = 'indieweb:hex';

// type Direction = 0 | 1 | 2 | 3 | 4 | 5;

// const JITTERS = [0,0,-4.5955534987007785e-23,-2.12178656610285e-10,-2.503937351868984e-7,-0.000012409213821036336,-0.00015307973020827463,-0.0008356243062539153,-0.0025855844139660925,-0.0050703743614016325,-0.006482253096764044,-0.0050619439287002445,-0.001802523703099429,-0.000044846918785288855,0.0005594627129893093,0.011046362883491482,0.052292898178230816,0.14529161909376576,0.29656339874002646,0.4837840697423171,0.6539218050192482,0.7437418894006655,0.7152749108268918,0.5818383342779199,0.39849653502290383,0.22672485596280806,0.10420845789955004,0.03655796563603224,0.008545013169989558,0.0008338055336889595,1.2136296296264679e-9,-0.0002225376699780353,-0.0007237030318288193,-0.0004004337093122018,-8.390938528652032e-7,0.0008896622706474282,0.011953084090607333,0.05029270291121489,0.12334535255679814,0.21263690419093378,0.2774502569164306,0.2807560855348859,0.21917198522271114,0.12736390277415885,0.05053841220736676,0.01101030673754741,0.0004853037143541924,-0.00018959064284728837,-0.006599432946697324,-0.0305122742225308,-0.07937239578561443,-0.15244271368078505,-0.237300928248645,-0.3111101606723839,-0.34797499353882394,-0.32986700001868585,-0.2569088866081278,-0.15268708385400012,-0.058300757157475784,-0.008480371218412146,-1.34936472951795e-42,0.008480371218409536,0.05830075715746775,0.15268708385398871,0.25690865383020517,0.3298216853299622,0.34772884392921033,0.3106333783910614,0.23681841456371033,0.1521952798817684,0.07937285181427806,0.03059904414435151,0.00664501130817668,0.00019308084326137752,-0.00048237563531025953,-0.011007175133715737,-0.05073952643033076,-0.1289451825298468,-0.22375139435206415,-0.2866399712071135,-0.27745025691643743,-0.19952104443815322,-0.09932130820515747,-0.0286184492785522,-0.0026238693270241335,0.0000023600903428197767,0.001886367346014174,0.005480938314193539,0.004583007315010037,0.000995147890483853,-7.767229629534294e-8,-0.0017687831334902528,-0.011633051643947637,-0.02897296280607934,-0.04464662887572584,-0.049182014552465195,-0.040827385416144966,-0.025960529666447428,-0.012640147897269464,-0.0046668065481412675,-0.001255454405655253,-0.00022220735711242463,-0.000021489156523852412,-7.827217618989696e-7,-4.34709519531965e-9,-2.5775164961828314e-12,-5.036094191212844e-11,-5.707731722166827e-10,-2.242247601382793e-9,-4.145332753855441e-9,-4.105488799321371e-9,-2.203651252665329e-9,-5.922976672904452e-10,-6.595906612296137e-11,-1.9258776968254344e-12,-3.959544003018237e-15,-2.621440000024273e-22,0,0,0,0,0,0,0,-2.621439999972932e-22,-3.9595440030000906e-15,-1.9258776968208163e-12,-6.595906612286463e-11,-5.922976672899065e-10,-2.2036512526642143e-9,-4.086525832594403e-9,-3.903885332254634e-9,-1.7740218265442835e-9,-3.0239878883146676e-10,-9.436802169385295e-12,-2.0244034572596747e-50,-9.153092207184307e-9,-0.0000014385318101184477,-0.00003268232092816628,-0.0002760475053424861,-0.0012554544056542962,-0.0036935586262948268,-0.007775574012257869,-0.012340287728583935,-0.015257885289383677,-0.015166311828798561,-0.012579199939137461,-0.009175893814453785,-0.006380800796909696,-0.00473855633912644,-0.004225337962962953,-0.004763073371332136,-0.006424235569775902,-0.009221506233722627,-0.012606136861760514,-0.015172128508392809,-0.015257920723292823,-0.012340287728587265,-0.007775574012261542,-0.0036935586262974393,-0.0012554544056555495,-0.0002760475053428696,-0.000032682320928229355,-0.0000014385879774425395,-9.216482828411783e-9,3.167635202349407e-14,-2.2509173066700607e-8,-0.000007362558378425914,-0.00023351304918957605,-0.0024586806255371273,-0.013295140123176655,-0.04535348397961479,-0.10898025183564733,-0.19622252401967671,-0.27341577923613086,-0.29763781237032433,-0.2493420832152721,-0.1521764942607671,-0.05830074100088593,-0.008480371218414766,-2.558795338937742e-41,0.008480371218407784,0.058300724844268084,0.15166704422147834,0.2419264540928351,0.26781594972878975,0.21167164793211007,0.11625925910812257,0.040178800448279095,0.006614384943441927,0.00015438114065710525,-0.000038697259324032184,-0.00019483526028635137,-0.000003268791882547136,0.000629787118058131,0.01103224459716634,0.05054916148984709,0.12736447180194255,0.21917198522272097,0.2807560855348906,0.27745025691642666,0.21263690419092096,0.1234025936229803,0.050655423371239974,0.012397092039236083,0.001027434901079705,-1.335660379876618e-7,-0.00042813555047636475,-0.0011954043085838472,-0.0010656352813352928,-0.0004825052213701774,-0.0000818708044445578,-0.000005859409227516224,-2.099274099144391e-8,5.769600797713819e-8,1.0049979334027425e-7,2.1864309025280144e-8,6.937755307070786e-10,4.563649590889056e-13,0,0,0,0,-9.6679735286734e-21,-6.42792655697206e-16,-5.0300873816085497e-14,-3.649321659094227e-13,-5.760805819148992e-13,-2.1680740393606289e-13,-1.1628815866453069e-14,-8.711464921973366e-18,0,0,0,0,0,0,0,0,0,0,0,0,0,1.6777216000460448e-20,1.069076880819155e-13,2.446577963008825e-11,4.2248416405917156e-10,1.999004627106203e-9,4.023401669818566e-9,4.111822799951627e-9,2.3207630832467243e-9,7.287149171686373e-10,1.1567761176253074e-10,7.515400178985295e-12,-1.466497779225773e-16];

// const DIRECTIONS: Record<string, Direction> = {
// 	NORTH_EAST: 0,
// 	EAST: 1,
// 	SOUTH_EAST: 2,
// 	SOUTH_WEST: 3,
// 	WEST: 4,
// 	NORTH_WEST: 5,
// };

// const OFFSETS: Record<string, number> = {
// 	a: -2,
// 	q: -1,
// 	w: 0,
// 	e: 1,
// 	d: 2
// };

// const DIAGONAL_Y = .866;
// const DIAGONAL_X = .5;

// const MOVEMENTS: Record<Direction, [ number, number ]> = {
// 	0: [ DIAGONAL_X, -DIAGONAL_Y ],
// 	1: [ 1, 0 ],
// 	2: [ DIAGONAL_X,  DIAGONAL_Y ],
// 	3: [-DIAGONAL_X,  DIAGONAL_Y ],
// 	4: [-1, 0 ],
// 	5: [-DIAGONAL_X, -DIAGONAL_Y ]
// }

// interface PatternData {
// 	bounds: [ number, number, number, number ],
// 	pattern: Direction[],
// 	scale: number,
// 	scaledSize: [ number, number ],
// 	origin: [ number, number ]
// };

// interface HexData {
// 	patterns: PatternData[];
// 	width: number;
// 	height: number;
// }

// interface Props {
// 	/** The pattern data. */
// 	data: string;

// 	/** The scale of a line segment in pixels. Default: 20 */
// 	scale: number;

// 	/** The stroke width of the lines. Default: 2 */
// 	strokeWidth: number;

// 	/** The max horizontal width in segments that a pattern can be before it is scaled down. Default: 3 */
// 	maxPatternWidth: number;

// 	/** The gap in pixels between patterns. Default: scale * 1.5 */
// 	gap: number;

// 	/** The padding in pixels around the whole hex. Default: 32 */
// 	padding: number;

// 	/** The number of vertices per line. Default: 8 */
// 	lineVertices: number;

// 	/** The jitter intensity. Default: 5 */
// 	jitterIntensity: number;
// }

// function generateHexData(props: Props): HexData {
// 	const patterns = props.data
// 		.replace(/^\[/, '')
// 		.replace(/\]$/, '')
// 		.split(',')
// 		.map(p => p.trim())
// 		.filter(p => p.startsWith('HexPattern'))
// 		.map(p => p.replace(/^HexPattern\(/, '').replace(/\)$/, ''))
// 		.map(p => {
// 			const [ start, turns ] = p.split(' ');

// 			const bounds = [ 0, 0, 0, 0 ];
// 			const pos = [ 0, 0 ];

// 			const startDir = DIRECTIONS[start];
// 			pos[0] += MOVEMENTS[startDir][0];
// 			pos[1] += MOVEMENTS[startDir][1];

// 			bounds[0] = Math.min(bounds[0], pos[0]);
// 			bounds[1] = Math.min(bounds[1], pos[1]);
// 			bounds[2] = Math.max(bounds[2], pos[0]);
// 			bounds[3] = Math.max(bounds[3], pos[1]);

// 			const pattern: Direction[] = [ startDir ];

// 			for (const i of (turns ?? '').split('')) {
// 				const dir = ((pattern[pattern.length - 1] + OFFSETS[i] + 6) % 6) as Direction;

// 				pos[0] += MOVEMENTS[dir][0];
// 				pos[1] += MOVEMENTS[dir][1];

// 				bounds[0] = Math.min(bounds[0], pos[0]);
// 				bounds[1] = Math.min(bounds[1], pos[1]);
// 				bounds[2] = Math.max(bounds[2], pos[0]);
// 				bounds[3] = Math.max(bounds[3], pos[1]);

// 				pattern.push(dir);
// 			}

// 			const scale = Math.min(1, (props.maxPatternWidth /
// 				Math.max(bounds[2] - bounds[0], bounds[3] - bounds[1]))) * props.scale;

// 			const scaledSize = [ (bounds[2] - bounds[0]) * scale, (bounds[3] - bounds[1]) * scale ];

// 			const origin = [ (bounds[0] + bounds[2]) / 2 * scale, (bounds[1] + bounds[3]) / 2 * scale ];

// 			return {
// 				bounds,
// 				pattern,
// 				scale,
// 				scaledSize,
// 				origin
// 			} as PatternData;
// 		});

// 	const width = props.maxPatternWidth * props.scale + props.padding * 2
// 	const height = patterns.reduce((acc, p) => acc + p.scaledSize[1] + props.gap, 0) - props.gap + props.padding * 2;

// 	return {
// 		patterns,
// 		width,
// 		height
// 	};
// }

// export function RawHex(props: Props) {
// 	props.scale ??= 20;
// 	props.strokeWidth ??= 2;
// 	props.maxPatternWidth ??= 3;
// 	props.gap ??= props.scale * 1.5;
// 	props.padding ??= 32;
// 	props.lineVertices ??= 5;
// 	props.data ??= '[]';
// 	props.jitterIntensity ??= 5;

// 	const data = generateHexData(props);

// 	const x = props.maxPatternWidth * props.scale / 2 + props.padding;
// 	let y = props.padding;

// 	function handleRender(elem: HTMLDivElement | null) {
// 		const paths = Array.from(elem?.querySelectorAll('path') ?? []);

// 		let clicked = -1;
// 		let jitterAnimationFrame: number | null = null;

// 		const previousOffset = [ 0, 0 ];

// 		let jitterOffset = 0;

// 		function jitter() {
// 			for (let i = 0; i <= clicked; i++) {
// 				const path = paths[i];

// 				let found = 0;

// 				const d = paths[i].getAttribute('initialD')!.split(' ').map((section, i) => {
// 					if (Number.isNaN(Number.parseFloat(section))) return section;
// 					if (found++ < 2) return section;

// 					let offset = JITTERS[(i + jitterOffset) % JITTERS.length] * props.jitterIntensity;

// 					/** Don't jitter endpoints. */
// 					if (Math.ceil(found / 2) % props.lineVertices === 1) {
// 						offset = 0;
// 					}

// 					const prev = previousOffset[found % 2];
// 					previousOffset[found % 2] = offset;
// 					offset -= prev;

// 					return (Number.parseFloat(section) + offset).toString();
// 				}).join(' ');
// 				path.setAttribute('d', d);
// 			}

// 			jitterOffset = (jitterOffset - 1 + JITTERS.length) % JITTERS.length;
// 			jitterAnimationFrame = requestAnimationFrame(jitter);
// 		}

// 		function handleClick(i: number) {
// 			clicked = i === clicked ? -1 : i;
// 			console.log(clicked);

// 			for (let i = 0; i <= clicked; i++) {
// 				paths[i].classList.add('active');
// 			}

// 			for (let i = clicked + 1; i < paths.length; i++) {
// 				paths[i].classList.remove('active');
// 				paths[i].setAttribute('d', paths[i].getAttribute('initialD')!);
// 			}

// 			if (clicked === -1) {
// 				window.cancelAnimationFrame(jitterAnimationFrame!);
// 				jitterAnimationFrame = null;
// 			}
// 			else {
// 				window.cancelAnimationFrame(jitterAnimationFrame!);
// 				jitterAnimationFrame = window.requestAnimationFrame(jitter);
// 			}
// 		}

// 		paths.forEach((path, i) => {
// 			path.setAttribute('initialD', path.getAttribute('d') ?? '');
// 			path.parentElement!.addEventListener('click', () => handleClick(i));
// 		});
// 	}

// 	return (
// 		<div ref={handleRender} class={identifier}>
// 			<Static>
// 				<svg xmlns='http://www.w3.org/2000/svg' width={data.width} height={data.height}
// 					fill='transparent' stroke='white' strokeWidth={props.strokeWidth}
// 					strokeLinecap='round' strokeLinejoin='bevel'>

// 					{data.patterns.map((pattern, i) => {
// 						let path = `M ${x - pattern.origin[0]} ${y - pattern.origin[1] + pattern.scaledSize[1] / 2} `;

// 						for (const dir of pattern.pattern) {
// 							for (let i = 0; i < props.lineVertices; i++) {
// 								path += `l ${MOVEMENTS[dir].map(m => (m * pattern.scale * (1 / props.lineVertices)).toFixed(1)).join(' ')} `;
// 							}
// 						}

// 						const res = (
// 							<g key={i}>
// 								<rect x={props.padding} y={y} width={data.width - props.padding * 2} height={pattern.scaledSize[1]}/>
// 								<path d={path}/>
// 							</g>
// 						);

// 						y += pattern.scaledSize[1] + props.gap;

// 						return res;
// 					})}
// 				</svg>
// 			</Static>
// 		</div>
// 	)
// }

// const Hex = hydrate(identifier, RawHex as FunctionalComponent, (props: Props) => ({
// 	lineVertices: props.lineVertices
// }));

// export default { identifier, component: Hex }
