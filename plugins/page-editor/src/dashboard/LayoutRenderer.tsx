import { Document, PageDocument } from 'pages';
import { tw } from 'dashboard';
import { Fragment, h } from 'preact';
import { memo, createPortal } from 'preact/compat';
import { useLayoutEffect, useRef, useState } from 'preact/hooks';

import Element from './Element';

export type LayoutPoints = Record<string, HTMLElement>;

const HTMLRenderer = memo(function HTMLRenderer(props: { layout: string, setPoints: (points: LayoutPoints) => void }) {
	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;

		const points = Array.from(ref.current.querySelectorAll('[data-include]')) as HTMLElement[];
		props.setPoints(Object.fromEntries(points.map(point => [ point.dataset.include, point ])));
	});

	console.error('Rendering HTML!');

	return (
		<div ref={ref} id='page' class={tw`bg-white`} dangerouslySetInnerHTML={{ __html: props.layout }}/>
	);
}, (prev, next) => prev.layout === next.layout);

const ElementRenderer = memo(function ElementRenderer(props: { page: PageDocument, points: LayoutPoints }) {
	console.error('Rendering Elements!');

	return (
		<Fragment>
			{Object.entries(props.points)
				.filter(([ identifier ]) => identifier in props.page.content.sections)
				.map(([ identifier, node ]) => createPortal(
					<Element node={props.page.content.sections[identifier]} path={`content.sections.${identifier}`} />, node))}
		</Fragment>
	);
}, (prev, next) => prev.page === next.page && prev.points === next.points);

interface Props {
	page: PageDocument;
	layout: string;
}

export default function LayoutRenderer({ layout, page }: Props) {
	const [ points, setPoints ] = useState<LayoutPoints>({});

	return (
		<Fragment>
			<HTMLRenderer layout={layout} setPoints={setPoints} />
			<ElementRenderer page={page} points={points} />
		</Fragment>
	);
}
