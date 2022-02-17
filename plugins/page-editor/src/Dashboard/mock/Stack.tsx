import { tw } from 'dashboard';
import { useRef, useContext } from 'preact/hooks';
import { h, ComponentChildren, Fragment } from 'preact';

import SnapPoint from '../SnapPoint';
import { ElementContext } from '../Element';

export interface Props {
	gap: number;
	children: ComponentChildren;
}

export function Stack(props: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const element = useContext(ElementContext);
	const path = `${element.path}.children`;

	return (
		<div ref={ref} class={tw`flex flex-col w-full p-4`}>
			<SnapPoint path={path} ind={0} xStretch yOff={-8} />
			{(Array.isArray(props.children) ? props.children : [props.children]).map(
				(child, i) => (
					<Fragment key={i}>
						{i !== 0 && (
							<div class={tw`Gap~(w-[${props.gap / 4}rem] h-[${props.gap / 4}rem])`} />
						)}
						{child}
						<SnapPoint path={path} ind={i + 1} xStretch yOff={8} />
					</Fragment>
				)
			)}
		</div>
	);
}
