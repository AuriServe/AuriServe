import { h } from 'preact';
import { createPortal } from 'preact/compat';
import { useState, useEffect, useRef } from 'preact/hooks';

import { joinClass, merge } from '../../common/util';
import { identifier as baseIdentifier } from './Type';

const identifier = joinClass(baseIdentifier)`modal`;

interface Props {
	open: boolean;

	url: string;
	alt?: string;

	protect?: boolean;
	originalUrl: string;

	onClose: (evt: MouseEvent) => void;
}

export function Modal(props: Props) {
	const cn = joinClass(identifier);
	const metaRef = useRef<HTMLDivElement>(null);

	const padding = 32;

	const [ render, setRender ] = useState(false);
	const [ size, setSize ] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

	useEffect(() => {
		if (props.open) setRender(true);
		else setTimeout(() => setRender(false), 200);
	}, [ props.open ]);

	// useLayoutEffect(() => {
	// 	if (!render) return;

	// 	const computeSize = () => {
	// 		const ratio = Math.min(1, (window.innerWidth - padding * 2) / props.width,
	// 			(window.innerHeight - padding * 2 - (metaRef.current?.offsetHeight ?? 0)) / props.height);
	// 		setSize({ width: props.width * ratio, height: props.height * ratio });
	// 	}

	// 	computeSize();

	// 	window.addEventListener('resize', computeSize);
	// 	return () => window.removeEventListener('resize', computeSize);
	// }, [ props.width, props.height, metaRef, render ]);

	if (!render) return null;

	return createPortal(
		<div
			class={merge(identifier, props.open && cn`open`)}
			onClick={props.onClose}
		>
			<figure
				class={cn`content`}
				onClick={(evt) => evt.stopPropagation()}
				style={{
					// maxWidth: Math.min(props.maxWidth ?? Infinity, size.width)
				}}
			>
				<div
					class={cn`image`}
					style={{ width: size.width, height: size.height }}
				>
					<img
						// ref={imageRef}
						// src={props.path}
						width={size.width}
						height={size.height}
						alt={props.alt ?? ''}
						style={props.protect ? 'pointer-events: none; user-select: none;' : ''}
					/>
				</div>

				<div
					class={cn`meta`}
					ref={metaRef}
				>
					{props.alt &&
						<figcaption class={cn`alt`}>
							{props.alt}
						</figcaption>
					}
					{!props.protect &&
						<a
							class={cn`link`}
							href={props.originalUrl}
							target='_blank'
							rel='noopener noreferrer'
						>
							Open Original
						</a>
					}
				</div>
			</figure>
		</div>,
		document.getElementById('page')!
	)
}
