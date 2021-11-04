import { mergeClasses } from 'common/util';
import { h, createContext, VNode, ComponentChildren } from 'preact';
import { useContext, useRef, useState, useEffect, useMemo } from 'preact/hooks';

const DRAG_THRESHOLD = 8;

interface ItemData extends Record<any, any> { key: any };

interface Item extends ItemData { children?: Item[] };

interface RenderItemData { data: ItemData; level: number; dragging: boolean };

interface DragData {
	pixelPos: number;
	toPath: number[];
	itemPath: number[];
	childCount: number;
}

interface ContextData {
	drag?: DragData;
	itemHeight: number;
	transitionOffsets: boolean;
	dragClass?: string;

	handleDragStart: (path: number[]) => void;
	renderItem: (data: RenderItemData) => VNode;
}

const Context = createContext<ContextData>(undefined as any);

function updateContextDataFromProps(props: TreeViewProps,
	lastData: Omit<ContextData, keyof TreeViewProps>): ContextData {
	return {
		...lastData,
		dragClass: props.dragClass,
		itemHeight: props.itemHeight,
		renderItem: props.renderItem
	};
}

function getTreeCount(tree: Item[]): number {
	if (tree.length === 0) return 0;
	return tree.reduce<number>((n, i) => n + 1 + getTreeCount(i.children ?? []), 0);
}

function samePath(a?: number[], b?: number[]) {
	if (!a || !b) return false;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}

// function pathLte(a?: number[], b?: number[]) {
// 	if (!a || !b) return false;

// 	for (let i = 0; i < Math.min(a.length, b.length); i++)
// 		if (a[i] <= b[i]) return true;

// 	return false;

// 	// if (a.length > b.length) return true;
// 	// return false;
// 	// for (let i = 0; i < b.length; i++) {
// 	// 	if (a[i] > b[i]) return false;
// 	// 	else if (a.length < i + 1) return true;
// 	// }
// 	// return true;
// }

function shouldBump(path?: number[], to?: number[]) {
	if (!path || !to) return false;
	if (path.length > to.length) return false;
	for (let i = 0; i < path.length; i++) {
		if (path[i] > to[i]) return true;
	}
	return false;
}

function traversePath(data: Item[], path: number[]) {
	let item: Item = data[path[0]];
	for (let i = 1; i < path.length; i++) item = item.children![i];
	return item;
}

interface TreeCaptureProps {
	style?: any;
	path: number[];
	children?: ComponentChildren;
}

function TreeCapture({ path, children, style }: TreeCaptureProps) {
	const { handleDragStart } = useContext(Context);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let dragStartPos: [ number, number ] | null = null;

		const onMouseDown = (evt: MouseEvent) => {
			evt.preventDefault();
			evt.stopPropagation();
			dragStartPos = [ evt.clientX, evt.clientY ];
		};

		const cancelDragCheck = () => {
			dragStartPos = null;
		};

		const onMouseMove = (evt: MouseEvent) => {
			if (!dragStartPos) return;
			let mouseDelta = [ Math.abs(dragStartPos![0] - evt.clientX), Math.abs(dragStartPos![1] - evt.clientY) ];
			if (mouseDelta[0] > DRAG_THRESHOLD) cancelDragCheck();
			else if (mouseDelta[1] > DRAG_THRESHOLD) {
				handleDragStart(path);
				cancelDragCheck();
			}
		};

		const onMouseUp = (_evt: MouseEvent) => {
			// const totalMouseDelta = Math.sqrt(Math.pow(dragStartPos![0] - evt.clientX, 2) +
			// 	Math.pow(dragStartPos![1] - evt.clientY, 2));

			cancelDragCheck();
		};

		ref.current.addEventListener('mousedown', onMouseDown);
		ref.current.addEventListener('mousemove', onMouseMove);
		ref.current.addEventListener('mouseup', onMouseUp);

		return () => {
			ref.current.removeEventListener('mousedown', onMouseDown);
			ref.current.removeEventListener('mousemove', onMouseMove);
			ref.current.removeEventListener('mouseup', onMouseUp);
		};
	});

	return (
		<div style={style} ref={ref} children={children}/>
	);
}

interface TreeItemProps {
	item: Item;
	path: number[];
	dragging?: boolean;
}

