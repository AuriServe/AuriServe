import { h, FunctionalComponent, VNode } from 'preact';

import { tw } from '../Twind';

export type TreeItem<Data extends Record<string, any>> = {
	[Property in keyof Data]: Data[Property];
} & {
	key: string | number;
	children?: TreeItem<Data>[];
}

export type TreeRenderProps<Data extends Record<string, any>> = {
	[Property in keyof Data]: Data[Property];
} & {
	treeLevel: number;
	hasChildren: boolean;
}

interface Props<Data> {
	data: TreeItem<Data>;
	render: FunctionalComponent<TreeRenderProps<Data>>;
}

export default function TreeView<Data>(props: Props<Data>) {
	console.log(props);

	const RenderElem = props.render;

	function getRenderProps(item: TreeItem<Data>, level: number): TreeRenderProps<Data> {
		const renderProps: any = { ...item };
		delete renderProps.children;
		delete renderProps.key;
		renderProps.treeLevel = level;
		renderProps.hasChildren = item.children && item.children.length > 0;
		return renderProps;
	}

	function flatRender(item: TreeItem<Data>, level = 0) {
		const rendered: VNode[] = [];
		rendered.push(<RenderElem key={item.key} {...getRenderProps(item, level)} />);
		for (const child of item.children ?? []) rendered.push(...flatRender(child, level + 1));
		return rendered;
	}

	return (
		<div class={tw``}>
			{flatRender(props.data)}
		</div>
	)
}
