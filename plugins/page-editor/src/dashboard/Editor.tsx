import { Page, Node } from 'pages';
import { h, createContext } from 'preact';
import { tw, TransitionGroup } from 'dashboard';
import { useState, useMemo, useCallback } from 'preact/hooks';
import { traversePath, buildPath, splitPath, assert } from 'common';

import Element from './Element';
import { BoundingBox } from './BoundingBox';

import DEFAULT_PAGE from './mock/Page';

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
	const [page, setPage] = useState<Page>(DEFAULT_PAGE);
	const [placing, setPlacing] = useState<boolean>(false);
	const [clipboard, setClipboard] = useState<string | null>(null);

	const [hovered, setHovered] = useState<{ path: string, bounds: BoundingBox } | null>(null);
	const [focused, setFocused] = useState<{ path: string, bounds: BoundingBox } | null>(null);

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
			console.log('focus:', path);
			return { path, bounds };
		});
	}, []);

	const unfocusElement = useCallback((path: string) => {
		setFocused(focused => {
			if (focused?.path !== path) {
				console.error(path);
				return focused;
			}
			console.log('unfocus:', path);
			return null;
		});
	}, []);

	const hoverElement = useCallback((path: string, bounds: BoundingBox) => {
		setHovered(hovered => {
			if (hovered?.path === path) return hovered;
			console.log('hover:', path);
			return { path, bounds };
		});
	}, []);

	const unhoverElement = useCallback((path: string) => {
		setHovered(hovered => {
			if (hovered?.path !== path) {
				console.warn(path);
				return hovered;
			}

			console.log('unhover:', path);
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
			page,
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

	return (
		<div class={tw`gap-4 flex flex-col w-full`} onMouseUp={handleEndPlace}>
			<div
				class={tw`shrink-0 w-12 h-12 bg-gray-300 rounded cursor-grab`}
				onMouseDown={startPlace}
			/>
			<div id='page' class={tw`bg-white`}>
				<EditorContext.Provider value={ctxData}>
					<Element node={page.content.sections.main} path='content.sections.main' />
				</EditorContext.Provider>
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
		</div>
	);
}
