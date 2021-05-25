import * as Preact from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

import './DimensionTransition.sass';

interface Props {
	mode?: 'width' | 'height' | 'all';
	duration?: number;

	style?: any;
	children?: Preact.ComponentChildren;
}

export default function DimensionTransition(props: Props) {
	const ref = useRef<HTMLDivElement>(null);

	const [ dimensions, setDimensions ] = useState<{ x: number; y: number }>({} as any);

	useEffect(() => {
		const onChange = () => {
			const elem = ref.current!;
			setDimensions({ x: elem.offsetWidth, y: elem.offsetHeight });
		};

		const observer = new MutationObserver(onChange);
		observer.observe(ref.current!, { attributes: true, childList: true, subtree: true });
		window.requestAnimationFrame(() => onChange());

		return () => observer.disconnect();
	}, []);

	let appliedOuterStyles: any = {};
	if (props.mode !== 'height') appliedOuterStyles.width = dimensions?.x;
	if (props.mode !== 'width') appliedOuterStyles.height = dimensions?.y;

	let appliedInnerStyles: any = { width: 'min-content', height: 'min-content' };
	if (props.mode === 'height') appliedInnerStyles.width = 'auto';
	if (props.mode === 'width') appliedInnerStyles.height = 'auto';

	return <div className="DimensionTransition" style={Object.assign(appliedOuterStyles, props.style, {
		transition: `width ${(props.duration || 300) / 1000}s, height ${(props.duration || 300) / 1000}s`})}>
		<div className="DimensionTransition-Inner" style={appliedInnerStyles} ref={ref}>
			{props.children}
		</div>
	</div>;
}
