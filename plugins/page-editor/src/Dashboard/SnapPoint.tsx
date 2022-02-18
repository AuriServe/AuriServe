import { h } from 'preact';
import { tw } from 'dashboard';
import { EditorContext } from './Editor';
import { useContext } from 'preact/hooks';

// export default interface SnapPoint {
// 	x: number;
// 	y: number;
// 	width: number;
// 	height: number;
// 	path: [string, number];
// }

export interface Props {
	path: string;

	xStretch?: boolean;
	yStretch?: boolean;
	xOff?: number;
	yOff?: number;
}

export default function SnapPoint(props: Props) {
	const editor = useContext(EditorContext);

	if (!editor.placing) return null;
	return (
		<div
			onMouseUp={() => editor.addNode(props.path)}
			class={tw`SnapPoint~(relative ${props.yStretch && 'h-full -left-0.5 z-100'}
				${props.xStretch && 'w-full -top-0.5'})`}>
			<div
				class={tw`absolute w-[calc(100%+3rem)] h-[calc(100%+3rem)] peer`}
				style={{
					left: (props.xOff ?? 0) - 24,
					top: (props.yOff ?? 0) - 24 + 2,
				}}
			/>
			<div
				class={tw`absolute bg-accent-500/5 border-(2 accent-400) rounded shadow-sm w-full h-full interact-none
					opacity-0 scale-[98%] peer-hover:opacity-100 peer-hover:scale-100 transition`}
				style={{
					left: props.xOff ?? 0,
					top: props.yOff ?? 0,
				}}
			/>
		</div>
	);
}
