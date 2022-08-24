import { tw } from 'dashboard';
import { useRef, useContext } from 'preact/hooks';
import { h, ComponentChildren, Fragment } from 'preact';

import SnapPoint from '../SnapPoint';
import { ElementContext } from '../Element';

export interface Props {
	gap: number;
	horizontal?: boolean;
	children: ComponentChildren;
}

export function Stack(props: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const element = useContext(ElementContext);
	const path = `${element.path}.children`;

	return (
		<div ref={ref} class={tw`flex ${!props.horizontal && 'flex-col'} w-full`}>
			{/* <SnapPoint path={path} ind={0} xStretch yOff={-8} /> */}
			<SnapPoint
				path={`${path}[0]`}
				xStretch={!props.horizontal}
				yStretch={props.horizontal}
				yOff={props.horizontal ? 0 : -8}
				xOff={props.horizontal ? -8 : 0}
			/>
			{(Array.isArray(props.children) ? props.children : [props.children]).map(
				(child, i) => (
					<Fragment key={i}>
						{i !== 0 && (
							<div class={tw`Gap~(w-[${props.gap / 4}rem] h-[${props.gap / 4}rem])`} />
						)}
						{child}
						<SnapPoint
							path={`${path}[${i + 1}]]`}
							xStretch={!props.horizontal}
							yStretch={props.horizontal}
							yOff={props.horizontal ? 0 : 8}
							xOff={props.horizontal ? 8 : 0}
						/>
					</Fragment>
				)
			)}
		</div>
	);
}
