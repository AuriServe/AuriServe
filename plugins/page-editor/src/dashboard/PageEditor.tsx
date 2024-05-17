import { h } from 'preact';
import { tw, AppContext, executeQuery, Graph, Spinner } from 'dashboard';
import { useContext, useLayoutEffect, useState } from 'preact/hooks';

import { Document, PageDocument } from 'pages';
import { useAsyncEffect } from 'vibin-hooks';
import Editor from './Editor';

let onThemeLoad: Set<() => void> | null = new Set();

/**
 * Loads the page stylesheet asynchronously, returing a promise that resolves when the stylesheet is loaded.
 * Will not load the stylesheet again if it has already been loaded, or is currently loading.
 * All calls to this function will resolve on load, even if it has already been triggered.
 */

async function loadTheme(): Promise<void> {
	if (onThemeLoad == null) return;

	const callback = new Promise<void>((resolve) => onThemeLoad!.add(resolve));
	const first = onThemeLoad.size === 1;

	if (first) {
		await Promise.all([
			fetch('/dashboard/res/page_theme.css').then(r => r.text()),
			fetch('/dashboard/res/page_head.html').then(r => r.text())
		]).then(([ css, head ]) => {
			const style = document.createElement('style');
			style.innerHTML = css;
			document.head.appendChild(style);

			const headTmp = document.createElement('head');
			headTmp.innerHTML = head;
			for (let i = headTmp.childNodes.length - 1; i >= 0; i--) document.head.appendChild(headTmp.childNodes[i]);

			onThemeLoad!.forEach(cb => cb());
			onThemeLoad = null;
		});
	}

	return callback;
}

/**
 * Loads the specified page and its layout from the server, returning a promise that resolves when the data is loaded.
 *
 * @param path - The page path to load.
 * @returns
 */

async function getPageAndLayout(path: string): Promise<[ PageDocument, string ]> {
	const { page: pageRaw } = await executeQuery(Graph.QUERY_PAGE, { path });
	if (!pageRaw) throw new Error('Page not found.');

	const page = JSON.parse(pageRaw.serialized);
	const { layout } = await executeQuery(Graph.QUERY_LAYOUT, { identifier: pageRaw.layout });

	return [ page, layout ];
}

/**
 * Renders an iframe with the page editor within it.
 */

export function PageEditorFrame() {
	const app = useContext(AppContext);
	useLayoutEffect(() => {
		app.setHijackScrollbar(false);
		return () => app.setHijackScrollbar(true);
	}, [ app ]);

	return (
		<div class={tw`flex cols-2`}>
			<iframe class={tw`w-full h-full`} src='/dashboard/page_editor_contents'/>
			{/* <div class={tw`w-72 shrink-0 flex-(& col) bg-gray-800 p-4 gap-2`}>
				<p>Happy</p>
			</div> */}
		</div>

	);
}

export default function PageEditor() {
	const app = useContext(AppContext);
	useLayoutEffect(() => {
		app.setShowChrome(false)
		app.setHijackScrollbar(false);
	});

	const [page, setPage] = useState<PageDocument | null>(null);
	const [layout, setLayout] = useState<string | null>(null);

	useAsyncEffect(async (abort) => {
		const [ [ page, layout ] ] = await Promise.all([
			getPageAndLayout('/home/auri/Code/AuriServe/server/site-data/pages/index.json'),
			loadTheme()
		]);

		if (abort.aborted) return;

		setPage(page);
		setLayout(layout);
	}, []);

	if (!page || !layout) return (
		<Spinner/>
	);

	return (
		<Editor initialPage={page} layout={layout}/>
	);
}
