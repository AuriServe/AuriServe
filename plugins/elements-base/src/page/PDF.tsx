import { h, VNode } from 'preact';
import { hydrate } from 'hydrated';
import { getCanonicalVariant } from 'media';
import { useEffect, useRef, useState } from 'preact/hooks';

const fs = ('window' in globalThis) ? undefined : require('fs');

import type { PDFDocumentProxy } from 'pdfjs-dist';

interface Props {
	media?: number;
	path?: string;
	maxScale?: number;
	inline?: boolean;
}

const identifier = 'base:pdf';

function PDFPage({ pdf, page: pageNum, maxScale }: { pdf: PDFDocumentProxy, page: number, maxScale?: number }) {
	const canvas = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		(async () => {
			if (!canvas.current) return;
			const page = await pdf.getPage(pageNum);
			let viewport = page.getViewport({ scale: 1 });
			const scale = Math.min(canvas.current.clientWidth / viewport.width, maxScale ?? 1);
			viewport = page.getViewport({ scale: scale * (window.devicePixelRatio ?? 1) });
			const context = canvas.current!.getContext('2d')!;
			canvas.current.width = viewport.width;
			canvas.current.height = viewport.height;
			canvas.current.style.maxWidth = `${viewport.width}px`;
			page.render({ canvasContext: context, viewport });
		})();
	}, [ pdf, pageNum, maxScale ]);

	return (
		<canvas class='page' ref={canvas}/>
	);
}

function toPath(path: string) {
	if (path.startsWith('/media/')) return path;
	return `/media/${path.slice(path.lastIndexOf('/') + 1)}`;
}

function RawPDF(props: Props) {
	const path = props.path?.startsWith('data:') ? props.path :
		toPath(props.path ?? getCanonicalVariant(props.media ?? -1)?.path ?? 'unknown');

	const [ pdf, setPDF ] = useState<PDFDocumentProxy | null>(null);

	useEffect(() => {
		import('pdfjs-dist')
			.then(({ getDocument, GlobalWorkerOptions }) => {
				GlobalWorkerOptions.workerSrc = '/res/elements-base/pdf_worker.js';
				if (path.startsWith('data')) {
					const start = Date.now();
					const raw = window.atob(path.substring(path.indexOf(';base64,') + ';base64,'.length));
					const array = new Uint8Array(new ArrayBuffer(raw.length));
					for (let i = 0; i < raw.length; i++) array[i] = raw.charCodeAt(i);
					const end = Date.now() - start;
					console.log(end);
					return getDocument(array).promise;
				}
				return getDocument(path).promise;
			})
			.then((pdf) => setPDF(pdf));
	}, [ path ]);

	if (!pdf) return (
		<div class={identifier}>
			<p class='loading'>
				Loading document...<br/>
				<a target='_blank' rel='noopener noreferrer' href={`/media/${path.slice(path.lastIndexOf('/') + 1)}`}>Download PDF</a>
			</p>
		</div>
	);

	const pages: VNode[] = [];
	for (let i = 1; i <= pdf.numPages; i++) pages.push(<PDFPage key={i} pdf={pdf} page={i} maxScale={props.maxScale}/>);

	return (
		<div class={identifier}>{pages}</div>
	);
}

const PDF = hydrate<Props>(identifier, RawPDF, (props) => {
	const path = props.inline
		? `data:application/pdf;base64,${fs.readFileSync(getCanonicalVariant(props.media!)!.path, 'base64')}`
		: toPath(props.path ?? getCanonicalVariant(props.media!)!.path);
	return {
		path,
		maxScale: props.maxScale
	};
});

export default { identifier, component: PDF };