function TreeItem({ item, path, dragging = false }: TreeItemProps) {
	const { renderItem, itemHeight, transitionOffsets, dragClass,
		drag: { itemPath, toPath, childCount } = {} as DragData } = useContext(Context);
	const Wrap = dragging ? 'div' : TreeCapture as any;

	if (samePath(path, itemPath)) return null;

	const shouldBumpDown = shouldBump(path, toPath);

	const style = {
		transform: shouldBumpDown ? 'translateY(' + ((childCount + 1) * itemHeight) + 'px)' : 'none',
		transition: transitionOffsets ? 'transform 75ms' : '',
		willChange: transitionOffsets ? 'transform' : ''
	};

	return (
		<Wrap path={path} style={style} class={dragging ? dragClass : '' ?? ''}>
			{renderItem({ data: item, level: path.length - 1, dragging })}
			{item.children && <ul class='grid'>
				{item.children.map((item, i) => <TreeItem item={item} path={[ ...path, i ]} dragging={dragging}/>)}
			</ul>}
		</Wrap>
	);
}

interface TreeViewProps {
	items: Item[];
	itemHeight: number;

	style?: any;
	class?: string;
	dragClass?: string;

	setItems: (items: any[]) => void;
	renderItem: (data: RenderItemData) => VNode;
}

export default function TreeView(props: TreeViewProps) {
	const ref = useRef<HTMLDivElement>(null);

	const [ context, setContext ] = useState<ContextData>(
		updateContextDataFromProps(props, { drag: undefined,
			transitionOffsets: false, handleDragStart: undefined as any }));

	useMemo(() => {
		const handleDragStart = (path: number[]) => {
			setContext(context => ({
				...context,
				transitionOffsets: false,
				drag: {
					pixelPos: 0,
					itemPath: path,
					toPath: path,
					childCount: getTreeCount(traversePath(props.items, path).children ?? [])
				}
			}));

			window.requestAnimationFrame(() => {
				setContext(context => ({ ...context, transitionOffsets: true }));
			});
		};

		setContext({ ...context, handleDragStart });
	}, [ props.items ]);

	useEffect(() => {
		const onMouseMove = (evt: MouseEvent) => {
			setContext((context) => {
				if (!context.drag) return context;

				const pixelPos = Math.max(Math.min(evt.pageY - ref.current.offsetTop,
					getTreeCount(props.items) * props.itemHeight - props.itemHeight / 2), props.itemHeight / 2);

				const itemPos = Math.floor(pixelPos / props.itemHeight);

				const toPath = (function recurse(
					tree: Item[], path: number[] = [], offset: number = 0): number[] {

					for (let i = 0; i < tree.length; i++) {
						if (path === context.drag.itemPath) continue;

						if (offset === itemPos) return [ ...path, i ];
						else if (tree[i].children) {
							const size = getTreeCount(tree[i].children!);
							if (offset + size >= itemPos) return recurse(tree[i].children!, [ ...path, i ], offset + 1);
							else offset += size + 1;
						}
						else offset++;
					}

					return [ ...path, tree.length ];
				})(props.items);

				return {
					...context,
					drag: { ...context.drag, pixelPos, toPath }
				} as ContextData;
			});
		};

		const onMouseUp = () => {
			setContext(context => {
				if (context.drag) {
					const data = JSON.parse(JSON.stringify(props.items));

					const fromPath = context.drag.itemPath;
					const toPath = [ ...context.drag.toPath ];

					// if (fromPath.length <= toPath.length)

					// for (let i = 0; i < Math.min(fromPath.length, toPath.length); i++)
					// 	if (toPath[i] > fromPath[i]) toPath[i]--;

					const from = fromPath.length > 1 ? traversePath(data, fromPath.slice(0, -1)).children : data;
					const to = toPath.length > 1 ? traversePath(data, fromPath.slice(0, -1)).children : data;

					const item = from.splice(fromPath.slice(-1)[0], 1);
					to.splice(toPath.slice(-1)[0], 0, item[0]);

					console.log(data);
					props.setItems(data);
				}
				return { ...context, transitionOffsets: false, drag: undefined };
			});
		};

		document.body.addEventListener('mouseup', onMouseUp);
		document.body.addEventListener('mousemove', onMouseMove);

		return () => {
			document.body.removeEventListener('mouseup', onMouseUp);
			document.body.removeEventListener('mousemove', onMouseMove);
		};
	}, [ props.items ]);

	return (
		<Context.Provider value={context}>
			<div ref={ref} class={mergeClasses('grid w-full', props.class)}
				style={{ ...props.style ?? {}, height: getTreeCount(props.items) * props.itemHeight }}>

				<div class={mergeClasses('grid items-start relative', context.drag && 'cursor-resize-ns')}>
					<ul class={mergeClasses('grid', context.drag && 'interact-none')}>
						{props.items.map((item, i) => <TreeItem item={item} path={[i]}/>)}
					</ul>

					{context.drag && <div class='absolute right-0 left-0'
						style={{ top: context.drag.pixelPos - props.itemHeight / 2 }}>

						<TreeItem dragging
							item={traversePath(props.items, context.drag.itemPath)}
							path={context.drag.toPath.map(() => -1)}/>
					</div>}
				</div>
			</div>
		</Context.Provider>
	);
}
