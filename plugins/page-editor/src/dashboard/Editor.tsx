import { Page, Node } from 'pages';
import { h, createContext } from 'preact';
import { useAsyncEffect } from 'vibin-hooks';
import { useState, useMemo, useCallback } from 'preact/hooks';
import { traversePath, buildPath, splitPath, assert } from 'common';
import { tw, TransitionGroup, executeQuery, Graph } from 'dashboard';

import { BoundingBox } from './BoundingBox';
import LayoutRenderer from './LayoutRenderer';

let onStylesheetLoad: Set<() => void> | null = new Set();

/**
 * Loads the page stylesheet asynchronously, returing a promise that resolves when the stylesheet is loaded.
 * Will not load the stylesheet again if it has already been loaded, or is currently loading.
 * All calls to this function will resolve on load, even if it has already been triggered.
 */

async function loadStylesheet(): Promise<void> {
	if (onStylesheetLoad == null) return;

	const callback = new Promise<void>((resolve) => onStylesheetLoad!.add(resolve));
	const first = onStylesheetLoad.size === 1;

	if (first) fetch('/dashboard/res/theme.css').then(r => r.text()).then(css => {
		const style = document.createElement('style');
		style.innerHTML = css;
		document.head.appendChild(style);
		onStylesheetLoad!.forEach(cb => cb());
		onStylesheetLoad = null;
	});

	return callback;
}

async function getPageAndLayout(path: string): Promise<[ Page, string ]> {
	const { page: pageRaw } = await executeQuery(Graph.QUERY_PAGE, { path });
	if (!pageRaw) throw new Error('Page not found.');

	const page = JSON.parse(pageRaw.serialized);
	const { layout } = await executeQuery(Graph.QUERY_LAYOUT, { identifier: pageRaw.layout });

	return [ page, layout ];
}

export interface EditorContextData {
	page: Page;

	placing: boolean;
	clipboard: string | null;

	hoverElement: (path: string, bounds: BoundingBox) => void;
	unhoverElement: (path: string) => void;
	focusElement: (path: string, bounds: BoundingBox) => void;
	unfocusElement: (path: string) => void;

	copyNode: (path: string) => void;
	pasteNode: (path: string, position: 'before' | 'after' | 'over') => void;

	addNode: (path: string) => void;
	removeNode: (path: string) => void;
}

export const EditorContext = createContext<EditorContextData>(null as any);

