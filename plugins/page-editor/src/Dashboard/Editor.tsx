import { traverse } from 'common';
import { Page, Node } from 'pages';
import { tw, Card } from 'dashboard';
import { h, createContext } from 'preact';
import { useState, useMemo, useCallback } from 'preact/hooks';

import Element from './Element';

import DEFAULT_PAGE from './mock/Page';

export interface EditorContextData {
	placing: boolean;
	page: Page;
	setPage: (page: Page) => void;
	snapNode: (path: string, ind: number) => void;
}

export const EditorContext = createContext<EditorContextData>(null as any);

export default function Editor() {
	const [placing, setPlacing] = useState<boolean>(false);
	const [page, setPage] = useState<Page>(DEFAULT_PAGE);

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

	const snapNode = useCallback(
		(path: string, ind: number) => {
			const newPage = { ...page };
			const children: Node[] = traverse(newPage, path);

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

	const ctxData: EditorContextData = useMemo(
		() => ({
			placing,
			page,
			setPage,
			snapNode,
		}),
		[snapNode, placing, page]
	);

	return (
		<div class={tw`p-4 gap-4 flex flex-col w-full`} onMouseUp={handleEndPlace}>
			<Card>
				<Card.Body>
					<div
						class={tw`w-12 h-12 bg-gray-300 rounded cursor-grab`}
						onMouseDown={startPlace}
					/>
				</Card.Body>
			</Card>
			<EditorContext.Provider value={ctxData}>
				<Element node={page.content.sections.main} path='content.sections.main' />
			</EditorContext.Provider>
		</div>
	);
}
