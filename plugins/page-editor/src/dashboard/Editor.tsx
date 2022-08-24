import { tw } from 'dashboard';
import { Page, Node } from 'pages';
import { h, createContext } from 'preact';
import { useState, useMemo, useCallback } from 'preact/hooks';
import { traversePath, buildPath, splitPath, assert } from 'common';

import Element from './Element';

import DEFAULT_PAGE from './mock/Page';

export interface EditorContextData {
	page: Page;

	placing: boolean;
	clipboard: string | null;

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

			copyNode,
			pasteNode,

			addNode,
			removeNode,
		}),
		[addNode, removeNode, copyNode, pasteNode, clipboard, placing, page]
	);

	return (
		<div class={tw`p-4 gap-4 flex flex-col w-full`} onMouseUp={handleEndPlace}>
			<div
				class={tw`w-12 h-12 bg-gray-300 rounded cursor-grab`}
				onMouseDown={startPlace}
			/>
			<EditorContext.Provider value={ctxData}>
				<Element node={page.content.sections.main} path='content.sections.main' />
			</EditorContext.Provider>
		</div>
	);
}
