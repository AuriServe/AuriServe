import { Page, Node } from 'pages';
import { h, createContext } from 'preact';
import { tw, TransitionGroup } from 'dashboard';
import { useState, useMemo, useCallback, useContext, useEffect } from 'preact/hooks';
import { setPath, traversePath, buildPath, splitPath, assert } from 'common';

import ElementMenu from './ElementMenu';
import LayoutRenderer from './LayoutRenderer';
import getBoundingBox, { BoundingBox } from './BoundingBox';

export interface EditorContextData {
	page: Page;
	hovered: string | null,
	focused: string | null;

	placing: boolean;
	clipboard: string | null;

	setProps: (path: string, props: any) => void;

	hoverElement: (path: string) => void;
	unhoverElement: (path: string) => void;
	focusElement: (path: string) => void;
	unfocusElement: (path: string) => void;
	openElementMenu: (path: string, x: number, y: number) => void;

	copyNode: (path: string) => void;
	pasteNode: (path: string, position: 'before' | 'after' | 'over') => void;

	addNode: (path: string) => void;
	removeNode: (path: string) => void;
}

export const EditorContext = createContext<EditorContextData>(null as any);

export function useEditor() {
	return useContext(EditorContext);
}

function padBounds(bounds: BoundingBox, padding: number) {
	return {
		top: bounds.top - padding,
		left: bounds.left - padding,
		width: bounds.width + padding * 2,
		height: bounds.height + padding * 2
	};
}

interface Props {
	layout: string;
	initialPage: Page;
}

export default function Editor({ initialPage, layout }: Props) {
	const [page, setPage] = useState<Page>(initialPage);

	const [placing, setPlacing] = useState<boolean>(false);
	const [clipboard, setClipboard] = useState<string | null>(null);

	const [hovered, setHovered] = useState<string | null>(null);
	const [focused, setFocused] = useState<string | null>(null);
	const [menu, setMenu] = useState<{ path: string, x: number, y: number } | null>(null);

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
			setFocused(null);
			setMenu(null);
			setHovered(hovered => hovered === path ? null : hovered);
			setPage(newPage);
		},
		[page]
	);

	const focusElement = useCallback((path: string) => {
		setFocused(path);
	}, []);

	const unfocusElement = useCallback((path: string) => {
		setFocused(focused => {
			assert(focused === path, 'Tried to unfocus an element that was not focused.');
			return null;
		});
	}, []);

	const hoverElement = useCallback((path: string) => {
		setHovered(path);
	}, []);

	const unhoverElement = useCallback((path: string) => {
		setHovered(hovered => {
			assert(hovered === path, 'Tried to unhover an element that was not hovered.')
			return null;
		});
	}, []);

	const openElementMenu = useCallback((path: string, x: number, y: number) => {
		setFocused(path);
		setMenu({ path, x, y });
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
			const newPage = { ...page };

			const parentPathSegs = splitPath(target);
			const ind = parentPathSegs.pop();
			assert(typeof ind === 'number', 'Invalid path. [0]');
			const parentPath = buildPath(...parentPathSegs);

			const children: Node[] = traversePath(newPage, parentPath);
			if (position === 'over') children.splice(ind as number, 1, JSON.parse(clipboard!));
			else children.splice(position === 'before' ? ind : ind + 1, 0, JSON.parse(clipboard!));

			setPage(newPage);
		},
		[clipboard, page]
	);

	const setProps = useCallback((path: string, props: any) => {
		setPage(page => {
			delete props.children;
			const newPage = { ...page };
			setPath(newPage, `${path}.props`, props);
			return newPage;
		});
	}, []);

	useEffect(() => {
		const callback = (e: KeyboardEvent) => {
			if (e.key === 'Delete') {
				setFocused(focused => {
					if (focused) removeNode(focused);
					return null;
				});
			}
			if (e.key === 'c' && e.ctrlKey) {
				setFocused(focused => {
					if (focused) copyNode(focused);
					return focused;
				});
			}
			if (e.key === 'v' && e.ctrlKey) {
				setFocused(focused => {
					if (focused) pasteNode(focused, 'over');
					return focused;
				});
			}
			if (e.key === 'x' && e.ctrlKey) {
				setFocused(focused => {
					if (focused) {
						copyNode(focused);
						removeNode(focused);
					}
					return null;
				});
			}
		}

		window.addEventListener('keydown', callback);
		return () => window.removeEventListener('keydown', callback);

	}, [ copyNode, pasteNode, removeNode ]);

	const ctxData: EditorContextData = useMemo(
		() => ({
			placing,
			page,
			hovered,
			focused,
			clipboard,

			setProps,

			hoverElement,
			unhoverElement,
			focusElement,
			unfocusElement,
			openElementMenu,

			copyNode,
			pasteNode,

			addNode,
			removeNode,
		}),
		[ setProps, hoverElement, unhoverElement, focusElement, unfocusElement, openElementMenu,
			addNode, removeNode, copyNode, pasteNode, clipboard, placing, page, hovered, focused ]
	);

	return (
		<div class={tw`gap-4 flex flex-col w-full -mb-14`} onMouseUp={handleEndPlace} id='editor'>
			{/* <div
				class={tw`shrink-0 w-12 h-12 bg-gray-300 rounded cursor-grab`}
				onMouseDown={startPlace}
			/> */}
			<EditorContext.Provider value={ctxData}>
				<LayoutRenderer layout={layout} page={page}/>
				{menu && <ElementMenu
					path={menu.path}
					onClose={() => setMenu(null)}
					position={{ left: menu.x, top: menu.y }}
				/>}
				<TransitionGroup
					duration={75}
					enterFrom={tw`opacity-0 scale-[103%]`}
					enter={tw`transition duration-75`}
				>
					{hovered && hovered !== focused && (
						<div
							key={hovered}
							class={tw`absolute border-(2 accent-500/30) rounded-lg interact-none`}
							style={padBounds(getBoundingBox(document.getElementById(hovered)!), 4)}
						/>
					)}
				</TransitionGroup>
				<TransitionGroup
					duration={75}
					enterFrom={tw`opacity-0 scale-[103%]`}
					enter={tw`transition duration-75`}
					invertExit>
					{focused && (
						<div
							key={focused}
							class={tw`absolute border-(2 accent-400) ring-(& accent-500/25) rounded-lg interact-none`}
							style={padBounds(getBoundingBox(document.getElementById(focused)!), 8)}
						/>
					)}
				</TransitionGroup>
			</EditorContext.Provider>
		</div>
	);
}