export default function Editor() {
	const [page, setPage] = useState<Page | null>(null);
	const [layout, setLayout] = useState<string | null>(null);

	const [placing, setPlacing] = useState<boolean>(false);
	const [clipboard, setClipboard] = useState<string | null>(null);

	const [hovered, setHovered] = useState<{ path: string, bounds: BoundingBox } | null>(null);
	const [focused, setFocused] = useState<{ path: string, bounds: BoundingBox } | null>(null);

	useAsyncEffect(async (abort) => {
		const [ [ page, layout ] ] = await Promise.all([
			getPageAndLayout('/home/auri/Code/AuriServe/server/site-data/pages/index.json'),
			loadStylesheet()
		]);

		if (abort.aborted) return;

		setPage(page);
		setLayout(layout);
	}, []);

	const startPlace = useCallback((e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		setPlacing(true);
	}, []);

	const handleEndPlace = useCallback((e: MouseEvent) => {
		setPlacing((placing) => {
			if (!placing) return false;
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			return false;
		});
	}, []);

	const addNode = useCallback(
		(path: string) => {
			assert(page, 'Cannot add node on an unloaded page.');
			const newPage = { ...page };

			const parentPathSegs = splitPath(path);
			const ind = parentPathSegs.pop();
			assert(typeof ind === 'number', 'Invalid path. [0]');
			const children: Node[] = traversePath(newPage, buildPath(...parentPathSegs));

			const node: Node = {
				element: 'Text',
				props: {
					text: `SnapPoint ${ind}`,
				},
			};

			children.splice(ind, 0, node);
			setPage(newPage);
		},
		[page]
	);

	const removeNode = useCallback(
		(path: string) => {
			assert(page, 'Cannot remove node on an unloaded page.');
			const newPage = { ...page };

			const parentPathSegs = splitPath(path);
			const ind = parentPathSegs.pop();
			assert(typeof ind === 'number', 'Invalid path. [0]');
			const parentPath = buildPath(...parentPathSegs);

			const children: Node[] = traversePath(newPage, parentPath);
			children.splice(ind as number, 1);
			setPage(newPage);
		},
		[page]
	);

	const focusElement = useCallback((path: string, bounds: BoundingBox) => {
		setFocused(focused => {
			if (focused?.path === path) return focused;
			// console.log('focus:', path);
			return { path, bounds };
		});
	}, []);

	const unfocusElement = useCallback((path: string) => {
		setFocused(focused => {
			if (focused?.path !== path) {
				console.error(path);
				return focused;
			}
			// console.log('unfocus:', path);
			return null;
		});
	}, []);

	const hoverElement = useCallback((path: string, bounds: BoundingBox) => {
		setHovered(hovered => {
			if (hovered?.path === path) return hovered;
			// console.log('hover:', path);
			return { path, bounds };
		});
	}, []);

	const unhoverElement = useCallback((path: string) => {
		setHovered(hovered => {
			if (hovered?.path !== path) {
				console.warn(path);
				return hovered;
			}

			// console.log('unhover:', path);
			return null;
		});
	}, []);

	const copyNode = useCallback(
		(path: string) => {
			const node = traversePath(page, path);
			setClipboard(JSON.stringify(node));
		},
		[page]
	);

	const pasteNode = useCallback(
		(target: string, position: 'before' | 'over' | 'after') => {
			assert(page, 'Cannot paste node on an unloaded page.');
			console.log('paste', target, position);

			const newPage = { ...page };

			const parentPathSegs = splitPath(target);
			const ind = parentPathSegs.pop();
			assert(typeof ind === 'number', 'Invalid path. [0]');
			const parentPath = buildPath(...parentPathSegs);

			const children: Node[] = traversePath(newPage, parentPath);
			if (position === 'over') children.splice(ind as number, 1, JSON.parse(clipboard!));
			else
				children.splice(position === 'before' ? ind : ind + 1, 0, JSON.parse(clipboard!));

			setPage(newPage);
		},
		[clipboard, page]
	);

	const ctxData: EditorContextData = useMemo(
		() => ({
			placing,
			page: page!,
			clipboard,

			hoverElement,
			unhoverElement,
			focusElement,
			unfocusElement,

			copyNode,
			pasteNode,

			addNode,
			removeNode,
		}),
		[hoverElement, unhoverElement, focusElement, unfocusElement,
			addNode, removeNode, copyNode, pasteNode, clipboard, placing, page]
	);

	if (!page || !layout) {
		return <p>Loading... </p>;
	}

	return (
		<div class={tw`gap-4 flex flex-col w-full`} onMouseUp={handleEndPlace}>
			<div
				class={tw`shrink-0 w-12 h-12 bg-gray-300 rounded cursor-grab`}
				onMouseDown={startPlace}
			/>
			<EditorContext.Provider value={ctxData}>
				<LayoutRenderer layout={layout} page={page}/>
			</EditorContext.Provider>
				{/* */}
			<TransitionGroup
				duration={300}
				enterFrom={tw`opacity-0 scale-[99.5%]`}
				enter={tw`transition duration-75 delay-150`}
				exit={tw`!opacity-0 !duration-[0ms] !delay-[0ms]`}
				exitFrom={tw`!opacity-0 !duration-[0ms] !delay-[0ms]`}
			>
				{hovered && hovered.path !== focused?.path && (
					<div
						key={hovered.path}
						class={tw`absolute border-(2 accent-500/25) rounded-lg interact-none`}
						style={{
							top: hovered.bounds.top - 4,
							left: hovered.bounds.left - 4,
							width: hovered.bounds.width + 8,
							height: hovered.bounds.height + 8,
						}}
					/>
				)}
			</TransitionGroup>
			<TransitionGroup
				duration={150}
				enterFrom={tw`opacity-0 scale-[99.5%]`}
				enter={tw`transition duration-150`}
				invertExit>
				{focused && (
					<div
						key={focused.path}
						class={tw`absolute border-(2 accent-400) ring-(& accent-500/25) rounded-lg interact-none`}
						style={{
							top: focused.bounds.top - 8,
							left: focused.bounds.left - 8,
							width: focused.bounds.width + 16,
							height: focused.bounds.height + 16,
						}}
					/>
				)}
			</TransitionGroup>
		</div>
	);
}
